import { updateSearchParam } from '@/utils/update-query-param'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'

export const use_date_view_options = () => {
  const query_params = use_shallow_search_params()

  const set_gte_lte_query_params = ({
    gte,
    lte,
  }: {
    gte: number
    lte: number
  }) => {
    let updated_query_params: any
    updated_query_params = updateSearchParam(query_params, 'gte', `${gte}`)
    updated_query_params = updateSearchParam(
      updated_query_params,
      'lte',
      `${lte}`,
    )

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  const clear_gte_lte_query_params = () => {
    let updated_query_params: any
    updated_query_params = updateSearchParam(query_params, 'gte')
    updated_query_params = updateSearchParam(updated_query_params, 'lte')

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return { set_gte_lte_query_params, clear_gte_lte_query_params }
}
