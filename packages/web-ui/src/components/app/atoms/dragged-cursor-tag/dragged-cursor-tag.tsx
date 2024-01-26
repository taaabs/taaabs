import styles from './dragged-cursor-tag.module.scss'
import { useEffect, useRef } from 'react'

export namespace DraggedCursorTag {
  export type Props = {
    tag_name?: string
  }
}

export const DraggedCursorTag: React.FC<DraggedCursorTag.Props> = (props) => {
  const tag = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.tag_name) {
      const on_mouse_move = (event: MouseEvent) => {
        tag.current!.style.transform = `translateY(${event.clientY + 12}px)`
        tag.current!.style.transform += `translateX(${event.clientX + 12}px)`
        tag.current!.style.opacity = '1'
      }
      addEventListener('mousemove', on_mouse_move)
      return () => {
        removeEventListener('mousemove', on_mouse_move)
      }
    }
  }, [props.tag_name])

  return props.tag_name ? (
    <div ref={tag} className={styles.tag}>
      {props.tag_name}
    </div>
  ) : (
    <></>
  )
}
