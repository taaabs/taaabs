import { Drawer } from 'vaul'
import styles from './Modal.module.scss'
import cn from 'classnames'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import OutsideClickHandler from 'react-outside-click-handler'
import { useEffect } from 'react'

namespace Modal {
  export type Props = {
    children?: React.ReactNode
    slot_header: React.ReactNode
    slot_content: React.ReactNode
    slot_footer?: React.ReactNode
    is_open: boolean
    on_close: () => void
    is_dismissible?: boolean
    width?: number
  }
}

export const Modal: React.FC<Modal.Props> = (props) => {
  useUpdateEffect(() => {
    const header = document.querySelector<HTMLElement>('body > header')
    const top_divs = document.querySelectorAll<HTMLElement>('body > div')
    const toolbar = document.getElementById('toolbar')
    if (props.is_open) {
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
  }, [props.is_open])

  useEffect(() => {
    const handle_keyboard = (event: KeyboardEvent) => {
      if (event.code == 'Escape') {
        props.on_close()
      }
    }
    window.addEventListener('keydown', handle_keyboard)
    return () => window.removeEventListener('keydown', handle_keyboard)
  }, [])

  return window.innerWidth >= 768 ? (
    <div
      className={cn(styles.modal, {
        [styles['modal--visible']]: props.is_open,
      })}
    >
      <OutsideClickHandler
        onOutsideClick={props.on_close}
        disabled={
          props.is_dismissible === undefined ? false : !props.is_dismissible
        }
      >
        <div
          className={cn(styles.modal__inner, {
            [styles['modal__inner--visible']]: props.is_open,
          })}
          style={{ maxWidth: props.width, width: '100%' }}
        >
          {props.slot_header}
          <div style={{ overflow: 'auto', maxHeight: '75vh' }}>
            {props.slot_content}
          </div>
          {props.slot_footer}
        </div>
      </OutsideClickHandler>
    </div>
  ) : (
    <Drawer.Root open={props.is_open} dismissible={props.is_dismissible}>
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            zIndex: 3,
            position: 'fixed',
            backgroundColor: 'rgb(0 0 0 / 0.4)',
            inset: 0,
          }}
          onClick={props.on_close}
        />
        <Drawer.Content
          style={{
            position: 'fixed',
            zIndex: 4,
            left: 0,
            right: 0,
            bottom: 0,
            borderTopLeftRadius: '14px',
            borderTopRightRadius: '14px',
            overflow: 'hidden',
          }}
        >
          {props.slot_header}
          <div style={{ overflow: 'auto', maxHeight: '75vh' }}>
            {props.slot_content}
          </div>
          {props.slot_footer}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
