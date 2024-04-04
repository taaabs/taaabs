import { useParams, useSearchParams } from 'next/navigation'
import {
  use_library_dispatch,
  use_library_selector,
} from '../../stores/library'
import { useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { counts_actions } from '@repositories/stores/library/counts/counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { browser_storage } from '@/constants/browser-storage'
import { Filter } from '@/types/library/filter'
import ky from 'ky'

export const use_counts = () => {
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()
  const dispatch = use_library_dispatch()
  const { counts_data, months, tags, is_fetching } = use_library_selector(
    (state) => state.counts,
  )
  const { bookmarks } = use_library_selector((state) => state.bookmarks)
  const [last_query_tags, set_last_query_tags] = useState<string>()
  const [last_query_filter, set_last_query_filter] = useState<string>()
  const [last_query_refresh_trigger, set_last_query_refresh_trigger] =
    useState<string>()
  const [selected_tags, set_selected_tags] = useState<number[]>([])
  const [last_query_yyyymm_gte, set_last_query_yyyymm_gte] = useState<string>()
  const [last_query_yyyymm_lte, set_last_query_yyyymm_lte] = useState<string>()

  const get_counts = () => {
    const ky_instance = ky.create({
      prefixUrl: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY`,
        'Content-Type': 'application/json',
      },
    })

    if (!username) {
      const request_params: Counts_Params.Authorized = {}

      const query_refresh_trigger = search_params.get('r')
      set_last_query_refresh_trigger(query_refresh_trigger || undefined)

      const query_tags = search_params.get('t')
      set_last_query_tags(query_tags || undefined)
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_filter = search_params.get('f')
      set_last_query_filter(query_filter || undefined)
      if (query_filter) {
        request_params.starred_only =
          Object.values(Filter)[parseInt(query_filter)] == Filter.STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.STARRED_UNREAD ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNREAD ||
          undefined

        request_params.unread_only =
          Object.values(Filter)[parseInt(query_filter)] == Filter.UNREAD ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.STARRED_UNREAD ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_UNREAD ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNREAD ||
          undefined

        request_params.is_archived =
          Object.values(Filter)[parseInt(query_filter)] == Filter.ARCHIVED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_UNREAD ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNREAD ||
          undefined
      }

      sessionStorage.setItem(
        browser_storage.session_storage.library.last_authorized_counts_params,
        JSON.stringify(request_params),
      )
      dispatch(
        counts_actions.get_authorized_counts({
          request_params,
          ky: ky_instance,
        }),
      )
    } else {
      const request_params: Counts_Params.Public = {
        username,
      }

      const query_tags = search_params.get('t')
      set_last_query_tags(query_tags || undefined)
      if (query_tags) {
        request_params.tags = query_tags.split(',')
      }

      const query_filter = search_params.get('f')
      set_last_query_filter(query_filter || undefined)
      if (query_filter) {
        request_params.starred_only =
          Object.values(Filter)[parseInt(query_filter)] == Filter.STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.STARRED_UNREAD ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNREAD ||
          undefined

        request_params.is_archived =
          Object.values(Filter)[parseInt(query_filter)] == Filter.ARCHIVED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_UNREAD ||
          Object.values(Filter)[parseInt(query_filter)] ==
            Filter.ARCHIVED_STARRED_UNREAD ||
          undefined
      }

      dispatch(
        counts_actions.get_public_counts({
          request_params,
          ky: ky_instance,
        }),
      )
    }
  }

  useEffect(() => {
    const tags = sessionStorage.getItem(
      browser_storage.session_storage.library.tags({
        username,
        search_params: search_params.toString(),
      }),
    )

    if (tags) {
      dispatch(counts_actions.set_tags(JSON.parse(tags)))
    }

    const query_tags = search_params.get('t')
    const query_filter = search_params.get('f')
    const query_refresh_trigger = search_params.get('r') // Set after bookmark creation.
    if (
      query_tags != last_query_tags ||
      query_filter != last_query_filter ||
      query_refresh_trigger != last_query_refresh_trigger
    ) {
      get_counts()
    }

    const query_yyyymm_gte = search_params.get('gte')
    const query_yyyymm_lte = search_params.get('lte')

    if (
      query_yyyymm_gte != last_query_yyyymm_gte ||
      query_yyyymm_lte != last_query_yyyymm_lte
    ) {
      set_last_query_yyyymm_gte(query_yyyymm_gte || undefined)
      set_last_query_yyyymm_lte(query_yyyymm_lte || undefined)
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
  }, [search_params])

  useEffect(() => {
    const query_tags = search_params.get('t')
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
        browser_storage.session_storage.library.tags({
          username,
          search_params: search_params.toString(),
        }),
        JSON.stringify(tags),
      )
    }
  }, [counts_data, tags])

  useEffect(() => {
    const tags = sessionStorage.getItem(
      browser_storage.session_storage.library.tags({
        username,
        search_params: search_params.toString(),
      }),
    )

    if (tags) {
      dispatch(counts_actions.set_tags(JSON.parse(tags)))
    }

    get_counts()
  }, [])

  return {
    get_counts,
    months,
    is_fetching,
    tags,
    selected_tags,
  }
}
