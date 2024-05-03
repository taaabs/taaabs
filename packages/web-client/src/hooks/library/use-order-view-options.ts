import { update_search_params } from '@/utils/update-query-params'
import { Order } from '@shared/types/modules/bookmarks/order'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useSearchParams } from 'next/navigation'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { search_params_keys } from '@/constants/search-params-keys'

export const use_order_view_options = () => {
  const search_params = useSearchParams()
  const params = useParams()
  const [current_order_, set_current_order] = useState<Order>(
    Object.values(Order)[
      parseInt(
        search_params.get(search_params_keys.order) ||
          Object.values(Order)
            .indexOf(BookmarksFetchingDefaults.Common.order)
            .toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const query_order = search_params.get(search_params_keys.order)

    if (
      query_order != Object.values(Order).indexOf(current_order_).toString()
    ) {
      set_current_order(
        Object.values(Order)[
          parseInt(
            query_order ||
              Object.values(Order)
                .indexOf(BookmarksFetchingDefaults.Common.order)
                .toString(),
          )
        ],
      )
    }
  }, [search_params])

  const set_order_query_param_ = (order: Order) => {
    const updated_search_params = update_search_params(
      search_params,
      search_params_keys.order,
      order == BookmarksFetchingDefaults.Common.order
        ? undefined
        : Object.values(Order).indexOf(order).toString(),
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

  return { current_order_, set_order_query_param_ }
}
