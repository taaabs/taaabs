import { useEffect } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'

const HISTORY_LIMIT = 5

// Purpose of this hook is avoiding hitting storage limits.
export const use_session_storage_cleanup = () => {
  const query_params = use_shallow_search_params()

  useUpdateEffect(() => {
    const query_params_history: string[] = JSON.parse(
      sessionStorage.getItem('query_params_history') || '[""]',
    )

    if (query_params_history.length == HISTORY_LIMIT) {
      const oldest_query_params = query_params_history[0]
      for (const key in sessionStorage) {
        if (key.endsWith(`__${oldest_query_params}`)) {
          sessionStorage.removeItem(key)
        }
      }
      query_params_history.shift()
    }

    sessionStorage.setItem(
      'query_params_history',
      JSON.stringify([...query_params_history, query_params.toString()]),
    )
  }, [query_params])

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('query_params_history')
    }
  }, [])
}
