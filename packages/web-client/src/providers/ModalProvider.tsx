'use client'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { createContext, useCallback, useEffect, useState } from 'react'

export type ModalContext = {
  set: (content?: React.ReactNode) => void
  close: () => void
  is_open: boolean
}

export const ModalContext = createContext({} as ModalContext)

export const ModalProvider: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const [content, set] = useState<React.ReactNode>()
  const [is_open, set_is_open] = useState<boolean>(false)

  const close = () => {
    set_is_open(false)
    requestAnimationFrame(() => {
      set(undefined)
    })
  }

  useUpdateEffect(() => {
    if (content) {
      set_is_open(true)
    }
  }, [content])

  const handle_popstate = useCallback(() => {
    close()
    history.go(1)
  }, [])

  useEffect(() => {
    if (is_open) {
      window.addEventListener('popstate', handle_popstate)
    } else {
      window.removeEventListener('popstate', handle_popstate)
    }
  }, [is_open])

  return (
    <ModalContext.Provider
      value={{
        set,
        close,
        is_open,
      }}
    >
      <>
        {content}
        {props.children}
      </>
    </ModalContext.Provider>
  )
}
