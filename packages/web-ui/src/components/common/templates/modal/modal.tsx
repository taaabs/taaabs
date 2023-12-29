import { useEffect } from 'react'
import styles from './modal.module.scss'
import cn from 'classnames'

export namespace Modal {
  export type Props = {
    children?: React.ReactNode
    slot_modal?: React.ReactNode
  }
}

export const Modal: React.FC<Modal.Props> = (props) => {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('body > header')
    const top_divs = document.querySelectorAll<HTMLElement>('body > div')
    if (props.slot_modal) {
      const scrollbar_width = window.innerWidth - document.body.clientWidth

      document.body.style.overflow = 'hidden'
      if (header) header.style.paddingRight = `${scrollbar_width}px`
      top_divs.forEach(
        (el: any) => (el.style.paddingRight = `${scrollbar_width}px`),
      )
    } else {
      document.body.style.overflow = ''
      if (header) header.style.paddingRight = ''
      top_divs.forEach((el: any) => (el.style.paddingRight = ''))
    }
  }, [props.slot_modal])

  return (
    <>
      {props.children}
      <div
        className={cn(styles.modal, {
          [styles['modal--visible']]: props.slot_modal,
        })}
      >
        <div
          className={cn(styles.modal__inner, {
            [styles['modal__inner--visible']]: props.slot_modal,
          })}
        >
          {props.slot_modal}
        </div>
      </div>
    </>
  )
}
