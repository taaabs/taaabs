import { useEffect, useRef, useState } from 'react'
import styles from './form-modal.module.scss'
import cn from 'classnames'
import SimpleBar from 'simplebar-react'

export namespace FormModal {
  export type Props = {
    slot_header: React.ReactNode
    children?: React.ReactNode
    slot_footer: React.ReactNode
  }
}

export const FormModal: React.FC<FormModal.Props> = (props) => {
  const simplebar = useRef<any>(null)
  const [is_scrolled_to_top, set_is_scrolled_to_top] = useState(true)
  const [is_scrolled_to_bottom, set_is_scrolled_to_bottom] = useState(true)

  useEffect(() => {
    const handle_scroll = (e: any) => {
      const { scrollHeight, scrollTop, clientHeight } = e.target

      if (Math.floor(scrollHeight - scrollTop) == clientHeight) {
        set_is_scrolled_to_bottom(true)
      } else if (scrollTop == 0) {
        set_is_scrolled_to_top(true)
      } else {
        set_is_scrolled_to_top(false)
        set_is_scrolled_to_bottom(false)
      }
    }
    const element = simplebar.current.getScrollElement()
    element.scrollTo(0, 0) // Autofocus on field when adding new scrolls a little bit.
    element!.addEventListener('scroll', handle_scroll, { passive: true })
    return () => {
      element!.removeEventListener('scroll', handle_scroll)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div
        className={cn(styles.header, {
          [styles['header--shadow']]: !is_scrolled_to_top,
        })}
      >
        {props.slot_header}
      </div>

      <SimpleBar className={styles.simplebar} ref={simplebar}>
        <div className={styles.simplebar__inner}>{props.children}</div>
      </SimpleBar>

      <div
        className={cn(styles.footer, {
          [styles['footer--shadow']]: !is_scrolled_to_bottom,
        })}
      >
        {props.slot_footer}
      </div>
    </div>
  )
}
