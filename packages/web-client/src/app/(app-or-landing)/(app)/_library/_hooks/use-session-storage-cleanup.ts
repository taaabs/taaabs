import { useParams, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const HISTORY_LIMIT = 10

// Purpose of this hook is to avoid hitting storage limits
export const use_session_storage_cleanup = () => {
  const search_params_hook = useSearchParams()
  const params_hook = useParams()

  useEffect(() => {
    const search_params_history: string[] = JSON.parse(
      sessionStorage.getItem('query-params-history') || '[]',
    )

    // Remove old entries after reaching history limit
    if (search_params_history.length == HISTORY_LIMIT) {
      const oldest_search_params = search_params_history[0]
      // We must be sure last page in history wasn't visited sooner
      if (
        search_params_history.filter(
          (search_params) => search_params == oldest_search_params,
        ).length == 1
      ) {
        for (const key in sessionStorage) {
          if (key.endsWith(oldest_search_params)) {
            sessionStorage.removeItem(key)
          }
        }
      }
      search_params_history.shift()
    }

    // Add new entry
    sessionStorage.setItem(
      'query-params-history',
      JSON.stringify([
        ...search_params_history.filter(
          (entry) => entry != search_params_hook.toString(),
        ),
        `${params_hook.username || ''}?${search_params_hook.toString()}${
          window.location.hash
        }`,
      ]),
    )
  }, [search_params_hook])
}
