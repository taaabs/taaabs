'use client'

import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { createContext, ReactNode, useEffect, useState } from 'react'

export type ModalContext = {
  set: (content?: ReactNode) => void
  close: () => void
  is_open: boolean
}

export const ModalContext = createContext<ModalContext | null>(null)

export const ModalProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [content, set] = useState<ReactNode>()
  const [is_open, set_is_open] = useState<boolean>(false)

  const close = () => {
    set_is_open(false)
  }

  useUpdateEffect(() => {
    if (content) {
      // Needed by dynamically loaded modals (e.g. ReaderModal) - for entry
      // transition to work we need to wait for the next frame.
      setTimeout(() => {
        set_is_open(true)
      }, 0)
    }
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
        close,
        is_open,
      }}
    >
      {content}
      {props.children}
    </ModalContext.Provider>
  )
}
