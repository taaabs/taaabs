import { update_search_params } from '@/utils/update-query-params'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { Filter } from '@/types/library/filter'
import { search_params_keys } from '@/constants/search-params-keys'

export const use_filter_view_options = () => {
  const search_params = useSearchParams()
  const params = useParams()
  const [current_filter_, set_current_filter_] = useState<Filter>(
    Object.values(Filter)[
      parseInt(
        search_params.get(search_params_keys.filter) ||
          Object.values(Filter).indexOf(Filter.NONE).toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const query_filter = search_params.get(search_params_keys.filter)

    if (
      query_filter != Object.values(Filter).indexOf(current_filter_).toString()
    ) {
      set_current_filter_(
        Object.values(Filter)[
          parseInt(
            query_filter ||
              Object.values(Filter).indexOf(Filter.NONE).toString(),
          )
        ],
      )
    }
  }, [search_params])

  const set_filter_query_param_ = (filter: Filter) => {
    const updated_search_params = update_search_params(
      search_params,
      search_params_keys.filter,
      filter == Filter.NONE
        ? undefined
        : Object.values(Filter).indexOf(filter).toString(),
    )

    clear_library_session_storage({
      username: params.username as string,
      search_params: updated_search_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_search_params,
    )
  }

  const clear_selected_stars_ = () => {
    let updated_search_params: URLSearchParams
    if (current_filter_ == Filter.STARRED_UNSORTED) {
      updated_search_params = update_search_params(
        search_params,
        search_params_keys.filter,
        Object.values(Filter).indexOf(Filter.UNSORTED).toString(),
      )
    } else {
      updated_search_params = update_search_params(
        search_params,
        search_params_keys.filter,
      )
    }

    clear_library_session_storage({
      username: params.username as string,
      search_params: updated_search_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_search_params,
    )
  }

  const clear_unsorted_ = () => {
    let updated_search_params: URLSearchParams
    if (current_filter_ == Filter.STARRED_UNSORTED) {
      updated_search_params = update_search_params(
        search_params,
        search_params_keys.filter,
        Object.values(Filter).indexOf(Filter.STARRED).toString(),
      )
    } else {
      updated_search_params = update_search_params(
        search_params,
        search_params_keys.filter,
      )
    }

    clear_library_session_storage({
      username: params.username as string,
      search_params: updated_search_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_search_params,
    )
  }

  return {
    current_filter_,
    set_filter_query_param_,
    clear_selected_stars_,
    clear_unsorted_,
  }
}
