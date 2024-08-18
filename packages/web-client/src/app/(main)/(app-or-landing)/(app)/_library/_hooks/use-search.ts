import { Orama, Results, TypedDocument, search } from '@orama/orama'
import { useContext, useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { searchWithHighlight } from '@orama/plugin-match-highlight'
import { system_values } from '@shared/constants/system-values'
import { browser_storage } from '@/constants/browser-storage'
import { useParams, useSearchParams } from 'next/navigation'
import { Filter } from '@/types/library/filter'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { search_params_keys } from '@/constants/search-params-keys'
import { LocalDb, schema } from '@/providers/LocalDbProvider'
import { AuthContext } from '@/providers/AuthProvider'

type Hint = {
  type: 'new' | 'recent'
  search_string: string
  completion: string
  yields?: number
}

type Highlights = {
  [id: string]: [number, number][]
}

export type Result = TypedDocument<Orama<typeof schema>>

export const use_search = (local_db: LocalDb) => {
  const auth_context = useContext(AuthContext)
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()
  const [is_full_text, set_is_full_text] = useState<boolean>()
  const [is_search_focused, set_is_search_focused] = useState(false)
  const [current_filter, set_current_filter] = useState<Filter>()
  const [selected_tag_ids, set_selected_tag_ids] = useState<number[]>([])
  const [selected_tags, set_selected_tags] = useState<string[]>([])
  const [search_string, set_search_string] = useState('')
  const [hints, set_hints] = useState<Hint[]>()
  const [result, set_result] = useState<Results<Result>>()
  const [incoming_highlights, set_incoming_highlights] = useState<Highlights>()
  const [highlights, set_highlights] = useState<Highlights>()
  const [
    incoming_highlights_sites_variants,
    set_incoming_highlights_sites_variants,
  ] = useState<string[]>()
  const [highlights_sites_variants, set_highlights_sites_variants] =
    useState<string[]>()
  const [count, set_count] = useState<number>()
  // Used for refreshing highlights after bookmark update
  const [queried_at_timestamp, set_queried_at_timestamp] = useState<number>()
  const [hints_set_at_timestamp, set_hints_set_at_timestamp] =
    useState<number>()

  const is_archived_filter =
    current_filter == Filter.ARCHIVED ||
    current_filter == Filter.ARCHIVED_STARRED ||
    current_filter == Filter.ARCHIVED_STARRED_UNSORTED ||
    current_filter == Filter.ARCHIVED_UNSORTED

  const set_search_fragment = (params: { search_string: string }) => {
    window.history.pushState(
      {},
      '',
      window.location.pathname +
        (search_params.toString() ? `?${search_params.toString()}` : '') +
        `#q=${encodeURIComponent(params.search_string)}`,
    )
  }

  const query_db = async (params: {
    search_string: string
  }): Promise<Results<Result>> => {
    if (
      (!is_archived_filter && !local_db.db) ||
      (is_archived_filter && !local_db.archived_db)
    )
      throw new Error('DB should be there.')

    const gte = search_params.get(search_params_keys.greater_than_equal)
    const lte = search_params.get(search_params_keys.less_than_equal)
    const order = search_params.get(search_params_keys.order)
    const sortby = search_params.get(search_params_keys.sort_by)

    // 'lorem site:abc.com site:abc.com ipsum site:abc.com'
    // ["abccom", "abccom", "abccom"]
    const sites_variants = get_sites_variants_from_search_string(
      params.search_string,
    )

    const term = params.search_string
      .replace(/(?=site:)(.*?)($|\s)/g, '')
      .trim()

    const result: Results<Result> = await searchWithHighlight(
      !is_archived_filter ? local_db.db! : local_db.archived_db!,
      {
        limit: system_values.max_library_search_results,
        term,
        properties: ['card'],
        where: {
          ...(selected_tag_ids.length
            ? {
                tag_ids: { containsAll: selected_tag_ids },
              }
            : {}),
          ...(current_filter == Filter.UNSORTED ||
          current_filter == Filter.STARRED_UNSORTED ||
          current_filter == Filter.ARCHIVED_UNSORTED ||
          current_filter == Filter.ARCHIVED_STARRED_UNSORTED
            ? {
                is_unsorted: true,
              }
            : {}),
          stars: {
            gte:
              current_filter == Filter.STARRED ||
              current_filter == Filter.STARRED_UNSORTED ||
              current_filter == Filter.ARCHIVED_STARRED ||
              current_filter == Filter.ARCHIVED_STARRED_UNSORTED
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
            sortby ==
            Object.values(SortBy).indexOf(SortBy.POPULARITY).toString()
              ? 'points'
              : sortby ==
                Object.values(SortBy).indexOf(SortBy.UPDATED_AT).toString()
              ? 'updated_at'
              : sortby ==
                Object.values(SortBy).indexOf(SortBy.VISITED_AT).toString()
              ? 'visited_at'
              : 'created_at',
          order:
            sortby ==
            Object.values(SortBy).indexOf(SortBy.POPULARITY).toString()
              ? 'DESC'
              : order == Object.values(Order).indexOf(Order.ASC).toString()
              ? 'ASC'
              : 'DESC',
        },
        threshold: term ? 0 : undefined,
      },
    )

    return result
  }

  const get_result = async (params: {
    search_string: string
    refresh_highlights_only?: boolean
  }) => {
    if (!search_string.trim()) return
    const result = await query_db({ search_string: params.search_string })

    set_incoming_highlights(
      result.hits.reduce((a, v) => {
        const positions = Object.values((v as any).positions.card)
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

    set_incoming_highlights_sites_variants(
      get_sites_variants_from_search_string(params.search_string),
    )

    if (!params.refresh_highlights_only) {
      clear_library_session_storage({
        username,
        search_params: search_params.toString(),
        hash: `#q=${encodeURIComponent(search_string)}`,
      })
      set_count(result.count)
      if (result.count) {
        set_result(result)
        set_queried_at_timestamp(Date.now())
        set_search_fragment({
          search_string: params.search_string,
        })
        sessionStorage.setItem(
          browser_storage.session_storage.library.search_string({
            username,
            search_params: search_params.toString(),
            hash: `#q=${encodeURIComponent(search_string)}`,
          }),
          params.search_string,
        )
        sessionStorage.setItem(
          browser_storage.session_storage.library.search_results_count({
            username,
            search_params: search_params.toString(),
            hash: `#q=${encodeURIComponent(search_string)}`,
          }),
          result.count.toString(),
        )

        let recent_library_searches: string[] = []

        recent_library_searches = JSON.parse(
          localStorage.getItem(
            browser_storage.local_storage.recent_library_searches,
          ) || '[]',
        )

        localStorage.setItem(
          browser_storage.local_storage.recent_library_searches,
          JSON.stringify([
            ...new Set(
              [
                params.search_string.toLowerCase().trim(),
                ...recent_library_searches,
              ].slice(0, 1000),
            ),
          ]),
        )
      }
    }
  }

  const query_db_full_text = async (params: {
    search_string: string
  }): Promise<Results<Result>> => {
    if (
      (!is_archived_filter && !local_db.db) ||
      (is_archived_filter && !local_db.archived_db)
    )
      throw new Error('DB should be there.')

    const gte = search_params.get(search_params_keys.greater_than_equal)
    const lte = search_params.get(search_params_keys.less_than_equal)

    // 'lorem site:abc.com site:abc.com ipsum site:abc.com'
    // ["abccom", "abccom", "abccom"]
    const sites_variants = get_sites_variants_from_search_string(
      params.search_string,
    )

    const term = params.search_string
      .replace(/(?=site:)(.*?)($|\s)/g, '')
      .trim()

    const result: Results<Result> = await search(
      !is_archived_filter ? local_db.db! : local_db.archived_db!,
      {
        limit: system_values.max_library_search_results,
        term,
        // properties: ['plain_text'],
        where: {
          ...(selected_tag_ids.length
            ? {
                tag_ids: { containsAll: selected_tag_ids },
              }
            : {}),
          ...(current_filter == Filter.UNSORTED ||
          current_filter == Filter.STARRED_UNSORTED ||
          current_filter == Filter.ARCHIVED_UNSORTED ||
          current_filter == Filter.ARCHIVED_STARRED_UNSORTED
            ? {
                is_unsorted: true,
              }
            : {}),
          stars: {
            gte:
              current_filter == Filter.STARRED ||
              current_filter == Filter.STARRED_UNSORTED ||
              current_filter == Filter.ARCHIVED_STARRED ||
              current_filter == Filter.ARCHIVED_STARRED_UNSORTED
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
        threshold: 0,
      },
    )

    return result
  }

  const get_result_full_text = async (params: { search_string: string }) => {
    const result = await query_db_full_text({
      search_string: params.search_string,
    })

    set_count(result.count)
    if (result.count) {
      set_result(result)
      set_queried_at_timestamp(Date.now())
      set_search_fragment({
        search_string: params.search_string,
      })
      sessionStorage.setItem(
        browser_storage.session_storage.library.search_string({
          username,
          search_params: search_params.toString(),
          hash: `#q=${encodeURIComponent(params.search_string)}`,
        }),
        params.search_string,
      )
      sessionStorage.setItem(
        browser_storage.session_storage.library.search_results_count({
          username,
          search_params: search_params.toString(),
          hash: `#q=${encodeURIComponent(params.search_string)}`,
        }),
        result.count.toString(),
      )
    }
  }

  const get_hints = async () => {
    if (
      (!is_archived_filter && !local_db.db) ||
      (is_archived_filter && !local_db.archived_db)
    )
      return

    if (is_full_text) {
      // TODO: Create special hints for full text
      // Calling set_hings triggers hints dropdown
      set_hints([])
      return
    }

    const gte = search_params.get(search_params_keys.greater_than_equal)
    const lte = search_params.get(search_params_keys.less_than_equal)
    const order = search_params.get(search_params_keys.order)
    const sortby = search_params.get(search_params_keys.sort_by)

    const search_string_lower_case = search_string.toLowerCase()

    const words = search_string_lower_case.split(' ')
    const last_word = words[words.length - 1]
    const sites_variants = search_string_lower_case
      .match(/(?<=site:)(.*?)($|\s)/g)
      ?.map((site) => site.replaceAll('.', '').replaceAll('/', ''))
    const term = search_string_lower_case
      .replace(/(?=site:)(.*?)($|\s)/g, '')
      .trim()

    if (!search_string) {
      const recent_library_searches = JSON.parse(
        localStorage.getItem(
          browser_storage.local_storage.recent_library_searches,
        ) || '[]',
      ) as string[]

      set_hints(
        recent_library_searches
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
            browser_storage.local_storage.recent_library_searches,
          ) || '[]',
        ) as string[]
      )
        .filter(
          (recent_search_string) =>
            recent_search_string != search_string_lower_case &&
            recent_search_string.startsWith(search_string_lower_case),
        )
        .slice(0, 3)
        .map((recent_search_string) => ({
          type: 'recent',
          completion: recent_search_string.slice(search_string.length),
          search_string: search_string_lower_case,
        }))

      if (last_word.substring(0, 5) == 'site:') {
        const site_term = last_word.substring(5)

        const result: Results<Result> = await search(
          !is_archived_filter ? local_db.db! : local_db.archived_db!,
          {
            limit: system_values.max_library_search_results,
            term: site_term ? site_term : undefined,
            properties: ['sites'],
            where: {
              ...(selected_tag_ids.length
                ? {
                    tag_ids: { containsAll: selected_tag_ids },
                  }
                : {}),
              ...(current_filter == Filter.UNSORTED ||
              current_filter == Filter.STARRED_UNSORTED ||
              current_filter == Filter.ARCHIVED_UNSORTED ||
              current_filter == Filter.ARCHIVED_STARRED_UNSORTED
                ? {
                    is_unsorted: true,
                  }
                : {}),
              stars: {
                gte:
                  current_filter == Filter.STARRED ||
                  current_filter == Filter.STARRED_UNSORTED ||
                  current_filter == Filter.ARCHIVED_STARRED ||
                  current_filter == Filter.ARCHIVED_STARRED_UNSORTED
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
          search_string: search_string_lower_case,
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
        set_count(undefined)
      } else {
        const pre_result = await query_db({
          search_string: search_string_lower_case,
        })

        const ids_of_hits = pre_result.hits.map((hit) => hit.id)

        set_count(pre_result.count)

        if (last_word.length) {
          const result: Results<Result> = await search(
            !is_archived_filter ? local_db.db! : local_db.archived_db!,
            {
              term,
              properties: ['card'],
              where: {
                id: ids_of_hits,
                ...(current_filter == Filter.UNSORTED ||
                current_filter == Filter.STARRED_UNSORTED ||
                current_filter == Filter.ARCHIVED_UNSORTED ||
                current_filter == Filter.ARCHIVED_STARRED_UNSORTED
                  ? {
                      is_unsorted: true,
                    }
                  : {}),
                stars: {
                  gte:
                    current_filter == Filter.STARRED ||
                    current_filter == Filter.STARRED_UNSORTED ||
                    current_filter == Filter.ARCHIVED_STARRED ||
                    current_filter == Filter.ARCHIVED_STARRED_UNSORTED
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
            const word = document.card
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
                search_string: search_string_lower_case,
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
            !is_archived_filter ? local_db.db! : local_db.archived_db!,
            {
              term: term ? term : undefined,
              properties: ['card'],
              where: {
                id: ids_of_hits,
                ...(current_filter == Filter.UNSORTED ||
                current_filter == Filter.STARRED_UNSORTED ||
                current_filter == Filter.ARCHIVED_UNSORTED ||
                current_filter == Filter.ARCHIVED_STARRED_UNSORTED
                  ? {
                      is_unsorted: true,
                    }
                  : {}),
                stars: {
                  gte:
                    current_filter == Filter.STARRED ||
                    current_filter == Filter.STARRED_UNSORTED ||
                    current_filter == Filter.ARCHIVED_STARRED ||
                    current_filter == Filter.ARCHIVED_STARRED_UNSORTED
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
              search_string: search_string_lower_case,
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
    set_hints_set_at_timestamp(Date.now())
  }

  useUpdateEffect(() => {
    if (!is_search_focused || is_full_text) return
    set_result(undefined)
    get_hints()
    if (!search_string) {
      window.history.pushState(
        {},
        '',
        window.location.pathname + `?${search_params.toString()}`,
      )
    }
  }, [search_string])

  const clear_hints = () => {
    set_hints(undefined)
  }

  const remove_recent_hint = (params: { search_string: string }) => {
    localStorage.setItem(
      browser_storage.local_storage.recent_library_searches,
      JSON.stringify(
        JSON.parse(
          localStorage.getItem(
            browser_storage.local_storage.recent_library_searches,
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
    set_count(undefined)
    set_result(undefined)
    set_hints(undefined)
    set_incoming_highlights(undefined)
    set_incoming_highlights_sites_variants(undefined)
  }

  useUpdateEffect(() => {
    if (!highlights) return
    sessionStorage.setItem(
      browser_storage.session_storage.library.highlights({
        username,
        search_params: search_params.toString(),
        hash: `#q=${encodeURIComponent(search_string)}`,
      }),
      JSON.stringify(highlights),
    )
  }, [highlights])

  useUpdateEffect(() => {
    if (!highlights_sites_variants) return
    sessionStorage.setItem(
      browser_storage.session_storage.library.highlights_sites_variants({
        username,
        search_params: search_params.toString(),
        hash: `#q=${encodeURIComponent(search_string)}`,
      }),
      JSON.stringify(highlights_sites_variants),
    )
  }, [highlights_sites_variants])

  useUpdateEffect(() => {
    if (!result) return
    sessionStorage.setItem(
      browser_storage.session_storage.library.search_result({
        username,
        search_params: search_params.toString(),
        hash: `#q=${encodeURIComponent(search_string)}`,
      }),
      JSON.stringify(result),
    )
  }, [result])

  useEffect(() => {
    const search_params_stringified = search_params.toString()

    const is_query_in_hash = window.location.hash.startsWith('#q=')

    if (!is_query_in_hash) reset()

    const search_string = sessionStorage.getItem(
      browser_storage.session_storage.library.search_string({
        username,
        search_params: search_params_stringified,
        hash: window.location.hash,
      }),
    )

    if (search_string) {
      set_search_string(search_string)
    }

    if (!is_full_text) {
      const highlights = sessionStorage.getItem(
        browser_storage.session_storage.library.highlights({
          username,
          search_params: search_params_stringified,
          hash: window.location.hash,
        }),
      )
      if (highlights) {
        set_highlights(JSON.parse(highlights))
      }
      const highlights_sites_variants = sessionStorage.getItem(
        browser_storage.session_storage.library.highlights_sites_variants({
          username,
          search_params: search_params_stringified,
          hash: window.location.hash,
        }),
      )
      if (highlights_sites_variants) {
        set_highlights_sites_variants(JSON.parse(highlights_sites_variants))
      }
    }

    const count = sessionStorage.getItem(
      browser_storage.session_storage.library.search_results_count({
        username,
        search_params: search_params_stringified,
        hash: window.location.hash,
      }),
    )
    if (count) {
      set_count(parseInt(count))
    }
    const result = sessionStorage.getItem(
      browser_storage.session_storage.library.search_result({
        username,
        search_params: search_params_stringified,
        hash: window.location.hash,
      }),
    )
    if (result) {
      set_result(JSON.parse(result))
    }

    // Temporary handling of search string on fresh page load
    if (is_query_in_hash && !result) {
      set_search_string(window.location.hash.replace('#q=', ''))
    }
  }, [search_params])

  // Handle the redirection when the user clicks on the search field in the extension's new tab
  useUpdateEffect(() => {
    if (window.location.hash == '#focus-on-search') {
      local_db
        .init({
          is_archived: is_archived_filter,
        })
        .then(() => {
          get_hints()
          set_is_search_focused(true)
        })
    } else if (window.location.hash.startsWith('#q=')) {
      /**
       * START - handle case when hash is #q=gila
       */
      local_db.init({
        is_archived: is_archived_filter,
      })
    }
  }, [auth_context.auth_data])

  useUpdateEffect(() => {
    const db = is_archived_filter ? local_db.archived_db : local_db.db
    if (db) get_result({ search_string })
  }, [local_db.db, local_db.archived_db])
  /**
   * END - handle case when hash is #q=gila
   */

  return {
    is_search_focused,
    set_is_search_focused,
    search_string,
    set_search_string,
    hints,
    clear_hints,
    get_hints,
    get_result,
    get_result_full_text,
    result,
    set_current_filter,
    set_selected_tags,
    set_selected_tag_ids,
    reset,
    count,
    set_count,
    incoming_highlights,
    highlights,
    set_highlights,
    remove_recent_hint,
    current_filter,
    incoming_highlights_sites_variants,
    highlights_sites_variants,
    set_highlights_sites_variants,
    hints_set_at_timestamp,
    queried_at_timestamp,
    is_full_text,
    set_is_full_text,
  }
}

const get_sites_variants_from_search_string = (search_string: string) => {
  return search_string
    .match(/(?<=site:)(.*?)($|\s)/g)
    ?.map((site) => site.replaceAll('.', '').replaceAll('/', '').trim())
    .filter((variant) => variant != '')
}
