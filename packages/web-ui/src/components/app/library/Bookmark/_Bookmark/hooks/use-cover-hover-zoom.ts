import { useRef, useState } from 'react'

export const use_cover_hover_zoom = () => {
  const container_ref = useRef<any | null>(null)
  const image_ref = useRef<any | null>(null)
  const last_position = useRef<string>()
  const [is_enabled, set_enabled] = useState(false)

  const handle_mouse_enter = () => {}

  const handle_mouse_leave = () => {
    set_enabled(false)
    last_position.current = ''
  }

  const handle_cover_mouse_move = (e: React.MouseEvent<HTMLDivElement>) => {
    last_position.current = `${e.clientX}${e.clientY}`
    if (!is_enabled) {
      setTimeout(() => {
        if (last_position.current == `${e.clientX}${e.clientY}`) {
          set_enabled(true)
        }
      }, 100)
    }
    const cover_container_rect = container_ref.current.getBoundingClientRect()
    const x = e.clientX - cover_container_rect.left
    const y = e.clientY - cover_container_rect.top

    let x_offset = -(x - cover_container_rect.width / 2)
    let y_offset = -(y - cover_container_rect.height / 2)

    if (Math.abs(x_offset) > 38) {
      x_offset > 0 ? (x_offset = 38) : (x_offset = -38)
    }
    if (Math.abs(y_offset) > 20) {
      y_offset > 0 ? (y_offset = 20) : (y_offset = -20)
    }

    image_ref.current.style.setProperty('--x', `${x_offset.toFixed(1)}px`)
    image_ref.current.style.setProperty('--y', `${y_offset.toFixed(1)}px`)
  }

  return {
    container_ref,
    image_ref,
    is_enabled,
    handle_mouse_enter,
    handle_mouse_leave,
    handle_cover_mouse_move,
  }
}
