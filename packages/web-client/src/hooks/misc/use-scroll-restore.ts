import { browser_storage } from '@/constants/browser-storage'
import { use_is_hydrated } from '@shared/hooks'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Browser can offload site from memory, so immediate back navigation won't be possible.
// In such case scroll must be restored manually.
export const use_scroll_restore = () => {
  const [scroll_y, set_scroll_y] = useState(0)
  const on_window_scroll = useWindowScroll()
  const is_hydrated = use_is_hydrated()
  const query_params = useSearchParams()
  const { username }: { username?: string } = useParams()

  const on_scroll_y = useDebouncedCallback(
    (scrollY: number, query_params: string, username?: string) => {
      sessionStorage.setItem(
        browser_storage.session_storage.library.scroll_y({
          query_params,
          username,
        }),
        scrollY.toString(),
      )
    },
    [],
    100,
  )

  useUpdateEffect(() => {
    on_scroll_y(scroll_y, query_params.toString(), username)
  }, [scroll_y])

  on_window_scroll(() => {
    set_scroll_y(window.scrollY)
  })

  useUpdateEffect(() => {
    const scroll_y = sessionStorage.getItem(
      browser_storage.session_storage.library.scroll_y({
        query_params: query_params.toString(),
        username,
      }),
    )
    if (scroll_y && window.scrollY != parseInt(scroll_y)) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scroll_y))
      }, 0)
    }
  }, [query_params])

  useUpdateEffect(() => {
    const scroll_y = sessionStorage.getItem(
      browser_storage.session_storage.library.scroll_y({
        query_params: query_params.toString(),
        username,
      }),
    )
    if (scroll_y) {
      window.scrollTo(0, parseInt(scroll_y))
    }
  }, [is_hydrated])

  useEffect(() => {
    const listener = () => {
      set_scroll_y(window.scrollY)
    }
    window.addEventListener('scroll', listener)

    return () => {
      window.removeEventListener('scroll', listener)
    }
  }, [])
}