'use client'

import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { createContext, ReactNode, useState } from 'react'

export type ModalContext = {
  set_content: (content?: ReactNode) => void
  close_trigger: number
  close: () => void
  is_opened: boolean
}

export const ModalContext = createContext<ModalContext | null>(null)

export const ModalProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [content, set_content] = useState<ReactNode>()
  const [close_trigger, set_close_trigger] = useState<number>(0)
  const [is_opened, set_is_opened] = useState<boolean>(false)

  const close = () => {
    set_close_trigger(Date.now())
    set_is_opened(false)
  }

  useUpdateEffect(() => {
    if (content) set_is_opened(true)
  }, [content])

  return (
    <ModalContext.Provider
      value={{
        set_content,
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
