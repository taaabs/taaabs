import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { updateQueryParam } from '@/utils/update-query-param'
import { Order } from '@shared/types/modules/bookmarks/order'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'

export const useOrderOptions = ({ initOrderBy }: { initOrderBy: OrderBy }) => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const [orderBy, setOrderBy] = useState<OrderBy>(initOrderBy)

  useUpdateEffect(() => {
    let updatedQueryParams: any
    updatedQueryParams = updateQueryParam(
      queryParams,
      'b',
      Object.values(OrderBy).indexOf(orderBy).toString(),
    )
    if (queryParams.get('s')) {
      updatedQueryParams = updateQueryParam(updatedQueryParams, 's', '')
    }
    if (queryParams.get('e')) {
      updatedQueryParams = updateQueryParam(updatedQueryParams, 'e', '')
    }
    if (queryParams.get('gte')) {
      updatedQueryParams = updateQueryParam(updatedQueryParams, 'gte', '')
    }
    if (queryParams.get('lte')) {
      updatedQueryParams = updateQueryParam(updatedQueryParams, 'lte', '')
    }
    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
  }, [orderBy])

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

  return { orderBy, setOrderBy, setOrderQueryParam }
}
