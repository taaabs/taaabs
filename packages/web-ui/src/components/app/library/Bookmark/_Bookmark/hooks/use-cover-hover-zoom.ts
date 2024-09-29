import { useRef, useState } from 'react'

export const use_cover_hover_zoom = () => {
  const cover_ref = useRef<any | null>(null)
  const [is_enabled, set_enabled] = useState(false)
  let hover_timeout: NodeJS.Timeout | null = null

  const handle_mouse_enter = () => {
    hover_timeout = setTimeout(() => {
      set_enabled(true)
    }, 300)
  }

  const handle_mouse_leave = () => {
    set_enabled(false)
    if (hover_timeout) {
      clearTimeout(hover_timeout)
    }
  }
  const handle_cover_mouse_move = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cover_ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left // x position within the element
    const y = e.clientY - rect.top // y position within the element

    // Calculate the image's position based on the cursor's position
    const x_offset = -(x - rect.width / 2) / 2 // Divide by 2 to reduce sensitivity and invert the offset
    const y_offset = -(y - rect.height / 2) / 2 // Divide by 2 to reduce sensitivity and invert the offset

    // Set the image's position in pixels
    cover_ref.current.style.setProperty('--x', `${x_offset}px`)
    cover_ref.current.style.setProperty('--y', `${y_offset}px`)
  }

  return {
    cover_ref,
    is_enabled,
    handle_mouse_enter,
    handle_mouse_leave,
    handle_cover_mouse_move,
  }
}
