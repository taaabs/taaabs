import { updateSearchParam } from '@/utils/update-query-param'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'

export const useDateViewOptions = () => {
  const queryParams = use_shallow_search_params()

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
