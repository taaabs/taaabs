import { update_query_params } from '@/utils/update-query-params'
import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

export const use_date_view_options = () => {
  const query_params = useSearchParams()
  const [current_gte, set_current_gte] = useState<number | undefined>(
    parseInt(query_params.get('gte') || '0') || undefined,
  )
  const [current_lte, set_current_lte] = useState<number | undefined>(
    parseInt(query_params.get('lte') || '0') || undefined,
  )

  const set_gte_lte_query_params = ({
    gte,
    lte,
  }: {
    gte: number
    lte: number
  }) => {
    set_current_gte(gte)
    set_current_lte(lte)

    let updated_query_params: any
    updated_query_params = update_query_params(query_params, 'gte', `${gte}`)
    updated_query_params = update_query_params(
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

  const clear_gte_lte_query_params = useCallback(() => {
    set_current_gte(undefined)
    set_current_lte(undefined)

    let updated_query_params: any
    updated_query_params = update_query_params(query_params, 'gte')
    updated_query_params = update_query_params(updated_query_params, 'lte')

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }, [query_params])

  return {
    set_gte_lte_query_params,
    clear_gte_lte_query_params,
    current_gte,
    current_lte,
  }
}
