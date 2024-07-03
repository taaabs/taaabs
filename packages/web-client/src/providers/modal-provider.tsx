'use client'

import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { createContext, ReactNode, useEffect, useState } from 'react'

export type ModalContext = {
  set: (content?: ReactNode) => void
  /**
   * Pass random value (e.g. Date.now()) to trigger modal closing in a consumer.
   */
  close_trigger: number
  close: () => void
  is_opened: boolean
}

export const ModalContext = createContext<ModalContext | null>(null)

export const ModalProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [content, set] = useState<ReactNode>()
  const [close_trigger, set_close_trigger] = useState<number>(0)
  const [is_opened, set_is_opened] = useState<boolean>(false)

  const close = () => {
    set_close_trigger(Date.now())
    set_is_opened(false)
  }

  useUpdateEffect(() => {
    if (content) set_is_opened(true)
  }, [content])

  useEffect(() => {
    const handle_popstate = () => {
      close()
      history.go(1)
    }
    if (content) {
      window.addEventListener('popstate', handle_popstate)
    }
    return () => window.removeEventListener('popstate', handle_popstate)
  }, [content])

  return (
    <ModalContext.Provider
      value={{
        set,
        close_trigger,
        close,
        is_opened,
      }}
    >
      {content}
      {props.children}
    </ModalContext.Provider>
  )
}
