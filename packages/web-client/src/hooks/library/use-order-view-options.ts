import { updateSearchParam } from '@/utils/update-query-param'
import { Order } from '@shared/types/modules/bookmarks/order'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useShallowSearchParams } from '@/hooks/use-push-state-listener'

export const useOrderViewOptions = () => {
  const queryParams = useShallowSearchParams()
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

  const setOrderQueryParam = (order: Order) => {
    const updatedQueryParams = updateSearchParam(
      queryParams,
      'o',
      Object.values(Order).indexOf(order).toString(),
    )

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

  return { currentOrder, setOrderQueryParam }
}