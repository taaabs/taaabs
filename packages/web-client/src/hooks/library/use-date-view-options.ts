import { search_params_keys } from '@/constants/search-params-keys'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { update_search_params } from '@/utils/update-query-params'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

export const use_date_view_options = () => {
  const search_params = useSearchParams()
  const params = useParams()
  const [current_gte, set_current_gte] = useState<number | undefined>(
    parseInt(search_params.get(search_params_keys.greater_than_equal) || '0') ||
      undefined,
  )
  const [current_lte, set_current_lte] = useState<number | undefined>(
    parseInt(search_params.get(search_params_keys.less_than_equal) || '0') ||
      undefined,
  )

  useUpdateEffect(() => {
    const query_gte = parseInt(
      search_params.get(search_params_keys.greater_than_equal) || '0',
    )
    const query_lte = parseInt(
      search_params.get(search_params_keys.less_than_equal) || '0',
    )

    if (query_gte != current_gte && query_lte != current_lte) {
      set_current_gte(query_gte || undefined)
      set_current_lte(query_lte || undefined)
    }
  }, [search_params])

  const set_gte_lte_search_params = ({
    gte,
    lte,
  }: {
    gte: number
    lte: number
  }) => {
    set_current_gte(gte)
    set_current_lte(lte)

    let updated_search_params: any
    updated_search_params = update_search_params(
      search_params,
      search_params_keys.greater_than_equal,
      `${gte}`,
    )
    updated_search_params = update_search_params(
      updated_search_params,
      search_params_keys.less_than_equal,
      `${lte}`,
    )

    clear_library_session_storage({
      username: params.username as string,
      search_params: updated_search_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_search_params,
    )
  }

  const clear_gte_lte_search_params = useCallback(() => {
    set_current_gte(undefined)
    set_current_lte(undefined)

    let updated_search_params: any
    updated_search_params = update_search_params(
      search_params,
      search_params_keys.greater_than_equal,
    )
    updated_search_params = update_search_params(
      updated_search_params,
      search_params_keys.less_than_equal,
    )

    clear_library_session_storage({
      username: params.username as string,
      search_params: updated_search_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_search_params,
    )
  }, [search_params])

  return {
    set_gte_lte_search_params,
    clear_gte_lte_search_params,
    current_gte,
    current_lte,
  }
}
