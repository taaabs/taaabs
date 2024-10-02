import { Icon } from '@web-ui/components/Icon'
import styles from './HeaderVision.module.scss'
import React, { useState, useRef, useCallback, memo } from 'react'
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
    const [is_dragging, set_is_dragging] = useState(false)
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

    const handle_mouse_down = (e: React.MouseEvent<HTMLDivElement>) => {
      set_is_dragging(true)
      set_start_x(e.nativeEvent.offsetX)
      set_start_y(e.nativeEvent.offsetY)
    }

    const handle_mouse_move = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!is_dragging) return

      const current_x = e.nativeEvent.offsetX
      const current_y = e.nativeEvent.offsetY
      const x = Math.min(start_x, current_x)
      const y = Math.min(start_y, current_y)
      const width = Math.abs(current_x - start_x)
      const height = Math.abs(current_y - start_y)

      set_preview_rect({ x, y, width, height })
    }

    const handle_mouse_up = useCallback(async () => {
      set_is_dragging(false)

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

        // Calculate scaling factors and offsets
        const container_rect = container.getBoundingClientRect()
        const container_aspect = container_rect.width / container_rect.height
        const img_aspect = img.naturalWidth / img.naturalHeight

        let scale_x, scale_y, offset_x, offset_y

        if (container_aspect > img_aspect) {
          // Image is constrained by height
          scale_y = container_rect.height / img.naturalHeight
          scale_x = scale_y
          offset_y = 0
          offset_x = (container_rect.width - img.naturalWidth * scale_x) / 2
        } else {
          // Image is constrained by width
          scale_x = container_rect.width / img.naturalWidth
          scale_y = scale_x
          offset_x = 0
          offset_y = (container_rect.height - img.naturalHeight * scale_y) / 2
        }

        // Calculate crop dimensions in the original image space
        const crop_x = (preview_rect.x - offset_x) / scale_x
        const crop_y = (preview_rect.y - offset_y) / scale_y
        const crop_width = preview_rect.width / scale_x
        const crop_height = preview_rect.height / scale_y

        // Set canvas dimensions to match the crop size
        canvas.width = crop_width
        canvas.height = crop_height

        // Perform the crop
        ctx.drawImage(
          img,
          crop_x,
          crop_y,
          crop_width,
          crop_height,
          0,
          0,
          crop_width,
          crop_height,
        )

        const resized_image = canvas.toDataURL()
        props.on_resize(resized_image)
        set_image(resized_image)
      }

      set_preview_rect({ x: 0, y: 0, width: 0, height: 0 })
    }, [preview_rect, props])

    const handle_restore_original = () => {
      props.on_resize(props.image)
      set_image(props.image)
    }

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
            [styles['restore--active']]: props.image !== image,
          })}
          title={props.translations.restore}
        >
          <Icon variant="RESTORE" />
        </div>
        <div
          className={styles.image}
          onMouseDown={handle_mouse_down}
          onMouseMove={handle_mouse_move}
          onMouseUp={handle_mouse_up}
          ref={container_ref}
        >
          <img
            src={image}
            ref={image_ref}
            draggable={false}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
          {is_dragging && (
            <div
              style={{
                position: 'absolute',
                left: preview_rect.x,
                top: preview_rect.y,
                width: preview_rect.width,
                height: preview_rect.height,
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
