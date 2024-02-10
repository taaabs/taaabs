import { useEffect, useRef, useState } from 'react'
import styles from './form-modal.module.scss'
import cn from 'classnames'

export namespace FormModal {
  export type Props = {
    slot_header: React.ReactNode
    children?: React.ReactNode
    slot_footer: React.ReactNode
  }
}

export const FormModal: React.FC<FormModal.Props> = (props) => {
  const content = useRef<HTMLDivElement>(null)
  const [is_scrolled_to_top, set_is_scrolled_to_top] = useState(true)
  const [is_scrolled_to_bottom, set_is_scrolled_to_bottom] = useState(true)

  useEffect(() => {
    const handle_scroll = () => {
      if (content.current!.scrollTop == 0) {
        set_is_scrolled_to_top(true)
      } else {
        set_is_scrolled_to_top(false)
      }

      if (
        Math.floor(
          content.current!.scrollTop + content.current!.clientHeight,
        ) == content.current!.scrollHeight
      ) {
        set_is_scrolled_to_bottom(true)
      } else {
        set_is_scrolled_to_bottom(false)
      }
    }
    handle_scroll()
    const element = content.current
    element!.addEventListener('scroll', handle_scroll)
    return () => {
      element!.removeEventListener('scroll', handle_scroll)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div
        className={cn(styles.container__header, {
          [styles['container__header--shadow']]: !is_scrolled_to_top,
        })}
      >
        {props.slot_header}
      </div>
      <div className={styles.container__content} ref={content}>
        <div className={styles.container__content__inner}>{props.children}</div>
      </div>
      <div
        className={cn(styles.container__footer, {
          [styles['container__footer--shadow']]: !is_scrolled_to_bottom,
        })}
      >
        {props.slot_footer}
      </div>
    </div>
  )
}
