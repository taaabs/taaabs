import { updateSearchParam } from '@/utils/update-query-param'
import { Order } from '@shared/types/modules/bookmarks/order'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'

export const useOrderViewOptions = () => {
  const queryParams = use_shallow_search_params()
  const [currentOrder, setCurrentOrder] = useState<Order>(
    Object.values(Order)[
      parseInt(
        queryParams.get('o') ||
          Object.values(Order)
            .indexOf(BookmarksFetchingDefaults.Common.order)
            .toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const queryOrder = queryParams.get('o')

    if (queryOrder != Object.values(Order).indexOf(currentOrder).toString()) {
      setCurrentOrder(
        Object.values(Order)[
          parseInt(
            queryOrder ||
              Object.values(Order)
                .indexOf(BookmarksFetchingDefaults.Common.order)
                .toString(),
          )
        ],
      )
    }
  }, [queryParams])

  const setOrderQueryParam = (orderBy: Order) => {
    const updatedQueryParams = updateSearchParam(
      queryParams,
      'o',
      orderBy == BookmarksFetchingDefaults.Common.order
        ? undefined
        : Object.values(Order).indexOf(orderBy).toString(),
    )

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

  return { currentOrder, setOrderQueryParam }
}
