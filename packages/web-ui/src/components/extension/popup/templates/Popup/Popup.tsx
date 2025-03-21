import styles from './Popup.scss'
import SimpleBar from 'simplebar-react'
import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'

export namespace Popup {
  export type Props = {
    header_slot: React.ReactNode
    actions_slot?: React.ReactNode
    prompt_field_slot: React.ReactNode
    recent_prompts_slot: React.ReactNode
    footer_links_slot: React.ReactNode
  }
}

export const Popup: React.FC<Popup.Props> = (props) => {
  const simplebar_ref = useRef<any>(null)
  const [show_top_shadow, set_show_top_shadow] = useState(false)
  const [show_bottom_shadow, set_show_bottom_shadow] = useState(true)

  // Subscribe to scroll events of simplebar
  useEffect(() => {
    if (!simplebar_ref.current) return

    const simplebar_el = simplebar_ref.current.getScrollElement()
    const handle_scroll = () => {
      set_show_top_shadow(simplebar_el.scrollTop > 5)
      set_show_bottom_shadow(
        simplebar_el.scrollTop + simplebar_el.clientHeight + 5 <
          simplebar_el.scrollHeight,
      )
    }

    simplebar_el.addEventListener('scroll', handle_scroll)
    // Initial check for bottom shadow
    handle_scroll()

    return () => simplebar_el.removeEventListener('scroll', handle_scroll)
  }, [])

  return (
    <div className={styles.container}>
      {props.header_slot}
      {props.actions_slot}
      <div
        className={cn(styles.container__scroll, {
          [styles['container__scroll--show-top-shadow']]: show_top_shadow,
          [styles['container__scroll--show-bottom-shadow']]: show_bottom_shadow,
        })}
      >
        <SimpleBar style={{ height: '100%' }} ref={simplebar_ref}>
          {props.prompt_field_slot}
          {props.recent_prompts_slot}
        </SimpleBar>
      </div>
      {props.footer_links_slot}
    </div>
  )
}
