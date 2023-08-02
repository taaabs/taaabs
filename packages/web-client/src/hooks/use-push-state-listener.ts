import { useEffect, useState } from 'react'

export const useShallowSearchParams = () => {
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(new URLSearchParams(window.location.search)),
  )

  const listenToPopstate = () => {
    location.reload()
  }

  useEffect(() => {
    const originalPushState = history.pushState

    history.pushState = function (data, title, url) {
      originalPushState.apply(history, [data, title, url])
      if (typeof url == 'string') {
        setSearchParams(new URLSearchParams(url.split('?')[1]))
      }
    }

    window.addEventListener('popstate', listenToPopstate)

    return () => {
      history.pushState = originalPushState
      window.removeEventListener('popstate', listenToPopstate)
    }
  }, [])

  return searchParams
}
