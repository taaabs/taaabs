import { browser_storage } from '@/constants/browser-storage'
import { use_is_hydrated } from '@shared/hooks'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { useEffect, useState } from 'react'

export const use_scroll_restore = () => {
  const [scroll_y, set_scroll_y] = useState(0)
  const on_window_scroll = useWindowScroll()
  const is_hydrated = use_is_hydrated()

  const on_scroll_y = useDebouncedCallback(
    (scrollY: number) => {
      sessionStorage.setItem(
        browser_storage.session_storage.library.scroll_y,
        scrollY.toString(),
      )
    },
    [],
    100,
  )

  useUpdateEffect(() => {
    on_scroll_y(scroll_y)
  }, [scroll_y])

  on_window_scroll(() => {
    set_scroll_y(window.scrollY)
  })

  useUpdateEffect(() => {
    const scroll_y = sessionStorage.getItem(
      browser_storage.session_storage.library.scroll_y,
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
      sessionStorage.removeItem(
        browser_storage.session_storage.library.scroll_y,
      )
      window.removeEventListener('scroll', listener)
    }
  }, [])
}
