import { useParams, usePathname } from 'next/navigation'
import {
  use_library_dispatch,
  use_library_selector,
} from '../../stores/library'
import { useEffect, useState } from 'react'
import { LibraryFilter } from '@shared/types/common/library-filter'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { counts_actions } from '@repositories/stores/library/counts/counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { browser_storage } from '@/constants/browser-storage'

export const use_counts = () => {
  const query_params = use_shallow_search_params()
  const route_params = useParams()
  const route_pathname = usePathname()
  const dispatch = use_library_dispatch()
  const { counts_data, months, tags, is_fetching_counts_data } =
    use_library_selector((state) => state.counts)
  const { bookmarks } = use_library_selector((state) => state.bookmarks)
  const [last_query_tags, set_last_query_tags] = useState<string | null>(null)
  const [last_query_filter, set_last_query_filter] = useState<string | null>(
    null,
  )
  const [selected_tags, set_selected_tags] = useState<number[]>([])
  const [last_query_yyyymm_gte, set_last_query_yyyymm_gte] = useState<
    string | null
  >(null)
  const [last_query_yyyymm_lte, set_last_query_yyyymm_lte] = useState<
    string | null
  >(null)

  const get_counts = () => {
    if (route_pathname == '/bookmarks') {
      const request_params: Counts_Params.Authorized = {}

      const query_tags = query_params.get('t')
      set_last_query_tags(query_tags)
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_filter = query_params.get('f')
      set_last_query_filter(query_filter)
      if (query_filter) {
        request_params.filter =
          Object.values(LibraryFilter)[parseInt(query_filter)]
      }

      sessionStorage.setItem(
        browser_storage.session_storage.last_authorized_counts_params,
        JSON.stringify(request_params),
      )
      dispatch(
        counts_actions.get_authorized_counts({
          request_params,
          api_url: process.env.NEXT_PUBLIC_API_URL,
          auth_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
        }),
      )
    } else {
      const request_params: Counts_Params.Public = {
        username: route_params.username as string,
      }

      const query_tags = query_params.get('t')
      set_last_query_tags(query_tags)
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_filter = query_params.get('f')
      set_last_query_filter(query_filter)
      if (query_filter) {
        request_params.filter =
          Object.values(LibraryFilter)[parseInt(query_filter)]
      }

      dispatch(
        counts_actions.get_public_counts({
          request_params,
          api_url: process.env.NEXT_PUBLIC_API_URL,
        }),
      )
    }
  }

  useEffect(() => {
    const query_tags = query_params.get('t')
    const query_filter = query_params.get('f')
    if (query_tags != last_query_tags || query_filter != last_query_filter) {
      get_counts()
    }

    const query_yyyymm_gte = query_params.get('gte')
    const query_yyyymm_lte = query_params.get('lte')

    if (
      query_yyyymm_gte != last_query_yyyymm_gte ||
      query_yyyymm_lte != last_query_yyyymm_lte
    ) {
      set_last_query_yyyymm_gte(query_yyyymm_gte)
      set_last_query_yyyymm_lte(query_yyyymm_lte)
      dispatch(
        counts_actions.set_yyyymm_gte(
          parseInt(query_yyyymm_gte || '0') || null,
        ),
      )
      dispatch(
        counts_actions.set_yyyymm_lte(
          parseInt(query_yyyymm_lte || '0') || null,
        ),
      )
    }
  }, [query_params])

  useEffect(() => {
    const query_tags = query_params.get('t')
    if (!query_tags && selected_tags.length > 0) {
      set_selected_tags([])
    } else if (query_tags && query_tags != selected_tags.join(',')) {
      const selected_tags = query_tags.split(',').map((t) => parseInt(t))
      set_selected_tags(selected_tags)
    }
  }, [bookmarks])

  useUpdateEffect(() => {
    if (tags) {
      sessionStorage.setItem(
        `tags__${query_params.toString()}`,
        JSON.stringify(tags),
      )
    }
  }, [counts_data, tags])

  useEffect(() => {
    const tags = sessionStorage.getItem(`tags__${query_params.toString()}`)

    if (tags) {
      dispatch(counts_actions.set_tags(JSON.parse(tags)))
    }

    get_counts()

    return () => {
      for (const key in sessionStorage) {
        if (key.substring(0, 11) == 'months_data') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 4) == 'tags') {
          sessionStorage.removeItem(key)
        }
      }
    }
  }, [])

  return {
    months,
    is_fetching_counts_data,
    tags,
    selected_tags,
  }
}