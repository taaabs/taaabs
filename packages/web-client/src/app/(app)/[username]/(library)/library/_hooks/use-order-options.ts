import { updateSearchParam } from '@/utils/update-query-param'
import { Order } from '@shared/types/modules/bookmarks/order'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useShallowSearchParams } from '@/hooks/use-push-state-listener'

export const useOrderOptions = () => {
  const queryParams = useShallowSearchParams()
  const [currentOrderBy, setCurrentOrderBy] = useState<OrderBy>(
    Object.values(OrderBy)[
      parseInt(
        queryParams.get('b') ||
          Object.values(OrderBy)
            .indexOf(BookmarksFetchingDefaults.Common.orderBy)
            .toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const queryOrderBy = queryParams.get('b')

    if (
      queryOrderBy != Object.values(OrderBy).indexOf(currentOrderBy).toString()
    ) {
      setCurrentOrderBy(
        Object.values(OrderBy)[
          parseInt(
            queryOrderBy ||
              Object.values(OrderBy)
                .indexOf(BookmarksFetchingDefaults.Common.orderBy)
                .toString(),
          )
        ],
      )
    }
  }, [queryParams])

  const setOrderByQueryParam = (orderBy: OrderBy) => {
    let updatedQueryParams: any
    updatedQueryParams = updateSearchParam(
      queryParams,
      'b',
      Object.values(OrderBy).indexOf(orderBy).toString(),
    )

    if (queryParams.get('gte')) {
      updatedQueryParams = updateSearchParam(updatedQueryParams, 'gte', '')
    }

    if (queryParams.get('lte')) {
      updatedQueryParams = updateSearchParam(updatedQueryParams, 'lte', '')
    }

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

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

  return { currentOrderBy, setOrderByQueryParam, setOrderQueryParam }
}
