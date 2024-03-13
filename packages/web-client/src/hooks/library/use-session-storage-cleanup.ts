import { useParams, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const HISTORY_LIMIT = 10

// Purpose of this hook is to avoid hitting storage limits.
export const use_session_storage_cleanup = () => {
  const query_params_hook = useSearchParams()
  const params_hook = useParams()

  useEffect(() => {
    const query_params_history: string[] = JSON.parse(
      sessionStorage.getItem('query-params-history') || '[]',
    )

    // Remove old entries after reaching history limit.
    if (query_params_history.length == HISTORY_LIMIT) {
      const oldest_query_params = query_params_history[0]
      // We must be sure last page in history wasn't visited sooner.
      if (
        query_params_history.filter(
          (query_params) => query_params == oldest_query_params,
        ).length == 1
      ) {
        for (const key in sessionStorage) {
          if (key.endsWith(oldest_query_params)) {
            sessionStorage.removeItem(key)
          }
        }
      }
      query_params_history.shift()
    }

    // Add new entry.
    sessionStorage.setItem(
      'query-params-history',
      JSON.stringify([
        ...query_params_history.filter(
          (entry) => entry != query_params_hook.toString(),
        ),
        `${params_hook.username || ''}?${query_params_hook.toString()}`,
      ]),
    )
  }, [query_params_hook])
}
