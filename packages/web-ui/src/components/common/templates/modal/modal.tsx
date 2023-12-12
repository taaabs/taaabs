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
    const top_elements = document.querySelectorAll('body > *')
    if (props.slot_modal) {
      const scrollbar_width = window.innerWidth - document.body.clientWidth

      document.body.style.overflow = 'hidden'
      top_elements.forEach(
        (el: any) => (el.style.paddingRight = `${scrollbar_width}px`),
      )
    } else {
      document.body.style.overflow = ''
      top_elements.forEach((el: any) => (el.style.paddingRight = ''))
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
