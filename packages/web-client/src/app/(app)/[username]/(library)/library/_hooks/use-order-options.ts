import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { updateQueryParam } from '@/utils/update-query-param'
import { Order } from '@shared/types/modules/bookmarks/order'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'

export const useOrderOptions = ({
  initOrderBy,
  initOrder,
}: {
  initOrderBy: OrderBy
  initOrder: Order
}) => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const [orderBy, setOrderBy] = useState<OrderBy>(initOrderBy)
  const [order, setOrder] = useState<Order>(initOrder)

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

    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
  }, [orderBy])

  useUpdateEffect(() => {
    const updatedQueryParams = updateQueryParam(
      queryParams,
      'o',
      Object.values(Order).indexOf(order).toString(),
    )

    router.push(`/${params.username}/library?${updatedQueryParams}`, {
      scroll: false,
    })
  }, [order])

  return { orderBy, setOrderBy, order, setOrder }
}
