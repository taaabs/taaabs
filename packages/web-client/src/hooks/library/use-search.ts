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
import { useContext, useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { LibrarySearch_DataSourceImpl } from '@repositories/modules/library-search/infrastructure/data-sources/library-search.data-source-impl'
import { LibrarySearch_RepositoryImpl } from '@repositories/modules/library-search/infrastructure/repositories/library-search.repository-impl'
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
import { useParams, useSearchParams } from 'next/navigation'
import { get_site_variants_for_search } from '@shared/utils/get-site-variants-for-search'
import { SearchableBookmark_Entity } from '@repositories/modules/library-search/domain/entities/searchable-bookmark.entity'
import { GetLastUpdated_Ro } from '@repositories/modules/library-search/domain/types/get-last-updated.ro'
import { Filter } from '@/types/library/filter'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { KyInstance } from 'ky'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { search_params_keys } from '@/constants/search-params-keys'
import { use_has_focus } from '../misc/use-has-focus'
import { AuthContext } from '@/app/auth-provider'
import { LocalDb } from '@/app/local-db-provider'

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

export const schema = {
  id: 'string',
  text: 'string',
  tag_ids: 'string[]',
  sites: 'string[]',
  sites_variants: 'string[]',
  tags: 'string[]',
  created_at: 'number',
  updated_at: 'number',
  visited_at: 'number',
  is_unread: 'boolean',
  stars: 'number',
  points: 'number',
} as const

export type Result = TypedDocument<Orama<typeof schema>>

export type BookmarkTags = { id: number; tags: string[] }

export const use_search = (local_db: LocalDb) => {
  const auth_context = useContext(AuthContext)!
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()
  const [is_search_focused_, set_is_search_focused_] = useState(false)
  const [current_filter_, set_current_filter_] = useState<Filter>()
  const [selected_tags, set_selected_tags_] = useState<string[]>([])
  const [ids_to_search_amongst, set_ids_to_search_amongst] = useState<
    string[] | undefined
  >()
  const [is_initializing_, set_is_initializing] = useState(false)
  const [search_string_, set_search_string_] = useState('')
  const [hints_, set_hints] = useState<Hint[]>()
  const [indexed_bookmarks_percentage_, set_indexed_bookmarks_percentage] =
    useState<number | undefined>()
  const [result_, set_result] = useState<Results<Result>>()
  const [incoming_highlights_, set_incoming_highlights] = useState<Highlights>()
  const [highlights_, set_highlights_] = useState<Highlights>()
  const [
    incoming_highlights_sites_variants_,
    set_incoming_highlights_sites_variants,
  ] = useState<string[]>()
  const [highlights_sites_variants_, set_highlights_sites_variants_] =
    useState<string[]>()
  const [count_, set_count_] = useState<number>()
  // Used for refreshing highlights after bookmark update.
  const [queried_at_timestamp_, set_queried_at_timestamp] = useState<number>()
  const [hints_set_at_timestamp_, set_hints_set_at_timestamp] =
    useState<number>()
  const has_focus = use_has_focus()
  const [search_data_awaits_caching, set_search_data_awaits_caching] =
    useState<boolean>()
  const [
    archived_search_data_awaits_caching,
    set_archived_search_data_awaits_caching,
  ] = useState<boolean>()

  const is_archived_filter =
    current_filter_ == Filter.ARCHIVED ||
    current_filter_ == Filter.ARCHIVED_STARRED ||
    current_filter_ == Filter.ARCHIVED_STARRED_UNREAD ||
    current_filter_ == Filter.ARCHIVED_UNREAD

  const set_search_fragment_ = (params: { search_string: string }) => {
    window.history.pushState(
      {},
      '',
      window.location.pathname +
        (search_params.toString() ? `?${search_params.toString()}` : '') +
        '#' +
        params.search_string,
    )
  }

  useUpdateEffect(() => {
    if (
      (!is_archived_filter && !local_db.bookmarks_just_tags) ||
      (is_archived_filter && !local_db.archived_bookmarks_just_tags)
    )
      return

    if (selected_tags.length) {
      set_ids_to_search_amongst(
        (!is_archived_filter
          ? local_db.bookmarks_just_tags!
          : local_db.archived_bookmarks_just_tags!
        )
          .filter((bookmark) =>
            selected_tags.every((tag) => bookmark.tags.includes(tag)),
          )
          .map((bookmark) => bookmark.id.toString()),
      )
    } else if (is_search_focused_) {
      get_hints_()
    }
  }, [
    selected_tags,
    local_db.bookmarks_just_tags,
    local_db.archived_bookmarks_just_tags,
  ])

  enum DbStalenessState {
    FRESH,
    INSTANCE_STALE_CACHED_STALE,
  }

  const get_is_db_stale = async (params: {
    is_archived_: boolean
    ky_: KyInstance
  }): Promise<DbStalenessState> => {
    const instance_updated_at: number | undefined = !params.is_archived_
      ? local_db.db_updated_at_timestamp
      : local_db.archived_db_updated_at_timestamp

    const cached_at =
      (await localforage.getItem<number>(
        !username
          ? !params.is_archived_
            ? browser_storage.local_forage.authorized_library.search
                .cached_at_timestamp
            : browser_storage.local_forage.authorized_library.search
                .archived_cached_at_timestamp
          : !params.is_archived_
          ? browser_storage.local_forage.public_library.search.cached_at_timestamp(
              {
                username: username as string,
              },
            )
          : browser_storage.local_forage.public_library.search.archived_cached_at_timestamp(
              { username: username as string },
            ),
      )) || undefined

    let remote_updated_at: number

    const data_source = new LibrarySearch_DataSourceImpl(params.ky_)
    const repository = new LibrarySearch_RepositoryImpl(data_source)

    let result: GetLastUpdated_Ro
    if (!username) {
      result = await repository.get_last_updated_at_on_authorized_user()
    } else {
      result = await repository.get_last_updated_at_on_public_user({
        username: username as string,
      })
    }

    !params.is_archived_
      ? (remote_updated_at = result.updated_at?.getTime() || 0)
      : (remote_updated_at = result.archived_updated_at?.getTime() || 0)

    if (
      (instance_updated_at && instance_updated_at >= remote_updated_at) ||
      (cached_at && cached_at >= remote_updated_at)
    ) {
      return DbStalenessState.FRESH
    } else {
      return DbStalenessState.INSTANCE_STALE_CACHED_STALE
    }
  }

  const init_ = async (params: {
    is_archived_: boolean
    force_reinitialization_?: boolean
  }): Promise<{
    db: Orama<typeof schema>
    bookmarks_just_tags: BookmarkTags[]
  }> => {
    if (params.force_reinitialization_) {
      await clear_cached_data_({ is_archived_: params.is_archived_ })
    } else {
      const staleness_state = await get_is_db_stale({
        is_archived_: params.is_archived_,
        ky_: auth_context.ky_instance,
      })

      // Bypass initialization if current instance is up to date.
      // Current instance could be out of date if user updated cached db in another tab.
      if (staleness_state == DbStalenessState.FRESH) {
        const updated_at = !params.is_archived_
          ? local_db.db_updated_at_timestamp!
          : local_db.archived_db_updated_at_timestamp!
        const cached_at = await localforage.getItem<number>(
          !username
            ? !params.is_archived_
              ? browser_storage.local_forage.authorized_library.search
                  .cached_at_timestamp
              : browser_storage.local_forage.authorized_library.search
                  .archived_cached_at_timestamp
            : !params.is_archived_
            ? browser_storage.local_forage.public_library.search.cached_at_timestamp(
                {
                  username: username as string,
                },
              )
            : browser_storage.local_forage.public_library.search.archived_cached_at_timestamp(
                { username: username as string },
              ),
        )
        if (
          (updated_at && !cached_at) ||
          (updated_at && cached_at && updated_at >= cached_at)
        ) {
          if (!params.is_archived_) {
            return {
              db: local_db.db!,
              bookmarks_just_tags: local_db.bookmarks_just_tags!,
            }
          } else {
            return {
              db: local_db.archived_db!,
              bookmarks_just_tags: local_db.archived_bookmarks_just_tags!,
            }
          }
        }
      } else if (
        staleness_state == DbStalenessState.INSTANCE_STALE_CACHED_STALE
      ) {
        await clear_cached_data_({ is_archived_: params.is_archived_ })
      }
    }

    set_is_initializing(true)

    const new_db = await create({
      schema,
      sort: {
        unsortableProperties: [
          'id',
          'title',
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
      !username
        ? !params.is_archived_
          ? browser_storage.local_forage.authorized_library.search.bookmarks
          : browser_storage.local_forage.authorized_library.search
              .archived_bookmarks
        : !params.is_archived_
        ? browser_storage.local_forage.public_library.search.bookmarks({
            username: username as string,
          })
        : browser_storage.local_forage.public_library.search.archived_bookmarks(
            { username: username as string },
          ),
    )
    const cached_index = await localforage.getItem<string>(
      !username
        ? !params.is_archived_
          ? browser_storage.local_forage.authorized_library.search.index
          : browser_storage.local_forage.authorized_library.search
              .archived_index
        : !params.is_archived_
        ? browser_storage.local_forage.public_library.search.index({
            username: username as string,
          })
        : browser_storage.local_forage.public_library.search.archived_index({
            username: username as string,
          }),
    )

    let new_bookmarks_just_tags: BookmarkTags[]

    if (cached_bookmarks && cached_index) {
      new_bookmarks_just_tags = JSON.parse(cached_bookmarks)
      !params.is_archived_
        ? local_db.set_bookmarks_just_tags(new_bookmarks_just_tags)
        : local_db.set_archived_bookmarks_just_tags(new_bookmarks_just_tags)
      await loadWithHighlight(new_db, JSON.parse(cached_index as any))
    } else {
      const data_source = new LibrarySearch_DataSourceImpl(
        auth_context.ky_instance,
      )
      const repository = new LibrarySearch_RepositoryImpl(data_source)

      let bookmarks: SearchableBookmark_Entity[]
      if (!username) {
        bookmarks = (
          await repository.get_bookmarks_on_authorized_user(
            {
              is_archived: params.is_archived_,
            },
            auth_context.auth_data!.encryption_key,
          )
        ).bookmarks
      } else {
        bookmarks = (
          await repository.get_bookmarks_on_public_user({
            is_archived: params.is_archived_,
            username: username as string,
          })
        ).bookmarks
      }

      const chunk_size = 1000
      let indexed_count = 0
      for (let i = 0; i < bookmarks.length; i += chunk_size) {
        const chunk = bookmarks.slice(i, i + chunk_size)
        await insertMultiple(
          new_db,
          chunk.map((bookmark) => ({
            id: bookmark.id.toString(),
            text:
              (bookmark.title ? `${bookmark.title} ` : '') +
              (bookmark.note ? `${bookmark.note} ` : '') +
              bookmark.tags.join(' ') +
              (bookmark.tags.length ? ' ' : '') +
              bookmark.sites.map((site) => site.replace('/', ' › ')).join(' '),
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
            points: bookmark.points
              ? parseInt(`${bookmark.points}${bookmark.created_at}`)
              : bookmark.created_at,
          })),
          chunk_size,
        )
        indexed_count += chunk.length
        const progress_percentage = Math.round(
          (indexed_count / bookmarks.length) * 100,
        )
        set_indexed_bookmarks_percentage(
          progress_percentage < 100 ? progress_percentage : undefined,
        )
      }
      new_bookmarks_just_tags = bookmarks.map((bookmark) => ({
        id: bookmark.id,
        tags: bookmark.tags,
      }))
      !params.is_archived_
        ? local_db.set_bookmarks_just_tags(new_bookmarks_just_tags)
        : local_db.set_archived_bookmarks_just_tags(new_bookmarks_just_tags)
      set_indexed_bookmarks_percentage(undefined)
    }

    if (!params.is_archived_) {
      local_db.set_db(new_db)
      local_db.set_db_updated_at_timestamp(Date.now())
      set_search_data_awaits_caching(true)
    } else {
      local_db.set_archived_db(new_db)
      set_archived_search_data_awaits_caching(true)
      local_db.set_archived_db_updated_at_timestamp(Date.now())
    }

    set_is_initializing(false)
    return {
      db: new_db,
      bookmarks_just_tags: new_bookmarks_just_tags,
    }
  }

  // Data is cached on link click, focus lose and route change.
  const cache_data_ = async () => {
    if (search_data_awaits_caching) {
      const cached_at =
        (await localforage.getItem<number>(
          !username
            ? browser_storage.local_forage.authorized_library.search
                .cached_at_timestamp
            : browser_storage.local_forage.public_library.search.cached_at_timestamp(
                {
                  username: username as string,
                },
              ),
        )) || undefined
      // Cache was updated in another tab.
      if (
        local_db.db_updated_at_timestamp &&
        cached_at &&
        local_db.db_updated_at_timestamp < cached_at
      )
        return
      const index = await saveWithHighlight(local_db.db!)
      if (!username) {
        await localforage.setItem(
          browser_storage.local_forage.authorized_library.search
            .cached_at_timestamp,
          local_db.db_updated_at_timestamp,
        )
        await localforage.setItem(
          browser_storage.local_forage.authorized_library.search.index,
          JSON.stringify(index),
        )
        await localforage.setItem(
          browser_storage.local_forage.authorized_library.search.bookmarks,
          JSON.stringify(local_db.bookmarks_just_tags),
        )
      }
      // else {
      //   await localforage.setItem(
      //     browser_storage.local_forage.public_library.search.cached_at_timestamp(
      //       {
      //         username: username as string,
      //       },
      //     ),
      //     db_updated_at_timestamp,
      //   )
      //   await localforage.setItem(
      //     browser_storage.local_forage.public_library.search.index({
      //       username: username as string,
      //     }),
      //     JSON.stringify(index),
      //   )
      //   await localforage.setItem(
      //     browser_storage.local_forage.public_library.search.bookmarks({
      //       username: username as string,
      //     }),
      //     JSON.stringify(local_db.bookmarks_just_tags),
      //   )
      // }
      set_search_data_awaits_caching(false)
    }
    if (archived_search_data_awaits_caching) {
      const cached_at =
        (await localforage.getItem<number>(
          !username
            ? browser_storage.local_forage.authorized_library.search
                .archived_cached_at_timestamp
            : browser_storage.local_forage.public_library.search.archived_cached_at_timestamp(
                { username: username as string },
              ),
        )) || undefined
      // Cache was updated in another tab.
      if (
        local_db.archived_db_updated_at_timestamp &&
        cached_at &&
        local_db.archived_db_updated_at_timestamp < cached_at
      )
        return
      const index = await saveWithHighlight(local_db.archived_db!)
      if (!username) {
        await localforage.setItem(
          browser_storage.local_forage.authorized_library.search
            .archived_cached_at_timestamp,
          local_db.archived_db_updated_at_timestamp,
        )
        await localforage.setItem(
          browser_storage.local_forage.authorized_library.search.archived_index,
          JSON.stringify(index),
        )
        await localforage.setItem(
          browser_storage.local_forage.authorized_library.search
            .archived_bookmarks,
          JSON.stringify(local_db.bookmarks_just_tags),
        )
      }
      // else {
      //   await localforage.setItem(
      //     browser_storage.local_forage.public_library.search.archived_cached_at_timestamp(
      //       { username: username as string },
      //     ),
      //     archived_db_updated_at_timestamp,
      //   )
      //   await localforage.setItem(
      //     browser_storage.local_forage.public_library.search.archived_index({
      //       username: username as string,
      //     }),
      //     JSON.stringify(index),
      //   )
      //   await localforage.setItem(
      //     browser_storage.local_forage.public_library.search.archived_bookmarks(
      //       { username: username as string },
      //     ),
      //     JSON.stringify(local_db.bookmarks_just_tags),
      //   )
      // }
      set_archived_search_data_awaits_caching(false)
    }
  }

  const clear_cached_data_ = async (params: { is_archived_: boolean }) => {
    if (!username) {
      await localforage.removeItem(
        !params.is_archived_
          ? browser_storage.local_forage.authorized_library.search.index
          : browser_storage.local_forage.authorized_library.search
              .archived_index,
      )
      await localforage.removeItem(
        !params.is_archived_
          ? browser_storage.local_forage.authorized_library.search.bookmarks
          : browser_storage.local_forage.authorized_library.search
              .archived_bookmarks,
      )
      await localforage.removeItem(
        !params.is_archived_
          ? browser_storage.local_forage.authorized_library.search
              .cached_at_timestamp
          : browser_storage.local_forage.authorized_library.search
              .archived_cached_at_timestamp,
      )
    } else {
      await localforage.removeItem(
        !params.is_archived_
          ? browser_storage.local_forage.public_library.search.index({
              username: username as string,
            })
          : browser_storage.local_forage.public_library.search.archived_index({
              username: username as string,
            }),
      )
      await localforage.removeItem(
        !params.is_archived_
          ? browser_storage.local_forage.public_library.search.bookmarks({
              username: username as string,
            })
          : browser_storage.local_forage.public_library.search.archived_bookmarks(
              { username: username as string },
            ),
      )
      await localforage.removeItem(
        !params.is_archived_
          ? browser_storage.local_forage.public_library.search.cached_at_timestamp(
              {
                username: username as string,
              },
            )
          : browser_storage.local_forage.public_library.search.archived_cached_at_timestamp(
              { username: username as string },
            ),
      )
    }
    if (!params.is_archived_) {
      local_db.set_db(undefined)
    } else {
      local_db.set_archived_db(undefined)
    }
  }

  const get_result = async (params: {
    search_string_: string
  }): Promise<Results<Result>> => {
    if (
      (!is_archived_filter && !local_db.db) ||
      (is_archived_filter && !local_db.archived_db)
    )
      throw new Error('DB should be there.')

    const tags = search_params.get(search_params_keys.tags)
    const gte = search_params.get(search_params_keys.greater_than_equal)
    const lte = search_params.get(search_params_keys.less_than_equal)
    const order = search_params.get(search_params_keys.order)
    const sortby = search_params.get(search_params_keys.sort_by)

    // 'lorem site:abc.com site:abc.com ipsum site:abc.com'
    // ["abccom", "abccom", "abccom"]
    const sites_variants = get_sites_variants_from_search_string(
      params.search_string_,
    )

    const term = params.search_string_
      .replace(/(?=site:)(.*?)($|\s)/g, '')
      .trim()

    const result: Results<Result> = await searchWithHighlight(
      !is_archived_filter ? local_db.db! : local_db.archived_db!,
      {
        limit: system_values.max_library_search_results,
        term,
        properties: ['text'],
        where: {
          ...(tags && ids_to_search_amongst
            ? { id: ids_to_search_amongst }
            : {}),
          ...(current_filter_ == Filter.UNREAD ||
          current_filter_ == Filter.STARRED_UNREAD ||
          current_filter_ == Filter.ARCHIVED_UNREAD ||
          current_filter_ == Filter.ARCHIVED_STARRED_UNREAD
            ? {
                is_unread: true,
              }
            : {}),
          stars: {
            gte:
              current_filter_ == Filter.STARRED ||
              current_filter_ == Filter.STARRED_UNREAD ||
              current_filter_ == Filter.ARCHIVED_STARRED ||
              current_filter_ == Filter.ARCHIVED_STARRED_UNREAD
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

  const query_db_ = async (params: {
    search_string_: string
    refresh_highlights_only_?: boolean
  }) => {
    const result = await get_result({ search_string_: params.search_string_ })

    set_incoming_highlights(
      result.hits.reduce((a, v) => {
        const positions = Object.values((v as any).positions.text)
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
      get_sites_variants_from_search_string(params.search_string_),
    )

    if (!params.refresh_highlights_only_) {
      clear_library_session_storage({
        username,
        search_params: search_params.toString(),
        hash: '#' + encodeURIComponent(params.search_string_),
      })
      set_count_(result.count)
      if (result.count) {
        set_result(result)
        set_queried_at_timestamp(Date.now())
        set_search_fragment_({
          search_string: params.search_string_,
        })
        sessionStorage.setItem(
          browser_storage.session_storage.library.search_string({
            username,
            search_params: search_params.toString(),
            hash: '#' + params.search_string_,
          }),
          params.search_string_,
        )
        sessionStorage.setItem(
          browser_storage.session_storage.library.search_results_count({
            username,
            search_params: search_params.toString(),
            hash: '#' + params.search_string_,
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
                params.search_string_.toLowerCase().trim(),
                ...recent_library_searches,
              ].slice(0, 1000),
            ),
          ]),
        )
      }
    }
  }

  const get_hints_ = async () => {
    if (
      (!is_archived_filter && !local_db.db) ||
      (is_archived_filter && !local_db.archived_db)
    )
      return

    const tags = search_params.get(search_params_keys.tags)
    const gte = search_params.get(search_params_keys.greater_than_equal)
    const lte = search_params.get(search_params_keys.less_than_equal)
    const order = search_params.get(search_params_keys.order)
    const sortby = search_params.get(search_params_keys.sort_by)

    const search_string_lower_case = search_string_.toLowerCase()

    const words = search_string_lower_case.split(' ')
    const last_word = words[words.length - 1]
    const sites_variants = search_string_lower_case
      .match(/(?<=site:)(.*?)($|\s)/g)
      ?.map((site) => site.replaceAll('.', '').replaceAll('/', ''))
    const term = search_string_lower_case
      .replace(/(?=site:)(.*?)($|\s)/g, '')
      .trim()

    if (!search_string_) {
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
            completion: recent_search_string.slice(search_string_.length),
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
          completion: recent_search_string.slice(search_string_.length),
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
              ...(tags && ids_to_search_amongst
                ? { id: ids_to_search_amongst }
                : {}),
              ...(current_filter_ == Filter.UNREAD ||
              current_filter_ == Filter.STARRED_UNREAD ||
              current_filter_ == Filter.ARCHIVED_UNREAD ||
              current_filter_ == Filter.ARCHIVED_STARRED_UNREAD
                ? {
                    is_unread: true,
                  }
                : {}),
              stars: {
                gte:
                  current_filter_ == Filter.STARRED ||
                  current_filter_ == Filter.STARRED_UNREAD ||
                  current_filter_ == Filter.ARCHIVED_STARRED ||
                  current_filter_ == Filter.ARCHIVED_STARRED_UNREAD
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
        set_count_(undefined)
      } else {
        const pre_result = await get_result({
          search_string_: search_string_lower_case,
        })

        const ids_of_hits = pre_result.hits.map((hit) => hit.id)

        set_count_(pre_result.count)

        if (last_word.length) {
          const result: Results<Result> = await search(
            !is_archived_filter ? local_db.db! : local_db.archived_db!,
            {
              term,
              properties: ['text'],
              where: {
                id: ids_of_hits,
                ...(current_filter_ == Filter.UNREAD ||
                current_filter_ == Filter.STARRED_UNREAD ||
                current_filter_ == Filter.ARCHIVED_UNREAD ||
                current_filter_ == Filter.ARCHIVED_STARRED_UNREAD
                  ? {
                      is_unread: true,
                    }
                  : {}),
                stars: {
                  gte:
                    current_filter_ == Filter.STARRED ||
                    current_filter_ == Filter.STARRED_UNREAD ||
                    current_filter_ == Filter.ARCHIVED_STARRED ||
                    current_filter_ == Filter.ARCHIVED_STARRED_UNREAD
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
            const word = document.text
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
              properties: ['text'],
              where: {
                id: ids_of_hits,
                ...(current_filter_ == Filter.UNREAD ||
                current_filter_ == Filter.STARRED_UNREAD ||
                current_filter_ == Filter.ARCHIVED_UNREAD ||
                current_filter_ == Filter.ARCHIVED_STARRED_UNREAD
                  ? {
                      is_unread: true,
                    }
                  : {}),
                stars: {
                  gte:
                    current_filter_ == Filter.STARRED ||
                    current_filter_ == Filter.STARRED_UNREAD ||
                    current_filter_ == Filter.ARCHIVED_STARRED ||
                    current_filter_ == Filter.ARCHIVED_STARRED_UNREAD
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
    if (is_search_focused_) {
      set_result(undefined)
      get_hints_()
    }
  }, [search_string_])

  const clear_hints_ = () => {
    set_hints(undefined)
  }

  const remove_recent_hint_ = (params: { search_string_: string }) => {
    localStorage.setItem(
      browser_storage.local_storage.recent_library_searches,
      JSON.stringify(
        JSON.parse(
          localStorage.getItem(
            browser_storage.local_storage.recent_library_searches,
          ) || '[]',
        ).filter(
          (recent_serach_string: string) =>
            recent_serach_string != params.search_string_,
        ),
      ),
    )
    setTimeout(() => {
      get_hints_()
      set_is_search_focused_(true)
    }, 100)
  }

  const reset_ = () => {
    set_search_string_('')
    set_count_(undefined)
    set_result(undefined)
    set_hints(undefined)
    set_incoming_highlights(undefined)
    set_incoming_highlights_sites_variants(undefined)
  }

  const delete_bookmark_ = async (params: {
    db_: Orama<typeof schema>
    bookmarks_just_tags_: BookmarkTags[]
    is_archived_: boolean
    bookmark_id_: number
  }) => {
    await remove(params.db_, params.bookmark_id_.toString())

    if (!is_archived_filter) {
      const new_bookmarks_just_tags = params.bookmarks_just_tags_.filter(
        (bookmark) => bookmark.id != params.bookmark_id_,
      )
      local_db.set_bookmarks_just_tags(new_bookmarks_just_tags)
      set_search_data_awaits_caching(true)
      local_db.set_db_updated_at_timestamp(Date.now())
    } else {
      const new_archived_bookmarks_just_tags =
        params.bookmarks_just_tags_.filter(
          (bookmark) => bookmark.id != params.bookmark_id_,
        )
      local_db.set_archived_bookmarks_just_tags(
        new_archived_bookmarks_just_tags,
      )
      set_archived_search_data_awaits_caching(true)
      local_db.set_archived_db_updated_at_timestamp(Date.now())
    }
    if (result_?.hits.length) {
      query_db_({
        search_string_: search_string_,
        refresh_highlights_only_: true,
      })
    }
  }

  const update_bookmark_ = async (params: {
    db_: Orama<typeof schema>
    bookmarks_just_tags_: BookmarkTags[]
    is_archived_: boolean
    bookmark_: BookmarkOfSearch
  }) => {
    await remove(params.db_, params.bookmark_.id.toString())

    if (
      (params.is_archived_ && params.bookmark_.is_archived) ||
      (!params.is_archived_ && !params.bookmark_.is_archived)
    ) {
      const sites = params.bookmark_.links.map(
        (link) =>
          `${get_domain_from_url(link.url)}${
            link.site_path ? `/${link.site_path}` : ''
          }`,
      )
      await insert(params.db_, {
        id: params.bookmark_.id.toString(),
        text:
          (params.bookmark_.title ? `${params.bookmark_.title} ` : '') +
          (params.bookmark_.note ? `${params.bookmark_.note} ` : '') +
          params.bookmark_.tags.join(' ') +
          (sites.length ? ' ' : '') +
          sites.join(' '),
        created_at: Math.round(
          new Date(params.bookmark_.created_at).getTime() / 1000,
        ),
        updated_at: Math.round(
          new Date(params.bookmark_.updated_at).getTime() / 1000,
        ),
        visited_at: Math.round(
          new Date(params.bookmark_.visited_at).getTime() / 1000,
        ),
        is_unread: params.bookmark_.is_unread,
        sites,
        sites_variants: sites
          .map((site) => get_site_variants_for_search(site))
          .flat(),
        stars: params.bookmark_.stars || 0,
        tags: params.bookmark_.tags,
        tag_ids: params.bookmark_.tag_ids.map((tag_id) => tag_id.toString()),
      })
    }

    if (!params.is_archived_) {
      const new_bookmarks_just_tags = params.bookmarks_just_tags_!.filter(
        (bookmark) => bookmark.id != params.bookmark_.id,
      )
      if (!params.bookmark_.is_archived) {
        new_bookmarks_just_tags.push({
          id: params.bookmark_.id,
          tags: params.bookmark_.tags,
        })
      }
      local_db.set_bookmarks_just_tags(new_bookmarks_just_tags)
      set_search_data_awaits_caching(true)
      local_db.set_db_updated_at_timestamp(
        new Date(params.bookmark_.updated_at).getTime(),
      )
    } else {
      const new_archived_bookmarks_just_tags =
        params.bookmarks_just_tags_.filter(
          (bookmark) => bookmark.id != params.bookmark_.id,
        )
      if (params.bookmark_.is_archived) {
        new_archived_bookmarks_just_tags.push({
          id: params.bookmark_.id,
          tags: params.bookmark_.tags,
        })
      }
      local_db.set_archived_bookmarks_just_tags(
        new_archived_bookmarks_just_tags,
      )
      set_archived_search_data_awaits_caching(true)
      local_db.set_archived_db_updated_at_timestamp(
        new Date(params.bookmark_.updated_at).getTime(),
      )
    }
    if (result_?.hits.length) {
      await query_db_({
        search_string_: search_string_,
        refresh_highlights_only_: true,
      })
    }
  }

  useUpdateEffect(() => {
    if (!highlights_) return
    sessionStorage.setItem(
      browser_storage.session_storage.library.highlights({
        username,
        search_params: search_params.toString(),
        hash: '#' + search_string_,
      }),
      JSON.stringify(highlights_),
    )
  }, [highlights_])

  useUpdateEffect(() => {
    if (!highlights_sites_variants_) return
    sessionStorage.setItem(
      browser_storage.session_storage.library.highlights_sites_variants({
        username,
        search_params: search_params.toString(),
        hash: '#' + search_string_,
      }),
      JSON.stringify(highlights_sites_variants_),
    )
  }, [highlights_sites_variants_])

  useUpdateEffect(() => {
    if (!result_) return
    sessionStorage.setItem(
      browser_storage.session_storage.library.search_result({
        username,
        search_params: search_params.toString(),
        hash: '#' + search_string_,
      }),
      JSON.stringify(result_),
    )
  }, [result_])

  useEffect(() => {
    const search_params_stringified = search_params.toString()

    if (!window.location.hash) reset_()

    const search_string = sessionStorage.getItem(
      browser_storage.session_storage.library.search_string({
        username,
        search_params: search_params_stringified,
        hash: decodeURIComponent(window.location.hash),
      }),
    )
    if (search_string) {
      set_search_string_(search_string)
    }
    const highlights = sessionStorage.getItem(
      browser_storage.session_storage.library.highlights({
        username,
        search_params: search_params_stringified,
        hash: decodeURIComponent(window.location.hash),
      }),
    )
    if (highlights) {
      set_incoming_highlights(JSON.parse(highlights))
    }
    const highlights_sites_variants = sessionStorage.getItem(
      browser_storage.session_storage.library.highlights_sites_variants({
        username,
        search_params: search_params_stringified,
        hash: decodeURIComponent(window.location.hash),
      }),
    )
    if (highlights_sites_variants) {
      set_incoming_highlights_sites_variants(
        JSON.parse(highlights_sites_variants),
      )
    }
    const count = sessionStorage.getItem(
      browser_storage.session_storage.library.search_results_count({
        username,
        search_params: search_params_stringified,
        hash: decodeURIComponent(window.location.hash),
      }),
    )
    if (count) {
      set_count_(parseInt(count))
    }
    const result = sessionStorage.getItem(
      browser_storage.session_storage.library.search_result({
        username,
        search_params: search_params_stringified,
        hash: decodeURIComponent(window.location.hash),
      }),
    )
    if (result) {
      set_result(JSON.parse(result))
    }

    // Temporary handling of search string on fresh page load.
    if (window.location.hash && !result) {
      const search_string = decodeURIComponent(window.location.hash).slice(1)
      set_search_string_(search_string)
    }

    cache_data_()
  }, [search_params])

  useUpdateEffect(() => {
    if (!has_focus) cache_data_()
  }, [has_focus])

  // Canceling dialog will trigger caching because has_focus will be shortly falsy, triggering effect above.
  useEffect(() => {
    const handle_beforeunload = (e: any) => {
      if (search_data_awaits_caching || archived_search_data_awaits_caching) {
        e.preventDefault()
      }
    }
    addEventListener('beforeunload', handle_beforeunload)
    return () => removeEventListener('beforeunload', handle_beforeunload)
  }, [search_data_awaits_caching, archived_search_data_awaits_caching])

  return {
    is_search_focused_,
    set_is_search_focused_,
    search_string_,
    set_search_string_,
    hints_,
    clear_hints_,
    get_hints_,
    init_,
    query_db_,
    result_,
    is_initializing_,
    delete_bookmark_,
    update_bookmark_,
    set_current_filter_,
    set_selected_tags_,
    indexed_bookmarks_percentage_,
    reset_,
    count_,
    set_count_,
    incoming_highlights_,
    highlights_,
    set_highlights_,
    remove_recent_hint_,
    current_filter_,
    incoming_highlights_sites_variants_,
    highlights_sites_variants_,
    set_highlights_sites_variants_,
    clear_cached_data_,
    hints_set_at_timestamp_,
    queried_at_timestamp_,
    cache_data_,
  }
}

const get_sites_variants_from_search_string = (search_string: string) => {
  return search_string
    .match(/(?<=site:)(.*?)($|\s)/g)
    ?.map((site) => site.replaceAll('.', '').replaceAll('/', '').trim())
    .filter((variant) => variant != '')
}
