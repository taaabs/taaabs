import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { useRef, useState } from 'react'

export const use_is_scrolled = () => {
  const on_window_scroll = useWindowScroll()
  const [is_scrolled, set_is_scrolled] = useState(false)
  const first_scroll_y_down_direction = useRef(0)
  const previous_scroll_y = useRef(0)

  on_window_scroll(() => {
    const scroll_y = window.scrollY

    if (document.body.scrollHeight == scroll_y + window.innerHeight) {
      set_is_scrolled(false)
      return
    }

    if (scroll_y > previous_scroll_y.current) {
      if (
        scroll_y - first_scroll_y_down_direction.current >
        window.innerHeight / 2
      ) {
        set_is_scrolled(true)
      }
    } else {
      first_scroll_y_down_direction.current = scroll_y
      set_is_scrolled(false)
    }

    previous_scroll_y.current = scroll_y
  })

  return is_scrolled
}
