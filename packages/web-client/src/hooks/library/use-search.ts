import {
  Orama,
  Results,
  TypedDocument,
  create,
  insertMultiple,
  remove,
  insert,
  search,
} from '@orama/orama'
import { useCallback, useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Filter } from '@shared/types/common/filter'
import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { LibrarySearch_DataSourceImpl } from '@repositories/modules/library-search/infrastructure/data-sources/library-search.data-source-impl'
import { LibrarySearch_RepositoryImpl } from '@repositories/modules/library-search/infrastructure/repositories/library-search.repository-impl'
import { GetSearchableBookmarksOnAuthorizedUser_UseCase } from '@repositories/modules/library-search/domain/usecases/get-searchable-bookmarks-on-authorized-user.user-case'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import {
  afterInsert as highlightAfterInsert,
  searchWithHighlight,
  saveWithHighlight,
  loadWithHighlight,
} from '@orama/plugin-match-highlight'
import { system_values } from '@shared/constants/system-values'
import localforage from 'localforage'
import { browser_storage } from '@/constants/browser-storage'
import { GetLastUpdatedAtOnAuthorizedUser_UseCase } from '@repositories/modules/library-search/domain/usecases/get-last-updated-at-on-authorized-user.use-case'
import { useSearchParams } from 'next/navigation'
import { get_site_variants_for_search } from '@shared/utils/get-site-variants-for-search'

export type BookmarkOfSearch = {
  id: number
  created_at: string
  visited_at: string
  updated_at: string
  title?: string
  note?: string
  is_archived: boolean
  is_unread: boolean
  stars?: number
  tags: string[]
  links: { url: string; site_path?: string }[]
  tag_ids: number[]
}

type Hint = {
  type: 'new' | 'recent'
  search_string: string
  completion: string
  yields?: number
}

type Highlights = {
  [id: string]: [number, number][]
}

const schema = {
  id: 'string',
  title: 'string',
  note: 'string',
  tag_ids: 'string[]',
  sites: 'string[]',
  sites_variants: 'string[]',
  tags: 'string[]',
  created_at: 'number',
  updated_at: 'number',
  visited_at: 'number',
  is_unread: 'boolean',
  stars: 'number',
} as const

type Result = TypedDocument<Orama<typeof schema>>

type BookmarkTags = { id: number; tags: string[] }

export const use_search = () => {
  const query_params = useSearchParams()
  const [is_search_focused, set_is_search_focused] = useState(false)
  const [is_caching_bookmarks, set_is_caching_bookmarks] = useState(false)
  const [bookmarks_just_tags, set_bookmarks_just_tags] =
    useState<BookmarkTags[]>()
  const [archived_bookmarks_just_tags, set_archived_bookmarks_just_tags] =
    useState<BookmarkTags[]>()
  const [current_filter, set_current_filter] = useState<Filter>()
  const [selected_tags, set_selected_tags] = useState<string[]>([])
  const [ids_to_search_amongst, set_ids_to_search_amongst] = useState<
    string[] | undefined
  >()
  const dispatch = use_library_dispatch()
  const { bookmarks } = use_library_selector((state) => state.bookmarks)
  const [is_initializing, set_is_initializing] = useState(false)
  const [search_string, set_search_string] = useState('')
  const [hints, set_hints] = useState<Hint[]>()
  const [db, set_db] = useState<Orama<typeof schema>>()
  const [archived_db, set_archived_db] = useState<Orama<typeof schema>>()
  const [indexed_bookmarks_percentage, set_indexed_bookmarks_percentage] =
    useState<number | undefined>()
  const [result, set_result] = useState<Results<Result>>()
  const [highlights, set_highlights] = useState<Highlights>()
  const [highlights_note, set_highlights_note] = useState<Highlights>()
  const [highlights_sites_variants, set_highlights_sites_variants] =
    useState<string[]>()
  const [count, set_count] = useState<number>()

  useUpdateEffect(() => {
    if (
      (current_filter != Filter.Archived && !bookmarks_just_tags) ||
      (current_filter == Filter.Archived && !archived_bookmarks_just_tags)
    )
      return

    if (selected_tags.length) {
      set_ids_to_search_amongst(
        (current_filter != Filter.Archived
          ? bookmarks_just_tags!
          : archived_bookmarks_just_tags!
        )
          .filter((bookmark) =>
            selected_tags.every((tag) => bookmark.tags.includes(tag)),
          )
          .map((bookmark) => bookmark.id.toString()),
      )
    } else if (is_search_focused) {
      get_hints()
    }
  }, [selected_tags, bookmarks_just_tags, archived_bookmarks_just_tags])

  useUpdateEffect(() => {
    get_hints()
  }, [ids_to_search_amongst])

  const check_is_cache_stale = async (params: {
    api_url: string
    auth_token: string
    is_archived: boolean
  }): Promise<boolean> => {
    const cache_updated_at = await localforage.getItem<Date>(
      !params.is_archived
        ? browser_storage.local_forage.authorized_library.search.cached_at
        : browser_storage.local_forage.authorized_library.search
            .archived_cached_at,
    )

    if (cache_updated_at) {
      let updated_at: Date | undefined

      const data_source = new LibrarySearch_DataSourceImpl(
        params.api_url,
        params.auth_token,
      )
      const repository = new LibrarySearch_RepositoryImpl(data_source)
      const get_last_updated_at_on_authorized_user_use_case =
        new GetLastUpdatedAtOnAuthorizedUser_UseCase(repository)
      const result =
        await get_last_updated_at_on_authorized_user_use_case.invoke()

      !params.is_archived
        ? (updated_at = result.updated_at)
        : (updated_at = result.archived_updated_at)

      if (updated_at && updated_at.getTime() > cache_updated_at.getTime()) {
        await localforage.removeItem(
          !params.is_archived
            ? browser_storage.local_forage.authorized_library.search.cached_at
            : browser_storage.local_forage.authorized_library.search
                .archived_cached_at,
        )
        await localforage.removeItem(
          !params.is_archived
            ? browser_storage.local_forage.authorized_library.search.bookmarks
            : browser_storage.local_forage.authorized_library.search
                .archived_bookmarks,
        )
        await localforage.removeItem(
          !params.is_archived
            ? browser_storage.local_forage.authorized_library.search.index
            : browser_storage.local_forage.authorized_library.search
                .archived_index,
        )
        return true
      } else {
        return false
      }
    }
    return true
  }

  const init = async (params: { is_archived: boolean }) => {
    set_is_initializing(true)

    const db = await create({
      schema,
      sort: {
        unsortableProperties: [
          'id',
          'title',
          'note',
          'sites',
          'sites_variants',
          'is_unread',
          'stars',
        ],
      },
      plugins: [
        {
          name: 'highlight',
          afterInsert: highlightAfterInsert,
        },
      ],
    })

    const cached_bookmarks = await localforage.getItem<string>(
      !params.is_archived
        ? browser_storage.local_forage.authorized_library.search.bookmarks
        : browser_storage.local_forage.authorized_library.search
            .archived_bookmarks,
    )
    const cached_index = await localforage.getItem<string>(
      !params.is_archived
        ? browser_storage.local_forage.authorized_library.search.index
        : browser_storage.local_forage.authorized_library.search.archived_index,
    )

    if (cached_bookmarks && cached_index) {
      !params.is_archived
        ? set_bookmarks_just_tags(JSON.parse(cached_bookmarks))
        : set_archived_bookmarks_just_tags(JSON.parse(cached_bookmarks))
      await loadWithHighlight(db, JSON.parse(cached_index as any))
    } else {
      const data_source = new LibrarySearch_DataSourceImpl(
        process.env.NEXT_PUBLIC_API_URL,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
      )
      const repository = new LibrarySearch_RepositoryImpl(data_source)
      const get_searchable_bookmarks =
        new GetSearchableBookmarksOnAuthorizedUser_UseCase(repository)
      const { bookmarks } = await get_searchable_bookmarks.invoke({
        is_archived: params.is_archived,
        public_only: false,
      })

      const chunk_size = 1000
      let indexed_count = 0
      for (let i = 0; i < bookmarks.length; i += chunk_size) {
        const chunk = bookmarks.slice(i, i + chunk_size)
        await insertMultiple(
          db,
          chunk.map((bookmark) => ({
            id: bookmark.id.toString(),
            title:
              (bookmark.title ? `${bookmark.title} ` : '') +
              bookmark.tags.join(' ') +
              (bookmark.tags.length ? ' ' : '') +
              bookmark.sites.map((site) => site.replace('/', ' › ')).join(' '),
            note: bookmark.note
              ? `${bookmark.note} ` +
                bookmark.tags.join(' ') +
                (bookmark.tags.length ? ' ' : '') +
                bookmark.sites.map((site) => site.replace('/', ' › ')).join(' ')
              : '',
            sites: bookmark.sites,
            sites_variants: bookmark.sites
              .map((site) => get_site_variants_for_search(site))
              .flat(),
            tags: bookmark.tags,
            created_at: bookmark.created_at,
            updated_at: bookmark.updated_at,
            visited_at: bookmark.visited_at,
            is_unread: bookmark.is_unread,
            stars: bookmark.stars,
          })),
          chunk_size,
        )
        indexed_count += chunk.length
        const progress_percentage = Math.floor(
          (indexed_count / bookmarks.length) * 100,
        )
        set_indexed_bookmarks_percentage(
          progress_percentage < 100 ? progress_percentage : undefined,
        )
      }
      const bookmarks_just_tags: BookmarkTags[] = bookmarks.map((bookmark) => ({
        id: bookmark.id,
        tags: bookmark.tags,
      }))
      !params.is_archived
        ? set_bookmarks_just_tags(bookmarks_just_tags)
        : set_archived_bookmarks_just_tags(bookmarks_just_tags)
      cache_data({ db, bookmarks_just_tags, is_archived: params.is_archived })
    }

    !params.is_archived ? set_db(db) : set_archived_db(db)
    set_is_initializing(false)
  }

  const cache_data = async (params: {
    db: Orama<typeof schema>
    bookmarks_just_tags: BookmarkTags[]
    is_archived: boolean
  }) => {
    set_is_caching_bookmarks(true)
    const index = await saveWithHighlight(params.db)
    await localforage.setItem(
      !params.is_archived
        ? browser_storage.local_forage.authorized_library.search.index
        : browser_storage.local_forage.authorized_library.search.archived_index,
      JSON.stringify(index),
    )
    await localforage.setItem(
      !params.is_archived
        ? browser_storage.local_forage.authorized_library.search.bookmarks
        : browser_storage.local_forage.authorized_library.search
            .archived_bookmarks,
      JSON.stringify(params.bookmarks_just_tags),
    )
    await localforage.setItem(
      !params.is_archived
        ? browser_storage.local_forage.authorized_library.search.cached_at
        : browser_storage.local_forage.authorized_library.search
            .archived_cached_at,
      new Date(),
    )
    set_is_caching_bookmarks(false)
  }

  const get_hits = async (params: {
    search_string: string
  }): Promise<Results<Result>['hits']> => {
    if (
      (current_filter != Filter.Archived && !db) ||
      (current_filter == Filter.Archived && !archived_db)
    )
      throw new Error('DB should be there.')

    const tags = query_params.get('t')
    const gte = query_params.get('gte')
    const lte = query_params.get('lte')
    const order = query_params.get('o')
    const sortby = query_params.get('s')

    // 'lorem @abc.com @abc.com ipsum @abc.com'
    // ["abccom", "abccom", "abccom"]
    const sites_variants = get_sites_variants_from_search_string(
      params.search_string,
    )

    const term = params.search_string.replace(/(?=@)(.*?)($|\s)/g, '').trim()

    const result_without_tolerance: Results<Result> = await searchWithHighlight(
      current_filter != Filter.Archived ? db! : archived_db!,
      {
        limit:
          term.length <= 2 ? 100 : system_values.max_library_search_results,
        term,
        properties: ['title', 'note'],
        where: {
          ...(tags && ids_to_search_amongst
            ? { id: ids_to_search_amongst }
            : {}),
          ...(current_filter == Filter.Unread
            ? {
                is_unread: true,
              }
            : {}),
          stars: {
            gte:
              current_filter == Filter.Starred ||
              current_filter == Filter.StarredUnread
                ? 1
                : 0,
          },
          ...(gte && lte
            ? {
                created_at: {
                  between: [
                    new Date(
                      parseInt(gte.toString().substring(0, 4)),
                      parseInt(gte.toString().substring(4, 6)) - 1,
                    ).getTime() / 1000,
                    new Date(
                      parseInt(lte.toString().substring(0, 4)),
                      parseInt(lte.toString().substring(4, 6)),
                    ).getTime() /
                      1000 -
                      1,
                  ],
                },
              }
            : {}),
          ...(sites_variants?.length ? { sites_variants } : {}),
        },
        sortBy: {
          property:
            sortby == '1'
              ? 'updated_at'
              : sortby == '2'
              ? 'visited_at'
              : 'created_at',
          order: order == '1' ? 'ASC' : 'DESC',
        },
        threshold: term ? 0 : undefined,
      },
    )

    const result_with_tolerance: Results<Result> = await searchWithHighlight(
      current_filter != Filter.Archived ? db! : archived_db!,
      {
        limit:
          term.length <= 2 ? 100 : system_values.max_library_search_results,
        term,
        properties: ['title', 'note'],
        where: {
          ...(tags && ids_to_search_amongst
            ? { id: ids_to_search_amongst }
            : {}),
          ...(current_filter == Filter.Unread ||
          current_filter == Filter.StarredUnread
            ? {
                is_unread: true,
              }
            : {}),
          stars: {
            gte:
              current_filter == Filter.Starred ||
              current_filter == Filter.StarredUnread
                ? 1
                : 0,
          },
          ...(gte && lte
            ? {
                created_at: {
                  between: [
                    new Date(
                      parseInt(gte.toString().substring(0, 4)),
                      parseInt(gte.toString().substring(4, 6)) - 1,
                    ).getTime() / 1000,
                    new Date(
                      parseInt(lte.toString().substring(0, 4)),
                      parseInt(lte.toString().substring(4, 6)),
                    ).getTime() /
                      1000 -
                      1,
                  ],
                },
              }
            : {}),
          ...(sites_variants?.length ? { sites_variants } : {}),
        },
        sortBy: {
          property:
            sortby == '1'
              ? 'updated_at'
              : sortby == '2'
              ? 'visited_at'
              : 'created_at',
          order: order == '1' ? 'ASC' : 'DESC',
        },
        threshold: term ? 0 : undefined,
        tolerance: term ? 1 : undefined,
      },
    )

    const merged_hits = [
      ...result_without_tolerance.hits,
      ...result_with_tolerance.hits,
    ]

    const merged_hits_no_dupes: Results<Result>['hits'] = []

    merged_hits.forEach((hit) => {
      if (
        merged_hits_no_dupes.findIndex(
          (merged_hit) => merged_hit.id == hit.id,
        ) == -1
      ) {
        merged_hits_no_dupes.push(hit)
      }
    })

    merged_hits_no_dupes.sort((a: any, b: any) => {
      if (sortby == '1') {
        if (order == '1') {
          return a.document.updated_at - b.document.updated_at
        } else {
          return b.document.updated_at - a.document.updated_at
        }
      } else if (sortby == '2') {
        if (order == '1') {
          return a.document.visited_at - b.document.visited_at
        } else {
          return b.document.visited_at - a.document.visited_at
        }
      } else {
        if (order == '1') {
          return a.document.created_at - b.document.created_at
        } else {
          return b.document.created_at - a.document.created_at
        }
      }
    })

    return merged_hits_no_dupes.slice(
      0,
      system_values.max_library_search_results,
    )
  }

  const query_db = async (params: {
    search_string: string
    set_highlights_only?: boolean
  }) => {
    const hits = await get_hits({ search_string: params.search_string })

    if (!params.set_highlights_only) {
      set_result({
        count:
          hits.length == system_values.max_library_search_results
            ? system_values.max_library_search_results
            : hits.length,
        elapsed: { formatted: '', raw: 0 },
        hits,
      })
    }

    // Defer setting highlights to the next frame, just after bookmark fetching has begun.
    setTimeout(() => {
      set_highlights(
        hits.reduce((a, v) => {
          const positions = Object.values((v as any).positions.title)
            .flat()
            .map((highlight: any) => [highlight.start, highlight.length])

          const new_positions: any = []

          for (let i = 0; i < positions.length; i++) {
            if (
              positions[i + 1] &&
              positions[i][0] + positions[i][1] == positions[i + 1][0] - 1
            ) {
              new_positions.push([positions[i][0], positions[i][1] + 1])
            } else {
              new_positions.push([positions[i][0], positions[i][1]])
            }
          }

          return {
            ...a,
            [v.id]: new_positions,
          }
        }, {}),
      )

      set_highlights_note(
        hits.reduce((a, v) => {
          const positions = Object.values((v as any).positions.note)
            .flat()
            .map((highlight: any) => [highlight.start, highlight.length])

          const new_positions: any = []

          for (let i = 0; i < positions.length; i++) {
            if (
              positions[i + 1] &&
              positions[i][0] + positions[i][1] == positions[i + 1][0] - 1
            ) {
              new_positions.push([positions[i][0], positions[i][1] + 1])
            } else {
              new_positions.push([positions[i][0], positions[i][1]])
            }
          }

          return {
            ...a,
            [v.id]: new_positions,
          }
        }, {}),
      )

      set_highlights_sites_variants(
        get_sites_variants_from_search_string(params.search_string),
      )
    }, 0)

    if (hits.length) {
      let recent_searches: string[] = []

      recent_searches = JSON.parse(
        localStorage.getItem(
          browser_storage.local_storage.authorized_library.recent_searches,
        ) || '[]',
      )

      localStorage.setItem(
        browser_storage.local_storage.authorized_library.recent_searches,
        JSON.stringify([
          ...new Set(
            [
              params.search_string.toLowerCase().trim(),
              ...recent_searches,
            ].slice(0, 1000),
          ),
        ]),
      )
    }
  }

  const get_hints = async () => {
    if (
      (current_filter != Filter.Archived && !db) ||
      (current_filter == Filter.Archived && !archived_db)
    )
      throw new Error('DB should be there.')

    const tags = query_params.get('t')
    const gte = query_params.get('gte')
    const lte = query_params.get('lte')
    const order = query_params.get('o')
    const sortby = query_params.get('s')

    const search_string_lower = search_string.toLowerCase()

    const words = search_string_lower.split(' ')
    const last_word = words[words.length - 1]
    const sites_variants = search_string_lower
      .match(/(?<=@)(.*?)($|\s)/g)
      ?.map((site) => site.replaceAll('.', '').replaceAll('/', ''))
    const term = search_string_lower.replace(/(?=@)(.*?)($|\s)/g, '').trim()

    if (!search_string) {
      const recent_searches = JSON.parse(
        localStorage.getItem(
          browser_storage.local_storage.authorized_library.recent_searches,
        ) || '[]',
      ) as string[]

      set_hints(
        recent_searches
          .slice(0, system_values.max_library_search_hints)
          .map((recent_search_string) => ({
            type: 'recent',
            completion: recent_search_string.slice(search_string.length),
            search_string: '',
          })),
      )
    } else {
      const recent_hints: Hint[] = (
        JSON.parse(
          localStorage.getItem(
            browser_storage.local_storage.authorized_library.recent_searches,
          ) || '[]',
        ) as string[]
      )
        .filter(
          (recent_search_string) =>
            recent_search_string != search_string_lower &&
            recent_search_string.startsWith(search_string_lower),
        )
        .slice(0, 3)
        .map((recent_search_string) => ({
          type: 'recent',
          completion: recent_search_string.slice(search_string.length),
          search_string: search_string_lower,
        }))

      if (last_word.substring(0, 1) == '@') {
        const site_term = last_word.substring(1)

        const result: Results<Result> = await search(
          current_filter != Filter.Archived ? db! : archived_db!,
          {
            limit:
              site_term.length <= 2
                ? 100
                : system_values.max_library_search_results,
            term: site_term ? site_term : undefined,
            properties: ['sites'],
            where: {
              ...(tags && ids_to_search_amongst
                ? { id: ids_to_search_amongst }
                : {}),
              ...(current_filter == Filter.Unread ||
              current_filter == Filter.StarredUnread
                ? {
                    is_unread: true,
                  }
                : {}),
              stars: {
                gte:
                  current_filter == Filter.Starred ||
                  current_filter == Filter.StarredUnread
                    ? 1
                    : 0,
              },
              ...(gte && lte
                ? {
                    created_at: {
                      between: [
                        new Date(
                          parseInt(gte.toString().substring(0, 4)),
                          parseInt(gte.toString().substring(4, 6)) - 1,
                        ).getTime() / 1000,
                        new Date(
                          parseInt(lte.toString().substring(0, 4)),
                          parseInt(lte.toString().substring(4, 6)),
                        ).getTime() /
                          1000 -
                          1,
                      ],
                    },
                  }
                : {}),
            },
            threshold: site_term ? 0 : undefined,
          },
        )

        const sites: { site: string; occurences: number }[] = []

        result.hits.forEach(({ document }) => {
          document.sites.forEach((site) => {
            if (site.includes(site_term)) {
              const index = sites.findIndex((s) => s.site == site)
              if (index == -1) {
                sites.push({ site, occurences: 1 })
              } else {
                sites[index] = {
                  ...sites[index],
                  occurences: sites[index].occurences + 1,
                }
              }
            }
          })
        })

        sites.sort((a, b) => b.occurences - a.occurences)

        const hints: Hint[] = sites.map((site) => ({
          search_string: search_string_lower,
          completion: site_term ? site.site.split(site_term)[1] : site.site,
          type: 'new',
        }))

        const hints_no_dupes: Hint[] = []

        hints.forEach((hint) => {
          const hint_index = hints_no_dupes.findIndex(
            (h) => h.completion == hint.completion,
          )

          if (hint_index == -1) {
            hints_no_dupes.push(hint)
          }
        })

        const hints_no_empty_completions = hints_no_dupes.filter(
          (hint) => hint.completion,
        )

        set_hints(
          [
            ...recent_hints,
            ...hints_no_empty_completions.filter(
              (hint) =>
                !recent_hints.find(
                  (recent_hint) => recent_hint.completion == hint.completion,
                ),
            ),
          ].slice(0, system_values.max_library_search_hints),
        )
      } else {
        const ids_of_hits = (
          await get_hits({ search_string: search_string_lower })
        ).map((hit) => hit.id)

        if (last_word.length) {
          const result: Results<Result> = await search(
            current_filter != Filter.Archived ? db! : archived_db!,
            {
              limit:
                term.length <= 2
                  ? 100
                  : system_values.max_library_search_results,
              term,
              properties: ['title', 'note'],
              where: {
                id: ids_of_hits,
                ...(current_filter == Filter.Unread ||
                current_filter == Filter.StarredUnread
                  ? {
                      is_unread: true,
                    }
                  : {}),
                stars: {
                  gte:
                    current_filter == Filter.Starred ||
                    current_filter == Filter.StarredUnread
                      ? 1
                      : 0,
                },
                ...(gte && lte
                  ? {
                      created_at: {
                        between: [
                          new Date(
                            parseInt(gte.toString().substring(0, 4)),
                            parseInt(gte.toString().substring(4, 6)) - 1,
                          ).getTime() / 1000,
                          new Date(
                            parseInt(lte.toString().substring(0, 4)),
                            parseInt(lte.toString().substring(4, 6)),
                          ).getTime() /
                            1000 -
                            1,
                        ],
                      },
                    }
                  : {}),
                ...(sites_variants?.length ? { sites_variants } : {}),
              },
              sortBy: {
                property:
                  sortby == '1'
                    ? 'updated_at'
                    : sortby == '2'
                    ? 'visited_at'
                    : 'created_at',
                order: order == '1' ? 'ASC' : 'DESC',
              },
              threshold: 0,
            },
          )

          let words_hashmap: { [word: string]: number } = {}

          result.hits.forEach(({ document }) => {
            const word = document.title
              .toLowerCase()
              .split(last_word)[1]
              ?.replace(/[^a-zA-Z ]/g, ' ')
              .split(' ')[0]

            if (word) {
              if (words_hashmap[word]) {
                words_hashmap[word] = words_hashmap[word] + 1
              } else {
                words_hashmap = { ...words_hashmap, [word]: 1 }
              }
            } else {
              const word = document.note
                .toLowerCase()
                .split(last_word)[1]
                ?.replace(/[^a-zA-Z ]/g, ' ')
                .split(' ')[0]
              if (word) {
                if (words_hashmap[word]) {
                  words_hashmap[word] = words_hashmap[word] + 1
                } else {
                  words_hashmap = { ...words_hashmap, [word]: 1 }
                }
              }
            }
          })

          const new_hints: Hint[] = []

          Object.entries(words_hashmap).map(([k, v]) => {
            if (!words.includes(last_word + k)) {
              new_hints.push({
                search_string: search_string_lower,
                completion: k,
                type: 'new',
                yields: v,
              })
            }
          })

          new_hints.sort((a, b) => b.yields! - a.yields!)

          set_hints(
            [
              ...(new_hints.length > 0
                ? new_hints.length > system_values.max_library_search_hints
                  ? recent_hints
                  : recent_hints.filter((hint) =>
                      recent_hints.find(
                        (recent_hint) =>
                          recent_hint.completion == hint.completion,
                      ),
                    )
                : []),
              ...new_hints.filter(
                (hint) =>
                  !recent_hints.find(
                    (recent_hint) => recent_hint.completion == hint.completion,
                  ),
              ),
            ].slice(0, system_values.max_library_search_hints),
          )
        } else {
          const result: Results<Result> = await search(
            current_filter != Filter.Archived ? db! : archived_db!,
            {
              limit:
                term.length <= 2
                  ? 100
                  : system_values.max_library_search_results,
              term: term ? term : undefined,
              properties: ['title', 'note'],
              where: {
                id: ids_of_hits,
                ...(current_filter == Filter.Unread ||
                current_filter == Filter.StarredUnread
                  ? {
                      is_unread: true,
                    }
                  : {}),
                stars: {
                  gte:
                    current_filter == Filter.Starred ||
                    current_filter == Filter.StarredUnread
                      ? 1
                      : 0,
                },
                ...(gte && lte
                  ? {
                      created_at: {
                        between: [
                          new Date(
                            parseInt(gte.toString().substring(0, 4)),
                            parseInt(gte.toString().substring(4, 6)) - 1,
                          ).getTime() / 1000,
                          new Date(
                            parseInt(lte.toString().substring(0, 4)),
                            parseInt(lte.toString().substring(4, 6)),
                          ).getTime() /
                            1000 -
                            1,
                        ],
                      },
                    }
                  : {}),
                ...(sites_variants?.length ? { sites_variants } : {}),
              },
              sortBy: {
                property:
                  sortby == '1'
                    ? 'updated_at'
                    : sortby == '2'
                    ? 'visited_at'
                    : 'created_at',
                order: order == '1' ? 'ASC' : 'DESC',
              },
              threshold: term ? 0 : undefined,
            },
          )

          let tags_hashmap: { [tag: string]: number } = {}

          result.hits.forEach(({ document }) => {
            document.tags.forEach((tag) => {
              if (term.split(' ').includes(tag) || selected_tags.includes(tag))
                return
              if (tags_hashmap[tag]) {
                tags_hashmap[tag] = tags_hashmap[tag] + 1
              } else {
                tags_hashmap = { ...tags_hashmap, [tag]: 1 }
              }
            })
          })

          const new_hints: Hint[] = []

          Object.keys(tags_hashmap).map((k) => {
            new_hints.push({
              search_string: search_string_lower,
              completion: k,
              type: 'new',
            })
          })

          new_hints.sort((a, b) => b.yields! - a.yields!)

          set_hints(
            [...recent_hints, ...new_hints].slice(
              0,
              system_values.max_library_search_hints,
            ),
          )
        }
      }
    }
  }

  useUpdateEffect(() => {
    if (is_search_focused) {
      set_result(undefined)
      get_hints()
    }
  }, [search_string])

  const clear_hints = () => {
    set_hints(undefined)
  }

  const remove_recent_hint = (params: { search_string: string }) => {
    localStorage.setItem(
      browser_storage.local_storage.authorized_library.recent_searches,
      JSON.stringify(
        JSON.parse(
          localStorage.getItem(
            browser_storage.local_storage.authorized_library.recent_searches,
          ) || '[]',
        ).filter(
          (recent_serach_string: string) =>
            recent_serach_string != params.search_string,
        ),
      ),
    )
    setTimeout(() => {
      get_hints()
      set_is_search_focused(true)
    }, 100)
  }

  const reset = () => {
    set_search_string('')
    set_result(undefined)
    set_hints(undefined)
    set_highlights(undefined)
    set_highlights_note(undefined)
    set_highlights_sites_variants(undefined)
  }

  const get_bookmarks = (params: { should_get_next_page?: boolean }) => {
    clear_hints()
    if (result?.count) {
      if (!params.should_get_next_page) {
        dispatch(
          bookmarks_actions.get_bookmarks_by_ids_authorized({
            api_url: process.env.NEXT_PUBLIC_API_URL,
            auth_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
            is_next_page: false,
            request_params: {
              ids: result.hits.slice(0, 20).map((hit) => parseInt(hit.id)),
            },
          }),
        )
      } else if (bookmarks && bookmarks.length < result.hits.length) {
        dispatch(
          bookmarks_actions.get_bookmarks_by_ids_authorized({
            api_url: process.env.NEXT_PUBLIC_API_URL,
            auth_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
            is_next_page: true,
            request_params: {
              ids: result.hits
                .slice(bookmarks.length, bookmarks.length + 20)
                .map((hit) => parseInt(hit.id)),
            },
          }),
        )
      }
    }
  }

  useUpdateEffect(() => {
    if (result) {
      get_bookmarks({})
      set_count(result.count)
    } else {
      set_count(undefined)
    }
  }, [result])

  const delete_searchable_bookmark = async (params: {
    bookmark_id: number
  }) => {
    if (current_filter != Filter.Archived) {
      if (!db) return
      await remove(db, params.bookmark_id.toString())
      const new_all_bookmarks = bookmarks_just_tags!.filter(
        (bookmark) => bookmark.id != params.bookmark_id,
      )
      set_bookmarks_just_tags(new_all_bookmarks)
      setTimeout(() => {
        cache_data({
          db: db!,
          bookmarks_just_tags: new_all_bookmarks,
          is_archived: false,
        })
      }, 0)
    } else {
      if (!archived_db) return
      await remove(archived_db, params.bookmark_id.toString())
      const new_archived_bookmarks_just_tags =
        archived_bookmarks_just_tags!.filter(
          (bookmark) => bookmark.id != params.bookmark_id,
        )
      set_archived_bookmarks_just_tags(new_archived_bookmarks_just_tags)
      setTimeout(() => {
        cache_data({
          db: archived_db!,
          bookmarks_just_tags: new_archived_bookmarks_just_tags,
          is_archived: true,
        })
      }, 0)
    }
  }

  const update_searchable_bookmark = async (params: {
    bookmark: BookmarkOfSearch
  }) => {
    if (
      (current_filter != Filter.Archived && !db) ||
      (current_filter == Filter.Archived && !archived_db)
    )
      return

    await remove(
      current_filter != Filter.Archived ? db! : archived_db!,
      params.bookmark.id.toString(),
    )
    const sites = params.bookmark.links.map(
      (link) =>
        `${get_domain_from_url(link.url)}${
          link.site_path ? `/${link.site_path}` : ''
        }`,
    )

    if (
      (current_filter == Filter.Archived && params.bookmark.is_archived) ||
      (current_filter != Filter.Archived && !params.bookmark.is_archived)
    ) {
      await insert(current_filter != Filter.Archived ? db! : archived_db!, {
        id: params.bookmark.id.toString(),
        title:
          (params.bookmark.title ? `${params.bookmark.title} ` : '') +
          params.bookmark.tags.join(' ') +
          (sites.length ? ' ' : '') +
          sites.join(' '),
        note: params.bookmark.note
          ? `${params.bookmark.note} ` +
            params.bookmark.tags.join(' ') +
            (sites.length ? ' ' : '') +
            sites.join(' ')
          : '',
        created_at: new Date(params.bookmark.created_at).getTime() / 1000,
        updated_at: new Date(params.bookmark.updated_at).getTime() / 1000,
        visited_at: new Date(params.bookmark.visited_at).getTime() / 1000,
        is_unread: params.bookmark.is_unread,
        sites,
        sites_variants: sites
          .map((site) => get_site_variants_for_search(site))
          .flat(),
        stars: params.bookmark.stars || 0,
        tags: params.bookmark.tags,
        tag_ids: params.bookmark.tag_ids.map((tag_id) => tag_id.toString()),
      })
    }

    if (current_filter != Filter.Archived) {
      const new_bookmarks_just_tags = bookmarks_just_tags!.filter(
        (bookmark) => bookmark.id != params.bookmark.id,
      )
      if (!params.bookmark.is_archived) {
        new_bookmarks_just_tags.push({
          id: params.bookmark.id,
          tags: params.bookmark.tags,
        })
      }
      set_bookmarks_just_tags(new_bookmarks_just_tags)
      setTimeout(() => {
        cache_data({
          db: db!,
          bookmarks_just_tags: new_bookmarks_just_tags,
          is_archived: false,
        })
      }, 0)
    } else {
      const new_archived_bookmarks_just_tags =
        archived_bookmarks_just_tags!.filter(
          (bookmark) => bookmark.id != params.bookmark.id,
        )
      if (params.bookmark.is_archived) {
        new_archived_bookmarks_just_tags.push({
          id: params.bookmark.id,
          tags: params.bookmark.tags,
        })
      }
      set_archived_bookmarks_just_tags(new_archived_bookmarks_just_tags)
      setTimeout(() => {
        cache_data({
          db: archived_db!,
          bookmarks_just_tags: new_archived_bookmarks_just_tags,
          is_archived: true,
        })
      }, 0)
    }
    if (result && result.count > 0)
      await query_db({ search_string, set_highlights_only: true })
  }

  return {
    is_search_focused,
    set_is_search_focused,
    search_string,
    set_search_string,
    hints,
    clear_hints,
    get_hints,
    init,
    query_db,
    is_caching_bookmarks,
    result,
    is_initializing,
    db,
    archived_db,
    get_bookmarks,
    delete_searchable_bookmark,
    update_searchable_bookmark,
    set_current_filter,
    set_selected_tags,
    indexed_bookmarks_percentage,
    reset,
    count,
    set_count,
    highlights,
    highlights_note,
    check_is_cache_stale,
    remove_recent_hint,
    current_filter,
    highlights_sites_variants,
  }
}

const get_sites_variants_from_search_string = (search_string: string) => {
  return search_string
    .match(/(?<=@)(.*?)($|\s)/g)
    ?.map((site) => site.replaceAll('.', '').replaceAll('/', '').trim())
    .filter((variant) => variant != '')
}
