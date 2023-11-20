import { useEffect, useState } from 'react'

export const use_shallow_search_params = () => {
  const [search_params, set_search_params] = useState(
    new URLSearchParams(
      window !== undefined
        ? new URLSearchParams(window.location.search)
        : undefined,
    ),
  )

  const listen_to_popstate = () => {
    location.reload()
  }

  useEffect(() => {
    const original_push_state = history.pushState

    history.pushState = function (data, title, url) {
      original_push_state.apply(history, [data, title, url])
      if (typeof url == 'string') {
        set_search_params(new URLSearchParams(url.split('?')[1]))
      }
    }

    window.addEventListener('popstate', listen_to_popstate)

    return () => {
      history.pushState = original_push_state
      window.removeEventListener('popstate', listen_to_popstate)
    }
  }, [])

  return search_params
}
