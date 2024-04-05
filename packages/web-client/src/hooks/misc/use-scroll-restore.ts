import { browser_storage } from '@/constants/browser-storage'
import { use_is_hydrated } from '@shared/hooks'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// Browser could offload site from memory, so immediate back navigation will no longer be possible.
// In such case scroll must be restored manually.
export const use_scroll_restore = () => {
  const on_window_scroll = useWindowScroll()
  const is_hydrated = use_is_hydrated()
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()

  const on_scroll_y = useDebouncedCallback(
    (scrollY: number, username?: string) => {
      const search_params = new URLSearchParams(window.location.search)
      sessionStorage.setItem(
        browser_storage.session_storage.library.scroll_y({
          search_params: search_params.toString(),
          username,
          hash: window.location.hash,
        }),
        scrollY.toString(),
      )
    },
    [],
    100,
  )

  on_window_scroll(() => {
    on_scroll_y(window.scrollY, username)
  })

  useEffect(() => {
    const handleEvent = () => {
      const params = new URLSearchParams(window.location.search)
      const scroll_y = sessionStorage.getItem(
        browser_storage.session_storage.library.scroll_y({
          search_params: params.toString(),
          username,
          hash: window.location.hash,
        }),
      )
      if (scroll_y && window.scrollY != parseInt(scroll_y)) {
        window.scrollTo(0, parseInt(scroll_y))
      }
    }
    window.addEventListener('popstate', handleEvent)
    return () => window.removeEventListener('popstate', handleEvent)
  }, [])

  useUpdateEffect(() => {
    const scroll_y = sessionStorage.getItem(
      browser_storage.session_storage.library.scroll_y({
        search_params: search_params.toString(),
        username,
        hash: window.location.hash,
      }),
    )
    if (scroll_y) {
      window.scrollTo(0, parseInt(scroll_y))
    }
  }, [is_hydrated])
}
