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
} from '@orama/plugin-match-highlight'
import { SearchableBookmark_Entity } from '@repositories/modules/library-search/domain/entities/searchable-bookmark.entity'
import { system_values } from '@shared/constants/system-values'

type Hint = {
  type: 'new' | 'recent'
  term: string
  completion?: string
  yields?: number
}

const schema = {
  id: 'string',
  title: 'string',
  tag_ids: 'string[]',
  sites: 'string[]',
  sites_variants: 'string[]',
  created_at: 'number',
  updated_at: 'number',
  visited_at: 'number',
  is_archived: 'boolean',
  is_unread: 'boolean',
  stars: 'number',
} as const

type Result = TypedDocument<Orama<typeof schema>>

export const use_search = () => {
  const query_params = use_shallow_search_params()
  const [is_search_focused, set_is_search_focused] = useState(false)
  const [searchable_bookmarks, set_searchable_bookmarks] =
    useState<SearchableBookmark_Entity[]>()
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
  const [count, set_count] = useState<number | undefined>()

  useUpdateEffect(() => {
    if (!searchable_bookmarks) return

    set_ids_to_search_amongst(
      searchable_bookmarks
        .filter((bookmark) =>
          selected_tags.every((tag) => bookmark.tags.includes(tag)),
        )
        .map((bookmark) => bookmark.id.toString()),
    )
  }, [current_filter, selected_tags, searchable_bookmarks])

  const init = async () => {
    set_is_initializing(true)
    const data_source = new LibrarySearch_DataSourceImpl(
      process.env.NEXT_PUBLIC_API_URL,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
    )
    const repository = new LibrarySearch_RepositoryImpl(data_source)
    const get_searchable_bookmarks =
      new GetSearchableBookmarksOnAuthorizedUser_UseCase(repository)
    const { bookmarks } = await get_searchable_bookmarks.invoke({})

    set_searchable_bookmarks(bookmarks)

    const db = await create({
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
          )} ${bookmark.sites.join(' ')}`,
          sites: bookmark.sites,
          sites_variants: bookmark.sites
            .map((site) => get_site_variants_for_search(site))
            .flat(),
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

    set_db(db)
    set_is_initializing(false)
  }

  const query_db = async (params: { search_string: string }) => {
    if (!db) throw new Error('[query_db] Db should be there.')

    const tags = query_params.get('t')
    const gte = query_params.get('gte')
    const lte = query_params.get('lte')
    const order = query_params.get('o')
    const sortby = query_params.get('s')

    // 'lorem site:abc.com site:abc.com ipsum site:abc.com'
    // ["abc.com", "abc.com", "abc.com"]
    const sites_variants = params.search_string
      .match(/(?<=site:)(.*?)($|\s)/g)
      ?.map((site) => site.replaceAll('.', '').replaceAll('/', ''))

    const term = params.search_string
      .replace(/(?=site:)(.*?)($|\s)/g, '')
      .trim()

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
        tolerance: term ? 1 : undefined,
      },
    )

    const merged_hits = [
      ...result_without_tolerance.hits,
      ...result_with_tolerance.hits,
    ]
    const merged_hits_no_dupes: any[] = []
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

    set_result({
      count:
        merged_hits_no_dupes.length > system_values.max_library_search_results
          ? system_values.max_library_search_results
          : merged_hits_no_dupes.length,
      elapsed: { formatted: '', raw: 0 },
      hits: merged_hits_no_dupes.splice(
        0,
        system_values.max_library_search_results,
      ),
    })
  }

  useUpdateEffect(() => {
    if (db !== undefined && search_string.length) {
      get_hints()
    }
  }, [search_string])

  const get_hints = async () => {
    if (!db) throw new Error('[get_hints] Db should be there.')

    const tags = query_params.get('t')
    const gte = query_params.get('gte')
    const lte = query_params.get('lte')
    const order = query_params.get('o')
    const sortby = query_params.get('s')

    const words = search_string.split(' ')
    const last_word = words[words.length - 1]

    if (last_word.substring(0, 5) == 'site:') {
      const term = last_word.substring(5)

      const result: Results<Result> = await search(db, {
        limit: 1000000,
        term,
        properties: ['sites'],
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
        },
        threshold: 0,
      })

      const sites: { site: string; occurences: number }[] = []

      result.hits.forEach(({ document }) => {
        document.sites.forEach((site) => {
          if (site.includes(term)) {
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
        term,
        completion: site.site.split(term)[1],
        type: 'new',
        yields: site.occurences,
      }))

      const hints_no_dupes: Hint[] = []

      hints.forEach((hint) => {
        const hint_index = hints_no_dupes.findIndex(
          (h) => h.completion == hint.completion,
        )

        if (hint_index == -1) {
          hints_no_dupes.push(hint)
        } else {
          hints_no_dupes[hint_index] = {
            ...hints_no_dupes[hint_index],
            yields: hints_no_dupes[hint_index].yields! + hint.yields!,
          }
        }
      })

      const hints_no_empty_completion = hints_no_dupes.filter(
        (hint) => hint.completion,
      )

      set_hints(
        hints_no_empty_completion.length
          ? hints_no_empty_completion
          : undefined,
      )
    } else if (last_word.length) {
      const sites_variants = search_string
        .match(/(?<=site:)(.*?)($|\s)/g)
        ?.map((site) => site.replaceAll('.', '').replaceAll('/', ''))

      const term = search_string.replace(/(?=site:)(.*?)($|\s)/g, '').trim()

      const result: Results<Result> = await search(db, {
        limit: 1000,
        term,
        properties: ['title'],
        where: {
          ...(tags && ids_to_search_amongst
            ? { id: ids_to_search_amongst }
            : {}),
          is_archived: current_filter != LibraryFilter.Archived ? false : true,
          is_unread:
            current_filter == LibraryFilter.Unread ||
            current_filter == LibraryFilter.OneStarUnread ||
            current_filter == LibraryFilter.TwoStarsUnread ||
            current_filter == LibraryFilter.ThreeStarsUnread,
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

      const hints: Hint[] = []

      Object.entries(words_hashmap).map(([k, v]) => {
        if (!words.includes(last_word + k)) {
          hints.push({ completion: k, term: last_word, type: 'new', yields: v })
        }
      })

      hints.sort((a, b) => b.yields! - a.yields!)

      const hints_with_no_yields: Hint[] = hints.map((hint) => ({
        completion: hint.completion,
        term: hint.term,
        type: hint.type,
      }))

      set_hints(hints.length ? hints_with_no_yields.slice(0, 10) : undefined)
    } else {
      set_hints([
        { term: 'recent entry 1', type: 'recent' },
        { term: 'recent entry 2', type: 'recent' },
        { term: 'recent entry 3', type: 'recent' },
      ])
    }
  }

  const clear_hints = () => {
    set_hints(undefined)
  }

  const clear_search_string = () => {
    set_search_string('')
  }

  const clear_result = () => {
    set_result(undefined)
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
      created_at: params.bookmark.created_at.getTime() / 1000,
      updated_at: new Date().getTime() / 1000,
      is_archived: params.bookmark.is_archived,
      is_unread: params.bookmark.is_unread,
      sites,
      sites_variants: sites
        .map((site) => get_site_variants_for_search(site))
        .flat(),
      stars: params.bookmark.stars || 0,
      tag_ids: params.tag_ids.map((tag_id) => tag_id.toString()),
      title: `${params.bookmark.title} ${params.bookmark.tags
        .map((tag) => tag.name)
        .join(' ')} ${sites.join(' ')}`,
      visited_at: params.visited_at.getTime() / 1000,
    })
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
    clear_search_string,
    clear_result,
    count,
    set_count,
  }
}
