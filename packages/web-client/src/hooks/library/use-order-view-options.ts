import { updateSearchParam } from '@/utils/update-query-param'
import { Order } from '@shared/types/modules/bookmarks/order'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'

export const use_order_view_options = () => {
  const query_params = use_shallow_search_params()
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

  const set_order_query_param = (orderBy: Order) => {
    const updated_query_params = updateSearchParam(
      query_params,
      'o',
      orderBy == BookmarksFetchingDefaults.Common.order
        ? undefined
        : Object.values(Order).indexOf(orderBy).toString(),
    )

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return { current_order, set_order_query_param }
}
