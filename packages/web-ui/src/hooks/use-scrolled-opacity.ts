import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { useState } from 'react'

export const use_scrolled_opacity = () => {
  const on_window_scroll = useWindowScroll()
  const [opacity, set_opacity] = useState(1)
  const [first_scroll_y_down_direction, set_first_scroll_y_down_direction] =
    useState(0)
  const [previous_scroll_y, set_previous_scroll_y] = useState(0)

  on_window_scroll(() => {
    const scroll_y = window.scrollY

    if (document.body.scrollHeight == scroll_y + window.innerHeight) {
      reset()
      return
    }

    set_previous_scroll_y(scroll_y)
    if (scroll_y > previous_scroll_y) {
      const scrolled_down = scroll_y - first_scroll_y_down_direction
      const ratio = scrolled_down / window.innerHeight
      const minimum_opacity = 0.25
      if (1 - ratio > minimum_opacity) {
        set_opacity(1 - ratio)
      } else {
        set_opacity(minimum_opacity)
      }
    } else {
      set_first_scroll_y_down_direction(scroll_y)
      set_opacity(1)
    }
  })

  const reset = () => {
    set_opacity(1)
    set_first_scroll_y_down_direction(0)
    set_previous_scroll_y(0)
  }

  return { opacity, reset }
}
