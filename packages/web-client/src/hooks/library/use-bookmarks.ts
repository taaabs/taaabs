import { useParams, usePathname } from 'next/navigation'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import {
  use_library_dispatch,
  use_library_selector,
} from '../../stores/library'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useEffect, useState } from 'react'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { Sortby } from '@shared/types/modules/bookmarks/sortby'
import { Order } from '@shared/types/modules/bookmarks/order'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { GetBookmarks_Params } from '@repositories/modules/bookmarks/domain/types/get-bookmarks.params'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'

export const use_bookmarks = (params: { is_in_search_mode: boolean }) => {
  const query_params = use_shallow_search_params()
  const route_params = useParams()
  const route_pathname = usePathname()
  const dispatch = use_library_dispatch()
  const { bookmarks, has_more_bookmarks } = use_library_selector(
    (state) => state.bookmarks,
  )
  const [last_query_tags, set_last_query_tags] = useState<string | null>(null)
  const [last_query_category, set_last_query_category] = useState<
    string | null
  >(null)
  const [last_query_filter, set_last_query_filter] = useState<string | null>(
    null,
  )
  const [last_query_sortby, set_last_query_sortby] = useState<string | null>(
    null,
  )
  const [last_query_order, set_last_query_order] = useState<string | null>(null)
  const [last_query_yyyymm_gte, set_last_query_yyyymm_gte] = useState<
    string | null
  >(null)
  const [last_query_yyyymm_lte, set_last_query_yyyymm_lte] = useState<
    string | null
  >(null)

  const get_bookmarks = (params: { should_get_next_page?: boolean }) => {
    if (route_pathname == '/library') {
      const request_params: GetBookmarks_Params.Authorized = {}

      const query_tags = query_params.get('t')
      set_last_query_tags(query_tags)
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_category = query_params.get('c')
      set_last_query_category(query_category)
      if (query_category) {
        request_params.category_id = query_category
      }

      const query_filter = query_params.get('f')
      set_last_query_filter(query_filter)
      if (query_filter) {
        request_params.filter =
          Object.values(LibraryFilter)[parseInt(query_filter)]
      }

      const query_sortby = query_params.get('s')
      set_last_query_sortby(query_sortby)
      if (query_sortby) {
        request_params.sort_by = Object.values(Sortby)[parseInt(query_sortby)]
      }

      const query_order = query_params.get('o')
      set_last_query_order(query_order)
      if (query_order) {
        request_params.order = Object.values(Order)[parseInt(query_order)]
      }

      const query_yyyymm_gte = query_params.get('gte')
      set_last_query_yyyymm_gte(query_yyyymm_gte)
      if (query_yyyymm_gte) {
        request_params.yyyymm_gte = parseInt(query_yyyymm_gte)
      }

      const query_yyyymm_lte = query_params.get('lte')
      set_last_query_yyyymm_lte(query_yyyymm_lte)
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
        username: route_params.username as string,
      }

      const query_tags = query_params.get('t')
      set_last_query_tags(query_tags)
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_category = query_params.get('c')
      set_last_query_category(query_category)
      if (query_category) {
        request_params.category_id = query_category
      }

      const query_filter = query_params.get('f')
      set_last_query_filter(query_filter)
      if (query_filter) {
        request_params.filter =
          Object.values(LibraryFilter)[parseInt(query_filter)]
      }

      const query_sortby = query_params.get('s')
      set_last_query_sortby(query_sortby)
      if (query_sortby) {
        request_params.sort_by = Object.values(Sortby)[parseInt(query_sortby)]
      }

      const query_order = query_params.get('o')
      set_last_query_order(query_order)
      if (query_order) {
        request_params.order = Object.values(Order)[parseInt(query_order)]
      }

      const query_yyyymm_gte = query_params.get('gte')
      set_last_query_yyyymm_gte(query_yyyymm_gte)
      if (query_yyyymm_gte) {
        request_params.yyyymm_gte = parseInt(query_yyyymm_gte)
      }

      const query_yyyymm_lte = query_params.get('lte')
      set_last_query_yyyymm_lte(query_yyyymm_lte)
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
    const query_tags = query_params.get('t')
    const query_category = query_params.get('c')
    const query_filter = query_params.get('f')
    const query_sortby = query_params.get('s')
    const query_order = query_params.get('o')
    const query_yyyy_gte = query_params.get('gte')
    const query_yyyy_lte = query_params.get('lte')

    if (
      query_params.size == 0 ||
      query_tags != last_query_tags ||
      query_category != last_query_category ||
      query_filter != last_query_filter ||
      query_sortby != last_query_sortby ||
      query_order != last_query_order ||
      query_yyyy_gte != last_query_yyyymm_gte ||
      query_yyyy_lte != last_query_yyyymm_lte
    ) {
      get_bookmarks({})
    }
  }, [query_params])

  const set_bookomarks_to_session_storage = useDebouncedCallback(
    (params: {
      bookmarks: Bookmark_Entity[]
      query_params: string
      has_more_bookmarks: boolean
    }) => {
      sessionStorage.setItem(
        `bookmarks__${params.query_params}`,
        JSON.stringify(params.bookmarks),
      )
      sessionStorage.setItem(
        `has_more_bookmarks__${params.query_params}`,
        `${params.has_more_bookmarks}`,
      )
    },
    [],
    0,
  )

  useUpdateEffect(() => {
    if (params.is_in_search_mode) return
    set_bookomarks_to_session_storage({
      bookmarks: bookmarks,
      query_params: query_params.toString(),
      has_more_bookmarks,
    })
  }, [bookmarks])

  useEffect(() => {
    const bookmarks = sessionStorage.getItem(
      `bookmarks__${query_params.toString()}`,
    )

    if (bookmarks) {
      dispatch(bookmarks_actions.set_bookmarks(JSON.parse(bookmarks)))
      const has_more_bookmarks = sessionStorage.getItem(
        `has_more_bookmarks__${query_params.toString()}`,
      )
      if (has_more_bookmarks) {
        dispatch(
          bookmarks_actions.set_has_more_bookmarks(
            has_more_bookmarks == 'true',
          ),
        )
      }
    } else {
      get_bookmarks({})
    }

    return () => {
      for (const key in sessionStorage) {
        if (key.substring(0, 9) == 'bookmarks') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 18) == 'has_more_bookmarks') {
          sessionStorage.removeItem(key)
        }
      }
    }
  }, [])

  return { get_bookmarks }
}
