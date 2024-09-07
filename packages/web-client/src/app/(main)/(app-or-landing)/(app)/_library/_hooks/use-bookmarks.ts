import { useParams, useSearchParams } from 'next/navigation'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import {
  use_library_dispatch,
  use_library_selector,
} from '../../../../../../stores/library'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useContext } from 'react'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { GetBookmarks_Params } from '@repositories/modules/bookmarks/domain/types/get-bookmarks.params'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { browser_storage } from '@/constants/browser-storage'
import { Filter } from '@/types/library/filter'
import { system_values } from '@shared/constants/system-values'
import { search_params_keys } from '@/constants/search-params-keys'
import { AuthContext } from '@/providers/AuthProvider'
import { use_is_hydrated } from '@shared/hooks'

export const use_bookmarks = () => {
  const auth_context = useContext(AuthContext)
  const is_hydrated = use_is_hydrated()
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()
  const dispatch = use_library_dispatch()
  const {
    bookmarks,
    incoming_bookmarks,
    is_fetching_more_bookmarks,
    has_more_bookmarks,
    density,
    is_fetching,
    showing_bookmarks_fetched_by_ids,
    first_bookmarks_fetched_at_timestamp,
    is_fetching_first_bookmarks,
    is_upserting,
  } = use_library_selector((state) => state.bookmarks)

  const get_bookmarks = (params: { should_get_next_page?: boolean }) => {
    if (!username) {
      const request_params: GetBookmarks_Params.Authorized = {}

      const query_tags = search_params.get(search_params_keys.tags)
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_filter = search_params.get(search_params_keys.filter)
      if (query_filter) {
        request_params.starred_only =
          Object.values(Filter)[parseInt(query_filter)] == Filter.STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.STARRED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined

        request_params.unsorted_only =
          Object.values(Filter)[parseInt(query_filter)] == Filter.UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.STARRED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined

        request_params.is_archived =
          Object.values(Filter)[parseInt(query_filter)] == Filter.ARCHIVED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined
      }

      const query_sortby = search_params.get(search_params_keys.sort_by)
      if (query_sortby) {
        request_params.sort_by = Object.values(SortBy)[parseInt(query_sortby)]
      }

      const query_order = search_params.get(search_params_keys.order)
      if (query_order) {
        request_params.order = Object.values(Order)[parseInt(query_order)]
      }

      const query_yyyymm_gte = search_params.get(
        search_params_keys.greater_than_equal,
      )
      if (query_yyyymm_gte) {
        request_params.yyyymm_gte = parseInt(query_yyyymm_gte)
      }

      const query_yyyymm_lte = search_params.get(
        search_params_keys.less_than_equal,
      )
      if (query_yyyymm_lte) {
        request_params.yyyymm_lte = parseInt(query_yyyymm_lte)
      }

      if (params.should_get_next_page) {
        if (!bookmarks) throw new Error('Bookmarks should be there.')
        request_params.after = bookmarks[bookmarks.length - 1].id
      }

      dispatch(
        bookmarks_actions.get_authorized_bookmarks({
          request_params,
          ky: auth_context.ky_instance,
          encryption_key: auth_context.auth_data!.encryption_key,
        }),
      )
    } else {
      const request_params: GetBookmarks_Params.Public = {
        username,
      }

      const query_tags = search_params.get(search_params_keys.tags)
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_filter = search_params.get(search_params_keys.filter)
      if (query_filter) {
        request_params.starred_only =
          Object.values(Filter)[parseInt(query_filter)] == Filter.STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.STARRED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined

        request_params.is_archived =
          Object.values(Filter)[parseInt(query_filter)] == Filter.ARCHIVED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_UNSORTED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNSORTED ||
          undefined
      }

      const query_sortby = search_params.get(search_params_keys.sort_by)
      if (query_sortby) {
        request_params.sort_by = Object.values(SortBy)[parseInt(query_sortby)]
      }

      const query_order = search_params.get(search_params_keys.order)
      if (query_order) {
        request_params.order = Object.values(Order)[parseInt(query_order)]
      }

      const query_yyyymm_gte = search_params.get(
        search_params_keys.greater_than_equal,
      )
      if (query_yyyymm_gte) {
        request_params.yyyymm_gte = parseInt(query_yyyymm_gte)
      }

      const query_yyyymm_lte = search_params.get(
        search_params_keys.less_than_equal,
      )
      if (query_yyyymm_lte) {
        request_params.yyyymm_lte = parseInt(query_yyyymm_lte)
      }

      if (params.should_get_next_page) {
        if (!bookmarks) throw new Error('Bookmarks should be there.')
        request_params.after = bookmarks[bookmarks.length - 1].id
      }

      dispatch(
        bookmarks_actions.get_public_bookmarks({
          request_params,
          ky: auth_context.ky_instance,
        }),
      )
    }
  }

  const get_bookmarks_by_ids = async (params: {
    // All ids of a search result
    all_not_paginated_ids: number[]
    should_get_next_page?: boolean
  }) => {
    let ids: number[] = []
    if (params.should_get_next_page) {
      // Bookmark could be filtered out
      const last_id = bookmarks![bookmarks!.length - 1].id
      const idx_of_hit =
        params.all_not_paginated_ids.findIndex((id) => id == last_id) + 1
      ids = params.all_not_paginated_ids.slice(
        idx_of_hit,
        idx_of_hit + system_values.library.bookmarks.per_page,
      )
    } else {
      ids = params.all_not_paginated_ids.slice(
        0,
        system_values.library.bookmarks.per_page,
      )
    }

    if (!username) {
      await dispatch(
        bookmarks_actions.get_authorized_bookmarks_by_ids({
          ky: auth_context.ky_instance,
          is_next_page: params.should_get_next_page || false!,
          request_params: {
            ids,
          },
          encryption_key: auth_context.auth_data!.encryption_key,
        }),
      )
    } else {
      await dispatch(
        bookmarks_actions.get_public_bookmarks_by_ids({
          ky: auth_context.ky_instance,
          is_next_page: params.should_get_next_page || false,
          request_params: {
            ids,
            username,
          },
        }),
      )
    }
  }

  useUpdateEffect(() => {
    try {
      // We pass #fresh when user navigates to the library from the extension.
      // Avoids stale results if library was previously opened on a given tab.
      if (window.location.hash.startsWith('#fresh')) {
        throw new Error('Should load fresh results.')
      }

      const bookmarks = sessionStorage.getItem(
        browser_storage.session_storage.library.bookmarks({
          username: username as string,
          search_params: search_params.toString(),
          hash: window.location.hash,
        }),
      )

      if (bookmarks) {
        if (window.location.hash.startsWith('#q=')) {
          dispatch(bookmarks_actions.set_showing_bookmarks_fetched_by_ids(true))
        } else {
          dispatch(
            bookmarks_actions.set_showing_bookmarks_fetched_by_ids(false),
          )
        }
        dispatch(
          bookmarks_actions.set_first_bookmarks_fetched_at_timestamp(
            Date.now(),
          ),
        )
        dispatch(
          bookmarks_actions.set_incoming_bookmarks(JSON.parse(bookmarks)),
        )
        dispatch(bookmarks_actions.set_bookmarks(JSON.parse(bookmarks)))
        const has_more_bookmarks = sessionStorage.getItem(
          browser_storage.session_storage.library.has_more_bookmarks({
            username: username as string,
            search_params: search_params.toString(),
          }),
        )
        if (has_more_bookmarks) {
          dispatch(
            bookmarks_actions.set_has_more_bookmarks(
              has_more_bookmarks == 'true',
            ),
          )
        }
        const density = sessionStorage.getItem(
          browser_storage.session_storage.library.density({
            username: username as string,
            search_params: search_params.toString(),
            hash: window.location.hash,
          }),
        )
        if (density) {
          dispatch(bookmarks_actions.set_density(density as any))
        }
      } else {
        throw new Error('Session data was not found.')
      }
    } catch (error) {
      console.debug('[use_bookmarks]', error)
      if (window.location.hash.startsWith('#q=')) return
      get_bookmarks({})
    }
  }, [is_hydrated, search_params])

  const set_bookomarks_to_session_storage = useDebouncedCallback(
    (params: {
      bookmarks: Bookmark_Entity[]
      search_params: string
      has_more_bookmarks: boolean
      density: string
      username?: string
    }) => {
      sessionStorage.setItem(
        browser_storage.session_storage.library.bookmarks({
          username: params.username,
          search_params: params.search_params,
          hash: window.location.hash,
        }),
        JSON.stringify(params.bookmarks),
      )
      sessionStorage.setItem(
        browser_storage.session_storage.library.has_more_bookmarks({
          username: params.username,
          search_params: params.search_params,
        }),
        `${params.has_more_bookmarks}`,
      )
      sessionStorage.setItem(
        browser_storage.session_storage.library.density({
          username: params.username,
          search_params: params.search_params,
          hash: window.location.hash,
        }),
        `${params.density}`,
      )
    },
    [],
    100,
  )

  useUpdateEffect(() => {
    if (bookmarks === undefined || has_more_bookmarks === undefined) return
    set_bookomarks_to_session_storage({
      bookmarks,
      search_params: search_params.toString(),
      has_more_bookmarks,
      username,
      density,
    })
  }, [bookmarks])

  return {
    bookmarks,
    get_bookmarks,
    get_bookmarks_by_ids,
    incoming_bookmarks,
    is_fetching,
    is_fetching_more_bookmarks,
    has_more_bookmarks,
    density,
    showing_bookmarks_fetched_by_ids,
    first_bookmarks_fetched_at_timestamp,
    is_fetching_first_bookmarks,
    is_upserting,
  }
}
