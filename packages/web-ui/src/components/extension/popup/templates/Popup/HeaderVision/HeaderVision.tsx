import { Icon } from '@web-ui/components/Icon'
import styles from './HeaderVision.module.scss'
import React, { useState, useRef, memo, useEffect } from 'react'
import cn from 'classnames'

export namespace HeaderVision {
  export type Props = {
    back_button_on_click: () => void
    image: string
    translations: {
      title: string
      restore: string
    }
    on_resize: (resized_image: string) => void
  }
}

export const HeaderVision: React.FC<HeaderVision.Props> = memo(
  (props) => {
    const [image, set_image] = useState(props.image)
    const [is_selecting, set_is_selecting] = useState(false)
    const [start_x, set_start_x] = useState(0)
    const [start_y, set_start_y] = useState(0)
    const [preview_rect, set_preview_rect] = useState({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    })
    const image_ref = useRef<HTMLImageElement>(null)
    const container_ref = useRef<HTMLDivElement>(null)

    // Fix for Firefox to prevent image box selection highlight during resizing
    const handle_mouse_enter = () => {
      document.body.style.userSelect = 'none'
    }
    const handle_mouse_leave = () => {
      document.body.style.userSelect = ''
    }

    const handle_mouse_down = (e: React.MouseEvent<HTMLDivElement>) => {
      set_is_selecting(true)
      set_start_x(e.nativeEvent.offsetX)
      set_start_y(e.nativeEvent.offsetY)
    }

    const handle_touch_start = (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault()
      set_is_selecting(true)
      set_start_x(
        e.touches[0].clientX - e.currentTarget.getBoundingClientRect().left,
      )
      set_start_y(
        e.touches[0].clientY - e.currentTarget.getBoundingClientRect().top,
      )
    }

    const handle_interaction_end = async () => {
      set_is_selecting(false)

      if (
        preview_rect.width > 0 &&
        preview_rect.height > 0 &&
        image_ref.current &&
        container_ref.current
      ) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const img = image_ref.current
        const container = container_ref.current

        const container_rect = container.getBoundingClientRect()
        const container_width = container_rect.width
        const container_height = container_rect.height

        const img_width = img.naturalWidth
        const img_height = img.naturalHeight

        const scale_x = container_width / img_width
        const scale_y = container_height / img_height
        const scale = Math.min(scale_x, scale_y)

        const scaled_width = img_width * scale
        const scaled_height = img_height * scale

        const offset_x = (container_width - scaled_width) / 2
        const offset_y = (container_height - scaled_height) / 2

        const adjusted_x = (preview_rect.x - offset_x) / scale
        const adjusted_y = (preview_rect.y - offset_y) / scale
        const adjusted_width = preview_rect.width / scale
        const adjusted_height = preview_rect.height / scale

        // Check if the selected area is outside the image bounds
        if (
          adjusted_x < 0 ||
          adjusted_y < 0 ||
          adjusted_x + adjusted_width > img.naturalWidth ||
          adjusted_y + adjusted_height > img.naturalHeight
        ) {
          // Adjust the selection to fit within the image bounds
          const new_width = Math.min(
            adjusted_width,
            img.naturalWidth - adjusted_x,
          )
          const new_height = Math.min(
            adjusted_height,
            img.naturalHeight - adjusted_y,
          )

          canvas.width = new_width
          canvas.height = new_height

          ctx.drawImage(
            img,
            Math.max(0, adjusted_x),
            Math.max(0, adjusted_y),
            new_width,
            new_height,
            0,
            0,
            new_width,
            new_height,
          )
        } else {
          canvas.width = adjusted_width
          canvas.height = adjusted_height

          ctx.drawImage(
            img,
            adjusted_x,
            adjusted_y,
            adjusted_width,
            adjusted_height,
            0,
            0,
            adjusted_width,
            adjusted_height,
          )
        }

        // Check for minimum size
        const MIN_DIMENSION = 50
        if (
          adjusted_width >= MIN_DIMENSION &&
          adjusted_height >= MIN_DIMENSION
        ) {
          const resized_image = canvas.toDataURL()
          props.on_resize(resized_image)
          set_image(resized_image)
        }
      }

      set_preview_rect({ x: 0, y: 0, width: 0, height: 0 })
    }

    const handle_restore_original = () => {
      props.on_resize(props.image)
      set_image(props.image)
    }

    useEffect(() => {
      const handle_mouse_move = (e: MouseEvent) => {
        if (!is_selecting || !container_ref.current) return

        const container_rect = container_ref.current.getBoundingClientRect()
        const current_x = e.clientX - container_rect.left
        const current_y = e.clientY - container_rect.top

        const x = Math.min(start_x, current_x)
        const y = Math.min(start_y, current_y)
        const width = Math.abs(current_x - start_x)
        const height = Math.abs(current_y - start_y)

        set_preview_rect({ x, y, width, height })
      }

      const handle_touch_move = (e: TouchEvent) => {
        if (!is_selecting || !container_ref.current) return
        e.preventDefault() // Prevent scrolling

        const container_rect = container_ref.current.getBoundingClientRect()
        const current_x = e.touches[0].clientX - container_rect.left
        const current_y = e.touches[0].clientY - container_rect.top

        const x = Math.min(start_x, current_x)
        const y = Math.min(start_y, current_y)
        const width = Math.abs(current_x - start_x)
        const height = Math.abs(current_y - start_y)

        set_preview_rect({ x, y, width, height })
      }

      if (is_selecting) {
        window.addEventListener('mousemove', handle_mouse_move)
        window.addEventListener('touchmove', handle_touch_move, {
          passive: false,
        })
      }

      return () => {
        window.removeEventListener('mousemove', handle_mouse_move)
        window.removeEventListener('touchmove', handle_touch_move)
      }
    }, [is_selecting])

    return (
      <div className={styles.container}>
        <div
          role="button"
          className={styles.back}
          onClick={props.back_button_on_click}
        >
          <Icon variant="LESS_THAN" />
        </div>
        <div className={styles.title}>{props.translations.title}</div>
        <div
          role="button"
          onClick={handle_restore_original}
          className={cn(styles.restore, {
            [styles['restore--active']]: props.image != image,
          })}
          title={props.translations.restore}
        >
          <Icon variant="RESTORE" />
        </div>
        <div
          className={cn(styles.image, {
            [styles['image--selecting']]: is_selecting,
          })}
          onTouchStart={handle_touch_start}
          onTouchEnd={handle_interaction_end}
          onMouseEnter={handle_mouse_enter}
          onMouseLeave={handle_mouse_leave}
          onMouseDown={handle_mouse_down}
          onMouseUp={handle_interaction_end}
          ref={container_ref}
        >
          <img src={image} ref={image_ref} draggable={false} />
          {is_selecting && (
            <div
              style={{
                position: 'absolute',
                left: preview_rect.x,
                top: preview_rect.y,
                width: preview_rect.width,
                height: preview_rect.height,
                backdropFilter: 'brightness(1.5)',
              }}
              className={styles.area}
            />
          )}
        </div>
      </div>
    )
  },
  () => true,
)
