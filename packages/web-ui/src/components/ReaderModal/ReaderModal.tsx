import { Drawer } from 'vaul'
import styles from './ReaderModal.module.scss'
import cn from 'classnames'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useEffect } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

namespace ReaderModal {
  export type Props = {
    slot_header: React.ReactNode
    slot_content: React.ReactNode
    is_open: boolean
    on_close: () => void
    is_dismissible?: boolean
  }
}

export const ReaderModal: React.FC<ReaderModal.Props> = (props) => {
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
      <OutsideClickHandler onOutsideClick={props.on_close}>
        <div className={styles.modal__inner} style={{ width: '100%' }}>
          <div
            style={{
              height: '100vh',
              overflow: 'auto',
            }}
          >
            {props.slot_content}
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  ) : (
    <Drawer.Root
      open={props.is_open}
      dismissible={props.is_dismissible}
      onClose={props.on_close}
      noBodyStyles={true}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            zIndex: 3,
            position: 'fixed',
            inset: 0,
          }}
          onClick={props.on_close}
          className={styles['drawer-overlay']}
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
            background: 'var(--white)',
          }}
        >
          {props.slot_header}
          <div className={styles['drawer-slot-content']}>
            {props.slot_content}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
