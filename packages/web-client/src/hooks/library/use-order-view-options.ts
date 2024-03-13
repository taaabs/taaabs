import { update_query_params } from '@/utils/update-query-params'
import { Order } from '@shared/types/modules/bookmarks/order'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useSearchParams } from 'next/navigation'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'

export const use_order_view_options = () => {
  const query_params = useSearchParams()
  const params = useParams()
  const [current_order, set_current_order] = useState<Order>(
    Object.values(Order)[
      parseInt(
        query_params.get('o') ||
          Object.values(Order)
            .indexOf(BookmarksFetchingDefaults.Common.order)
            .toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const query_order = query_params.get('o')

    if (query_order != Object.values(Order).indexOf(current_order).toString()) {
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
  }, [query_params])

  const set_order_query_param = (order: Order) => {
    const updated_query_params = update_query_params(
      query_params,
      'o',
      order == BookmarksFetchingDefaults.Common.order
        ? undefined
        : Object.values(Order).indexOf(order).toString(),
    )

    clear_library_session_storage({
      username: params.username as string,
      query_params: updated_query_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return { current_order, set_order_query_param }
}
