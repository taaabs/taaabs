import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { RefObject, useEffect, useState } from 'react'

export const use_scroll_restore = (
  main_inner_ref: RefObject<HTMLDivElement>,
) => {
  const [scroll_y, set_scroll_y] = useState(0)
  const on_window_scroll = useWindowScroll()
  const query_params = use_shallow_search_params()

  const on_scroll_y = useDebouncedCallback(
    (scrollY: number, queryParams: URLSearchParams) => {
      sessionStorage.setItem(
        `scroll_y__${queryParams.toString()}`,
        scrollY.toString(),
      )
    },
    [],
    100,
  )

  useUpdateEffect(() => {
    on_scroll_y(scroll_y, query_params)
  }, [scroll_y, query_params])

  on_window_scroll(() => {
    set_scroll_y(window.scrollY)
  })

  useEffect(() => {
    const scroll_y = sessionStorage.getItem(
      `scroll_y__${query_params.toString()}`,
    )
    if (scroll_y) {
      // Ensures triggering scroll position change in a first idle frame.
      setTimeout(() => {
        const y = parseInt(scroll_y)
        main_inner_ref.current?.scrollTo(0, y)
        window.scrollTo(0, y)
      }, 0)
    }
  }, [])

  useEffect(() => {
    const listener = () => {
      const scroll_top = main_inner_ref.current?.scrollTop
      if (scroll_top != undefined) {
        set_scroll_y(scroll_top)
      }
    }
    main_inner_ref.current?.addEventListener('scroll', listener)

    return () => {
      for (const key in sessionStorage) {
        if (key.substring(0, 8) == 'scroll_y') {
          sessionStorage.removeItem(key)
        }
      }
      main_inner_ref.current?.removeEventListener('scroll', listener)
    }
  }, [])
}
