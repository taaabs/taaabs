import styles from './Modal.module.scss'
import cn from 'classnames'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useEffect } from 'react'
import { Sheet } from 'react-modal-sheet'

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
      onClick={props.on_close}
    >
      <div
        className={cn(styles.modal__inner, {
          [styles['modal__inner--visible']]: props.is_open,
        })}
        style={{ maxWidth: props.width, width: '100%' }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {props.slot_header}
        <div
          style={{
            overflow: 'auto',
            maxHeight: props.slot_footer ? '70svh' : '85svh',
          }}
        >
          {props.slot_content}
        </div>
        {props.slot_footer}
      </div>
    </div>
  ) : (
    <Sheet
      isOpen={props.is_open}
      onClose={props.on_close}
      disableScrollLocking={true}
      detent="content-height"
    >
      <Sheet.Container
        style={{ backgroundColor: 'var(--background)', overflow: 'hidden' }}
      >
        <Sheet.Header>
          <div draggable={false}>{props.slot_header}</div>
        </Sheet.Header>
        <Sheet.Content>
          <Sheet.Scroller>
            <div style={{ maxHeight: props.slot_footer ? '70svh' : '85svh' }}>
              {props.slot_content}
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
        {props.slot_footer}
      </Sheet.Container>
      <Sheet.Backdrop onTap={props.on_close} />
    </Sheet>
  )
}
