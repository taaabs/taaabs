import { updateSearchParam } from '@/utils/update-query-param'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useShallowSearchParams } from '@web-ui/hooks/use-shallow-search-params'

export const useOrderByViewOptions = () => {
  const queryParams = useShallowSearchParams()
  const [currentOrderBy, setCurrentOrderBy] = useState<OrderBy>(
    Object.values(OrderBy)[
      parseInt(
        queryParams.get('s') ||
          Object.values(OrderBy)
            .indexOf(BookmarksFetchingDefaults.Common.orderBy)
            .toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const queryOrderBy = queryParams.get('o')

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
    const updatedQueryParams = updateSearchParam(
      queryParams,
      'o',
      orderBy == BookmarksFetchingDefaults.Common.orderBy
        ? undefined
        : Object.values(OrderBy).indexOf(orderBy).toString(),
    )

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

  return { currentOrderBy, setOrderByQueryParam }
}
