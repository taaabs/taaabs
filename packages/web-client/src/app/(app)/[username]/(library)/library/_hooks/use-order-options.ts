import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { updateQueryParam } from '@/utils/update-query-param'
import { Order } from '@shared/types/modules/bookmarks/order'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'

export const useOrderOptions = () => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()

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

  return { setOrderByQueryParam, setOrderQueryParam }
}
