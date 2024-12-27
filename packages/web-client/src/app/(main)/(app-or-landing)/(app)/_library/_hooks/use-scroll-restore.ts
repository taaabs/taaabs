import { browser_storage } from '@/constants/browser-storage'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export const use_scroll_restore = () => {
  const on_window_scroll = useWindowScroll()
  const { username }: { username?: string } = useParams()
  const search_params = useSearchParams()
  const [initial_scroll_y, set_initial_scroll_y] = useState<number>()

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
    const scroll_y = sessionStorage.getItem(
      browser_storage.session_storage.library.scroll_y({
        search_params: search_params.toString(),
        username,
        hash: window.location.hash,
      }),
    )
    if (scroll_y) {
      set_initial_scroll_y(parseInt(scroll_y))
    }
  }, [])

  useEffect(() => {
    const handle_popstate = () => {
      const scroll_y = sessionStorage.getItem(
        browser_storage.session_storage.library.scroll_y({
          search_params: search_params.toString(),
          username,
          hash: window.location.hash,
        }),
      )
      if (scroll_y) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(scroll_y))
        })
      }
    }
    window.addEventListener('popstate', handle_popstate)
    return () => window.removeEventListener('popstate', handle_popstate)
  }, [])

  return { initial_scroll_y }
}
