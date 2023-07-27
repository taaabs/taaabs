import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { updateQueryParam } from '@/utils/update-query-param'
import { Order } from '@shared/types/modules/bookmarks/order'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useEffect, useState } from 'react'

export const useOrderOptions = () => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
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

  useEffect(() => {
    const queryOrderBy = queryParams.get('b')

    if (
      queryOrderBy &&
      Object.values(OrderBy)[parseInt(queryOrderBy)] != currentOrderBy
    ) {
      setCurrentOrderBy(Object.values(OrderBy)[parseInt(queryOrderBy)])
    }
  }, [queryParams])

  const setOrderByQueryParam = (orderBy: OrderBy) => {
    const updatedQueryParam = updateQueryParam(
      queryParams,
      'b',
      Object.values(OrderBy).indexOf(orderBy).toString(),
    )

    router.push(`/${params.username}/library?${updatedQueryParam}`, {
      scroll: false,
    })
  }

  const setOrderQueryParam = (order: Order) => {
    const updatedQueryParams = updateQueryParam(
      queryParams,
      'o',
      Object.values(Order).indexOf(order).toString(),
    )

    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
  }

  return { currentOrderBy, setOrderByQueryParam, setOrderQueryParam }
}
