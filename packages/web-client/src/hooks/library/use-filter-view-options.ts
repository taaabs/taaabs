import { update_query_params } from '@/utils/update-query-params'
import { Filter } from '@shared/types/common/filter'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export const use_filter_view_options = () => {
  const query_params = useSearchParams()
  const [current_filter, set_current_filter] = useState<Filter>(
    Object.values(Filter)[
      parseInt(
        query_params.get('f') ||
          Object.values(Filter)
            .indexOf(BookmarksFetchingDefaults.Common.filter)
            .toString(),
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
              Object.values(Filter)
                .indexOf(BookmarksFetchingDefaults.Common.filter)
                .toString(),
          )
        ],
      )
    }
  }, [query_params])

  const set_filter_query_param = (filter: Filter) => {
    const updated_query_params = update_query_params(
      query_params,
      'f',
      filter == BookmarksFetchingDefaults.Common.filter
        ? undefined
        : Object.values(Filter).indexOf(filter).toString(),
    )

    for (const key in sessionStorage) {
      if (key.endsWith(`__${updated_query_params}`)) {
        sessionStorage.removeItem(key)
      }
    }

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const set_filter_query_param_and_clear_others = (filter: Filter) => {
    const updated_query_params = update_query_params(
      new URLSearchParams(),
      'f',
      filter == BookmarksFetchingDefaults.Common.filter
        ? undefined
        : Object.values(Filter).indexOf(filter).toString(),
    )

    for (const key in sessionStorage) {
      if (key.endsWith(`__${updated_query_params}`)) {
        sessionStorage.removeItem(key)
      }
    }

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

    for (const key in sessionStorage) {
      if (key.endsWith(`__${updated_query_params}`)) {
        sessionStorage.removeItem(key)
      }
    }

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

    for (const key in sessionStorage) {
      if (key.endsWith(`__${updated_query_params}`)) {
        sessionStorage.removeItem(key)
      }
    }

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return {
    current_filter,
    set_filter_query_param,
    set_filter_query_param_and_clear_others,
    clear_selected_stars,
    clear_unread,
  }
}
