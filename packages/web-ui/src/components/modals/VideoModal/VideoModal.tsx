import styles from './VideoModal.module.scss'
import cn from 'classnames'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useEffect } from 'react'
import { _Iframe } from './_Iframe'
import { use_is_hydrated } from '@shared/hooks'

export namespace VideoModal {
  export type Props = {
    on_close: () => void
    embed_url: string
  }
}

export const VideoModal: React.FC<VideoModal.Props> = (props) => {
  const is_hydrated = use_is_hydrated()

  useUpdateEffect(() => {
    const header = document.querySelector<HTMLElement>('body > header')
    const top_divs = document.querySelectorAll<HTMLElement>('body > div')
    const toolbar = document.getElementById('toolbar')
    const scrollbar_width = window.innerWidth - document.body.clientWidth

    document.body.style.overflow = 'hidden'
    if (header) header.style.paddingRight = `${scrollbar_width}px`
    top_divs.forEach(
      (el: any) => (el.style.paddingRight = `${scrollbar_width}px`),
    )
    if (toolbar) toolbar.style.paddingRight = `${scrollbar_width}px`

    return () => {
      document.body.style.overflow = ''
      if (header) header.style.paddingRight = ''
      top_divs.forEach((el: any) => (el.style.paddingRight = ''))
      if (toolbar) toolbar.style.paddingRight = ''
    }
  }, [])

  useEffect(() => {
    const handle_keyboard = (event: KeyboardEvent) => {
      if (event.code == 'Escape') {
        props.on_close()
      }
    }
    window.addEventListener('keydown', handle_keyboard)
    return () => window.removeEventListener('keydown', handle_keyboard)
  }, [])

  return (
    <div
      className={cn(styles.modal, is_hydrated && styles['modal--visible'])}
      onMouseDown={props.on_close}
    >
      <div
        className={cn(
          styles.modal__inner,
          is_hydrated && styles['modal__inner--visible'],
        )}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <_Iframe src={props.embed_url || ''} />
      </div>
    </div>
  )
}
