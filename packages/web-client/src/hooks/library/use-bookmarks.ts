import { useParams, useSearchParams } from 'next/navigation'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import {
  use_library_dispatch,
  use_library_selector,
} from '../../stores/library'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useEffect } from 'react'
import { Filter } from '@shared/types/common/filter'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { GetBookmarks_Params } from '@repositories/modules/bookmarks/domain/types/get-bookmarks.params'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { browser_storage } from '@/constants/browser-storage'

export const use_bookmarks = (params: { is_in_search_mode: boolean }) => {
  const query_params = useSearchParams()
  const { username } = useParams()
  const dispatch = use_library_dispatch()
  const { bookmarks, has_more_bookmarks, density } = use_library_selector(
    (state) => state.bookmarks,
  )

  const get_bookmarks = (params: { should_get_next_page?: boolean }) => {
    if (!username) {
      const request_params: GetBookmarks_Params.Authorized = {}

      const query_tags = query_params.get('t')
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_filter = query_params.get('f')
      if (query_filter) {
        request_params.filter = Object.values(Filter)[parseInt(query_filter)]
      }

      const query_sortby = query_params.get('s')
      if (query_sortby) {
        request_params.sort_by = Object.values(SortBy)[parseInt(query_sortby)]
      }

      const query_order = query_params.get('o')
      if (query_order) {
        request_params.order = Object.values(Order)[parseInt(query_order)]
      }

      const query_yyyymm_gte = query_params.get('gte')
      if (query_yyyymm_gte) {
        request_params.yyyymm_gte = parseInt(query_yyyymm_gte)
      }

      const query_yyyymm_lte = query_params.get('lte')
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
          api_url: process.env.NEXT_PUBLIC_API_URL,
          auth_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
        }),
      )
    } else {
      const request_params: GetBookmarks_Params.Public = {
        username: username as string,
      }

      const query_tags = query_params.get('t')
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_filter = query_params.get('f')
      if (query_filter) {
        request_params.filter = Object.values(Filter)[parseInt(query_filter)]
      }

      const query_sortby = query_params.get('s')
      if (query_sortby) {
        request_params.sort_by = Object.values(SortBy)[parseInt(query_sortby)]
      }

      const query_order = query_params.get('o')
      if (query_order) {
        request_params.order = Object.values(Order)[parseInt(query_order)]
      }

      const query_yyyymm_gte = query_params.get('gte')
      if (query_yyyymm_gte) {
        request_params.yyyymm_gte = parseInt(query_yyyymm_gte)
      }

      const query_yyyymm_lte = query_params.get('lte')
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
          api_url: process.env.NEXT_PUBLIC_API_URL,
        }),
      )
    }
  }

  useUpdateEffect(() => {
    const bookmarks = sessionStorage.getItem(
      browser_storage.session_storage.library.bookmarks({
        username: username as string,
        query_params: query_params.toString(),
      }),
    )

    if (bookmarks) {
      dispatch(bookmarks_actions.set_showing_bookmarks_fetched_by_ids(false))
      dispatch(bookmarks_actions.set_bookmarks(JSON.parse(bookmarks)))
      const has_more_bookmarks = sessionStorage.getItem(
        browser_storage.session_storage.library.has_more_bookmarks({
          username: username as string,
          query_params: query_params.toString(),
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
          query_params: query_params.toString(),
        }),
      )
      if (density) {
        dispatch(bookmarks_actions.set_density(density as any))
      }
    } else {
      get_bookmarks({})
    }
  }, [query_params])

  const set_bookomarks_to_session_storage = useDebouncedCallback(
    (params: {
      bookmarks: Bookmark_Entity[]
      query_params: string
      has_more_bookmarks: boolean
      density: string
      username?: string
    }) => {
      sessionStorage.setItem(
        browser_storage.session_storage.library.bookmarks({
          username: params.username,
          query_params: params.query_params.toString(),
        }),
        JSON.stringify(params.bookmarks),
      )
      sessionStorage.setItem(
        browser_storage.session_storage.library.has_more_bookmarks({
          username: params.username,
          query_params: params.query_params.toString(),
        }),
        `${params.has_more_bookmarks}`,
      )
      sessionStorage.setItem(
        browser_storage.session_storage.library.density({
          username: params.username,
          query_params: params.query_params.toString(),
        }),
        `${params.density}`,
      )
    },
    [],
    0,
  )

  useUpdateEffect(() => {
    if (params.is_in_search_mode) return
    set_bookomarks_to_session_storage({
      bookmarks,
      query_params: query_params.toString(),
      has_more_bookmarks,
      username,
      density,
    })
  }, [bookmarks])

  useEffect(() => {
    const bookmarks = sessionStorage.getItem(
      browser_storage.session_storage.library.bookmarks({
        username: username as string,
        query_params: query_params.toString(),
      }),
    )

    if (bookmarks) {
      dispatch(bookmarks_actions.set_bookmarks(JSON.parse(bookmarks)))
      const has_more_bookmarks = sessionStorage.getItem(
        browser_storage.session_storage.library.has_more_bookmarks({
          username: username as string,
          query_params: query_params.toString(),
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
          query_params: query_params.toString(),
        }),
      )
      if (density) {
        dispatch(bookmarks_actions.set_density(density as any))
      }
    } else {
      get_bookmarks({})
    }
  }, [])

  return { get_bookmarks }
}
