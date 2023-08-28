import { updateSearchParam } from '@/utils/update-query-param'
import { useShallowSearchParams } from '../use-push-state-listener'

export const useDateViewOptions = () => {
  const queryParams = useShallowSearchParams()

  const setGteLteQueryParams = ({ gte, lte }: { gte: number; lte: number }) => {
    let updatedQueryParams: any
    updatedQueryParams = updateSearchParam(queryParams, 'gte', `${gte}`)
    updatedQueryParams = updateSearchParam(updatedQueryParams, 'lte', `${lte}`)

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

  const clearGteLteQueryParams = () => {
    let updatedQueryParams: any
    updatedQueryParams = updateSearchParam(queryParams, 'gte')
    updatedQueryParams = updateSearchParam(updatedQueryParams, 'lte')

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

  return { setGteLteQueryParams, clearGteLteQueryParams }
}
