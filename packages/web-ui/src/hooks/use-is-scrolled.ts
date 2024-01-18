import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { useState } from 'react'

export const use_is_scrolled = () => {
  const on_window_scroll = useWindowScroll()
  const [is_scrolled, set_is_scrolled] = useState(false)
  const [first_scroll_y_down_direction, set_first_scroll_y_down_direction] =
    useState(0)
  const [previous_scroll_y, set_previous_scroll_y] = useState(0)

  on_window_scroll(() => {
    const scroll_y = window.scrollY

    if (document.body.scrollHeight == scroll_y + window.innerHeight) {
      set_is_scrolled(false)
      return
    }

    set_previous_scroll_y(scroll_y)
    if (scroll_y > previous_scroll_y) {
      if (scroll_y - first_scroll_y_down_direction > window.innerHeight) {
        set_is_scrolled(true)
      }
    } else {
      set_first_scroll_y_down_direction(scroll_y)
      set_is_scrolled(false)
    }
  })

  return is_scrolled
}
