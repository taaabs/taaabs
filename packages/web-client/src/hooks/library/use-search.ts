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
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { LibrarySearch_DataSourceImpl } from '@repositories/modules/library-search/infrastructure/data-sources/library-search.data-source-impl'
import { LibrarySearch_RepositoryImpl } from '@repositories/modules/library-search/infrastructure/repositories/library-search.repository-impl'
import { GetSearchableBookmarksOnAuthorizedUser_UseCase } from '@repositories/modules/library-search/domain/usecases/get-searchable-bookmarks-on-authorized-user.user-case'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { get_site_variants_for_search } from '@/utils/get-site-variants-for-search'
import {
  afterInsert as highlightAfterInsert,
  searchWithHighlight,
  saveWithHighlight,
  loadWithHighlight,
} from '@orama/plugin-match-highlight'
import { system_values } from '@shared/constants/system-values'
import localforage from 'localforage'
import { browser_storage } from '@/constants/browser-storage'
import { persist, restore } from '@orama/plugin-data-persistence'

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
  tag_ids: 'string[]',
  sites: 'string[]',
  sites_variants: 'string[]',
  tags: 'string[]',
  created_at: 'number',
  updated_at: 'number',
  visited_at: 'number',
  is_archived: 'boolean',
  is_unread: 'boolean',
  stars: 'number',
} as const

type Result = TypedDocument<Orama<typeof schema>>

type BookmarkTags = { id: number; tags: string[] }

export const use_search = () => {
  const query_params = use_shallow_search_params()
  const [is_search_focused, set_is_search_focused] = useState(false)
  const [all_bookmarks, set_all_bookmarks] = useState<BookmarkTags[]>()
  const [current_filter, set_current_filter] = useState<LibraryFilter>()
  const [selected_tags, set_selected_tags] = useState<string[]>([])
  const [ids_to_search_amongst, set_ids_to_search_amongst] = useState<
    string[] | undefined
  >()
  const dispatch = use_library_dispatch()
  const { bookmarks } = use_library_selector((state) => state.bookmarks)
  const [is_initializing, set_is_initializing] = useState(false)
  const [search_string, set_search_string] = useState('')
  const [hints, set_hints] = useState<Hint[] | undefined>()
  const [db, set_db] = useState<Orama<typeof schema> | undefined>()
  const [indexed_bookmarks_percentage, set_indexed_bookmarks_percentage] =
    useState<number | undefined>()
  const [result, set_result] = useState<Results<Result> | undefined>()
  const [highlights, set_highlights] = useState<Highlights>()
  const [count, set_count] = useState<number | undefined>()

  useUpdateEffect(() => {
    if (!all_bookmarks) return

    if (selected_tags.length) {
      set_ids_to_search_amongst(
        all_bookmarks
          .filter((bookmark) =>
            selected_tags.every((tag) => bookmark.tags.includes(tag)),
          )
          .map((bookmark) => bookmark.id.toString()),
      )
    } else if (is_search_focused) {
      get_hints()
    }
  }, [selected_tags, all_bookmarks])

  useUpdateEffect(() => {
    get_hints()
  }, [ids_to_search_amongst])

  const init = async () => {
    set_is_initializing(true)

    let db: Orama<typeof schema>

    const cached_all_bookmarks = await localforage.getItem<string>(
      browser_storage.local_forage.authorized_library.all_bookmarks,
    )
    const cached_db = await localforage.getItem<string>(
      browser_storage.local_forage.authorized_library.db,
    )
    const cached_highlights = await localforage.getItem<string>(
      browser_storage.local_forage.authorized_library.db_highlights,
    )

    if (cached_all_bookmarks && cached_db && cached_highlights) {
      set_all_bookmarks(JSON.parse(cached_all_bookmarks))
      db = await restore('json', cached_db)
      await loadWithHighlight(db, JSON.parse(cached_highlights as any))
    } else {
      const data_source = new LibrarySearch_DataSourceImpl(
        process.env.NEXT_PUBLIC_API_URL,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
      )
      const repository = new LibrarySearch_RepositoryImpl(data_source)
      const get_searchable_bookmarks =
        new GetSearchableBookmarksOnAuthorizedUser_UseCase(repository)
      const { bookmarks } = await get_searchable_bookmarks.invoke({})

      db = await create({
        schema,
        sort: {
          unsortableProperties: [
            'id',
            'title',
            'sites',
            'sites_variants',
            'is_archived',
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

      const chunkSize = 1000
      let indexed_count = 0
      for (let i = 0; i < bookmarks.length; i += chunkSize) {
        const chunk = bookmarks.slice(i, i + chunkSize)
        await insertMultiple(
          db,
          chunk.map((bookmark) => ({
            id: bookmark.id.toString(),
            title: `${bookmark.title} ${bookmark.tags.join(
              ' ',
            )} ${bookmark.sites
              .map((site) => site.replace('/', ' › '))
              .join(' ')}`,
            sites: bookmark.sites,
            sites_variants: bookmark.sites
              .map((site) => get_site_variants_for_search(site))
              .flat(),
            tags: bookmark.tags,
            created_at: bookmark.created_at,
            updated_at: bookmark.updated_at,
            visited_at: bookmark.visited_at,
            is_archived: bookmark.is_archived,
            is_unread: bookmark.is_unread,
            stars: bookmark.stars,
          })),
          chunkSize,
        )
        indexed_count += chunk.length
        set_indexed_bookmarks_percentage(
          Math.floor((indexed_count / bookmarks.length) * 100),
        )
      }

      const bookmarks_tags: BookmarkTags[] = bookmarks.map((bookmark) => ({
        id: bookmark.id,
        tags: bookmark.tags,
      }))
      set_all_bookmarks(bookmarks_tags)

      cache_data({ db, all_bookmarks: bookmarks_tags })
    }

    set_db(db)
    set_is_initializing(false)
  }

  const cache_data = async (params: {
    db: Orama<typeof schema>
    all_bookmarks: BookmarkTags[]
  }) => {
    const db_stringified = await persist(params.db, 'json')
    const highlights = await saveWithHighlight(params.db)

    await localforage.setItem(
      browser_storage.local_forage.authorized_library.db,
      db_stringified,
    )
    await localforage.setItem(
      browser_storage.local_forage.authorized_library.db_highlights,
      JSON.stringify(highlights),
    )
    await localforage.setItem(
      browser_storage.local_forage.authorized_library.all_bookmarks,
      JSON.stringify(params.all_bookmarks),
    )
  }

  const get_hits = async (params: {
    search_string: string
  }): Promise<Results<Result>['hits']> => {
    if (!db) throw new Error('[query_db] Db should be there.')

    const tags = query_params.get('t')
    const gte = query_params.get('gte')
    const lte = query_params.get('lte')
    const order = query_params.get('o')
    const sortby = query_params.get('s')

    // 'lorem @abc.com @abc.com ipsum @abc.com'
    // ["abc.com", "abc.com", "abc.com"]
    const sites_variants = params.search_string
      .match(/(?<=@)(.*?)($|\s)/g)
      ?.map((site) => site.replaceAll('.', '').replaceAll('/', ''))
      .filter((variant) => variant != '')

    const term = params.search_string.replace(/(?=@)(.*?)($|\s)/g, '').trim()

    const result_without_tolerance: Results<Result> = await searchWithHighlight(
      db,
      {
        limit: system_values.max_library_search_results,
        term,
        properties: ['title'],
        where: {
          ...(tags && ids_to_search_amongst
            ? { id: ids_to_search_amongst }
            : {}),
          is_archived: current_filter != LibraryFilter.Archived ? false : true,
          ...(current_filter == LibraryFilter.Unread ||
          current_filter == LibraryFilter.OneStarUnread ||
          current_filter == LibraryFilter.TwoStarsUnread ||
          current_filter == LibraryFilter.ThreeStarsUnread
            ? {
                is_unread: true,
              }
            : {}),
          stars: {
            gte:
              current_filter == LibraryFilter.OneStar ||
              current_filter == LibraryFilter.OneStarUnread
                ? 1
                : current_filter == LibraryFilter.TwoStars ||
                  current_filter == LibraryFilter.TwoStarsUnread
                ? 2
                : current_filter == LibraryFilter.ThreeStars ||
                  current_filter == LibraryFilter.ThreeStarsUnread
                ? 3
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
      db,
      {
        limit: term.length >= 5 ? system_values.max_library_search_results : 0,
        term,
        properties: ['title'],
        where: {
          ...(tags && ids_to_search_amongst
            ? { id: ids_to_search_amongst }
            : {}),
          is_archived: current_filter != LibraryFilter.Archived ? false : true,
          ...(current_filter == LibraryFilter.Unread ||
          current_filter == LibraryFilter.OneStarUnread ||
          current_filter == LibraryFilter.TwoStarsUnread ||
          current_filter == LibraryFilter.ThreeStarsUnread
            ? {
                is_unread: true,
              }
            : {}),
          stars: {
            gte:
              current_filter == LibraryFilter.OneStar ||
              current_filter == LibraryFilter.OneStarUnread
                ? 1
                : current_filter == LibraryFilter.TwoStars ||
                  current_filter == LibraryFilter.TwoStarsUnread
                ? 2
                : current_filter == LibraryFilter.ThreeStars ||
                  current_filter == LibraryFilter.ThreeStarsUnread
                ? 3
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

  const query_db = async (params: { search_string: string }) => {
    const hits = await get_hits({ search_string: params.search_string })

    set_result({
      count:
        hits.length == system_values.max_library_search_results
          ? system_values.max_library_search_results
          : hits.length,
      elapsed: { formatted: '', raw: 0 },
      hits,
    })

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
          ...new Set([params.search_string, ...recent_searches].slice(0, 1000)),
        ]),
      )
    }
  }

  const get_hints = async () => {
    if (!db) return

    const tags = query_params.get('t')
    const gte = query_params.get('gte')
    const lte = query_params.get('lte')
    const order = query_params.get('o')
    const sortby = query_params.get('s')

    const words = search_string.split(' ')
    const last_word = words[words.length - 1]
    const sites_variants = search_string
      .match(/(?<=@)(.*?)($|\s)/g)
      ?.map((site) => site.replaceAll('.', '').replaceAll('/', ''))
    const term = search_string.replace(/(?=@)(.*?)($|\s)/g, '').trim()

    if (!search_string) {
      set_hints(
        (
          JSON.parse(
            localStorage.getItem(
              browser_storage.local_storage.authorized_library.recent_searches,
            ) || '[]',
          ) as string[]
        )
          .filter(
            (recent_search_string) =>
              recent_search_string != search_string &&
              recent_search_string.startsWith(search_string),
          )
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
            recent_search_string != search_string &&
            recent_search_string.startsWith(search_string),
        )
        .slice(0, 3)
        .map((recent_search_string) => ({
          type: 'recent',
          completion: recent_search_string.slice(search_string.length),
          search_string: recent_search_string.slice(0, search_string.length),
        }))

      if (last_word.substring(0, 1) == '@') {
        const site_term = last_word.substring(1)

        const result: Results<Result> = await search(db, {
          limit: 1000,
          term: site_term ? site_term : undefined,
          properties: ['sites'],
          where: {
            ...(tags && ids_to_search_amongst
              ? { id: ids_to_search_amongst }
              : {}),
            is_archived:
              current_filter != LibraryFilter.Archived ? false : true,
            ...(current_filter == LibraryFilter.Unread ||
            current_filter == LibraryFilter.OneStarUnread ||
            current_filter == LibraryFilter.TwoStarsUnread ||
            current_filter == LibraryFilter.ThreeStarsUnread
              ? {
                  is_unread: true,
                }
              : {}),
            stars: {
              gte:
                current_filter == LibraryFilter.OneStar ||
                current_filter == LibraryFilter.OneStarUnread
                  ? 1
                  : current_filter == LibraryFilter.TwoStars ||
                    current_filter == LibraryFilter.TwoStarsUnread
                  ? 2
                  : current_filter == LibraryFilter.ThreeStars ||
                    current_filter == LibraryFilter.ThreeStarsUnread
                  ? 3
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
        })

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
          search_string,
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
          hints_no_empty_completions.length
            ? [
                ...recent_hints,
                ...hints_no_empty_completions.filter(
                  (hint) =>
                    !recent_hints.find(
                      (recent_hint) =>
                        recent_hint.completion == hint.completion,
                    ),
                ),
              ].slice(0, system_values.max_library_search_hints)
            : undefined,
        )
      } else {
        const ids_of_hits = (await get_hits({ search_string })).map(
          (hit) => hit.id,
        )

        if (last_word.length) {
          const result: Results<Result> = await search(db, {
            limit: 1000,
            term,
            properties: ['title'],
            where: {
              ...(ids_of_hits.length ? { id: ids_of_hits } : {}),
              is_archived:
                current_filter != LibraryFilter.Archived ? false : true,
              ...(current_filter == LibraryFilter.Unread ||
              current_filter == LibraryFilter.OneStarUnread ||
              current_filter == LibraryFilter.TwoStarsUnread ||
              current_filter == LibraryFilter.ThreeStarsUnread
                ? {
                    is_unread: true,
                  }
                : {}),
              stars: {
                gte:
                  current_filter == LibraryFilter.OneStar ||
                  current_filter == LibraryFilter.OneStarUnread
                    ? 1
                    : current_filter == LibraryFilter.TwoStars ||
                      current_filter == LibraryFilter.TwoStarsUnread
                    ? 2
                    : current_filter == LibraryFilter.ThreeStars ||
                      current_filter == LibraryFilter.ThreeStarsUnread
                    ? 3
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
          })

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
            }
          })

          const new_hints: Hint[] = []

          Object.entries(words_hashmap).map(([k, v]) => {
            if (!words.includes(last_word + k)) {
              new_hints.push({
                search_string,
                completion: k,
                type: 'new',
                yields: v,
              })
            }
          })

          new_hints.sort((a, b) => b.yields! - a.yields!)

          set_hints(
            new_hints.length
              ? [
                  ...recent_hints,
                  ...new_hints.filter(
                    (hint) =>
                      !recent_hints.find(
                        (recent_hint) =>
                          recent_hint.completion == hint.completion,
                      ),
                  ),
                ].slice(0, system_values.max_library_search_hints)
              : undefined,
          )
        } else {
          const result: Results<Result> = await search(db, {
            limit: 1000,
            term: term ? term : undefined,
            properties: ['title'],
            where: {
              ...(tags && ids_of_hits ? { id: ids_of_hits } : {}),
              is_archived:
                current_filter != LibraryFilter.Archived ? false : true,
              ...(current_filter == LibraryFilter.Unread ||
              current_filter == LibraryFilter.OneStarUnread ||
              current_filter == LibraryFilter.TwoStarsUnread ||
              current_filter == LibraryFilter.ThreeStarsUnread
                ? {
                    is_unread: true,
                  }
                : {}),
              stars: {
                gte:
                  current_filter == LibraryFilter.OneStar ||
                  current_filter == LibraryFilter.OneStarUnread
                    ? 1
                    : current_filter == LibraryFilter.TwoStars ||
                      current_filter == LibraryFilter.TwoStarsUnread
                    ? 2
                    : current_filter == LibraryFilter.ThreeStars ||
                      current_filter == LibraryFilter.ThreeStarsUnread
                    ? 3
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
          })

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
              search_string,
              completion: k,
              type: 'new',
            })
          })

          new_hints.sort((a, b) => b.yields! - a.yields!)

          if (new_hints.length >= 2) {
            set_hints(
              [...recent_hints, ...new_hints].slice(
                0,
                system_values.max_library_search_hints,
              ),
            )
          } else {
            set_hints(undefined)
          }
        }
      }
    }
  }

  useUpdateEffect(() => {
    if (db !== undefined && is_search_focused) {
      set_result(undefined)
      get_hints()
    }
  }, [search_string])

  const clear_hints = () => {
    set_hints(undefined)
  }

  const reset = () => {
    set_result(undefined)
    set_hints(undefined)
    set_highlights(undefined)
    set_search_string('')
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
    if (!db) return
    await remove(db, params.bookmark_id.toString())
    const new_all_bookmarks = all_bookmarks!.filter(
      (bookmark) => bookmark.id != params.bookmark_id,
    )
    set_all_bookmarks(new_all_bookmarks)
    await cache_data({ db, all_bookmarks: new_all_bookmarks })
  }

  const update_searchable_bookmark = async (params: {
    bookmark: UpsertBookmark_Params
    visited_at: Date
    tag_ids: number[]
  }) => {
    if (!db || !params.bookmark.bookmark_id || !params.bookmark.created_at)
      return

    await remove(db, params.bookmark.bookmark_id.toString())

    const sites = params.bookmark.links.map(
      (link) =>
        `${get_domain_from_url(link.url)}${
          link.site_path ? `/${link.site_path}` : ''
        }`,
    )

    await insert(db, {
      id: params.bookmark.bookmark_id.toString(),
      title: `${params.bookmark.title} ${params.bookmark.tags
        .map((tag) => tag.name)
        .join(' ')} ${sites.join(' ')}`,
      created_at: params.bookmark.created_at.getTime() / 1000,
      updated_at: new Date().getTime() / 1000,
      visited_at: params.visited_at.getTime() / 1000,
      is_archived: params.bookmark.is_archived,
      is_unread: params.bookmark.is_unread,
      sites,
      sites_variants: sites
        .map((site) => get_site_variants_for_search(site))
        .flat(),
      stars: params.bookmark.stars || 0,
      tags: params.bookmark.tags.map((tag) => tag.name),
      tag_ids: params.tag_ids.map((tag_id) => tag_id.toString()),
    })

    const new_all_bookmarks = all_bookmarks!.filter(
      (bookmark) => bookmark.id != params.bookmark.bookmark_id,
    )

    new_all_bookmarks.push({
      id: params.bookmark.bookmark_id,
      tags: params.bookmark.tags.map((tag) => tag.name),
    })

    await cache_data({ db, all_bookmarks: new_all_bookmarks })
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
    result,
    is_initializing,
    db,
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
    set_highlights,
  }
}