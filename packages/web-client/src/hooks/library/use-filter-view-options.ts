import { update_query_params } from '@/utils/update-query-params'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { Filter } from '@/types/library/filter'

export const use_filter_view_options = () => {
  const query_params = useSearchParams()
  const params = useParams()
  const [current_filter, set_current_filter] = useState<Filter>(
    Object.values(Filter)[
      parseInt(
        query_params.get('f') ||
          Object.values(Filter).indexOf(Filter.None).toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const query_filter = query_params.get('f')

    if (
      query_filter != Object.values(Filter).indexOf(current_filter).toString()
    ) {
      set_current_filter(
        Object.values(Filter)[
          parseInt(
            query_filter ||
              Object.values(Filter).indexOf(Filter.None).toString(),
          )
        ],
      )
    }
  }, [query_params])

  const set_filter_query_param = (filter: Filter) => {
    const updated_query_params = update_query_params(
      query_params,
      'f',
      filter == Filter.None
        ? undefined
        : Object.values(Filter).indexOf(filter).toString(),
    )

    clear_library_session_storage({
      username: params.username as string,
      query_parms: updated_query_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const clear_selected_stars = () => {
    let updated_query_params: URLSearchParams
    if (current_filter == Filter.StarredUnread) {
      updated_query_params = update_query_params(
        query_params,
        'f',
        Object.values(Filter).indexOf(Filter.Unread).toString(),
      )
    } else {
      updated_query_params = update_query_params(query_params, 'f')
    }

    clear_library_session_storage({
      username: params.username as string,
      query_parms: updated_query_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const clear_unread = () => {
    let updated_query_params: URLSearchParams
    if (current_filter == Filter.StarredUnread) {
      updated_query_params = update_query_params(
        query_params,
        'f',
        Object.values(Filter).indexOf(Filter.Starred).toString(),
      )
    } else {
      updated_query_params = update_query_params(query_params, 'f')
    }

    clear_library_session_storage({
      username: params.username as string,
      query_parms: updated_query_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return {
    current_filter,
    set_filter_query_param,
    clear_selected_stars,
    clear_unread,
  }
}
