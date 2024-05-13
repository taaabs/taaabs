import { useEffect } from 'react'
import styles from './modal.module.scss'
import cn from 'classnames'

export namespace Modal {
  export type Props = {
    children?: React.ReactNode
    slot_modal?: React.ReactNode
    pin_to_bottom_on_mobile?: boolean
  }
}

export const Modal: React.FC<Modal.Props> = (props) => {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('body > header')
    const top_divs = document.querySelectorAll<HTMLElement>('body > div')
    const toolbar = document.getElementById('toolbar')
    if (props.slot_modal) {
      const scrollbar_width = window.innerWidth - document.body.clientWidth

      document.body.style.overflow = 'hidden'
      if (header) header.style.paddingRight = `${scrollbar_width}px`
      top_divs.forEach(
        (el: any) => (el.style.paddingRight = `${scrollbar_width}px`),
      )
      if (toolbar) toolbar.style.paddingRight = `${scrollbar_width}px`
    } else {
      document.body.style.overflow = ''
      if (header) header.style.paddingRight = ''
      top_divs.forEach((el: any) => (el.style.paddingRight = ''))
      if (toolbar) toolbar.style.paddingRight = ''
    }
  }, [props.slot_modal])

  return (
    <>
      {props.children}
      <div
        className={cn(styles.modal, {
          [styles['modal--visible']]: props.slot_modal,
          [styles['modal--pin-to-bottom-on-mobile']]:
            props.pin_to_bottom_on_mobile,
        })}
      >
        <div
          className={cn(styles.modal__inner, {
            [styles['modal__inner--visible']]: props.slot_modal,
            [styles['modal__inner--pin-to-bottom-on-mobile']]:
              props.pin_to_bottom_on_mobile,
          })}
        >
          {props.slot_modal}
        </div>
      </div>
    </>
  )
}
