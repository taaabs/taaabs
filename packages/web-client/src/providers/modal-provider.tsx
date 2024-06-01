'use client'

import { Modal as UiCommonTemplate_Modal } from '@web-ui/components/common/templates/modal'
import { createContext, ReactNode, useEffect, useState } from 'react'

export type ModalContext = {
  modal_content?: ReactNode
  set_modal_content: (params: {
    modal_content?: ReactNode
    pin_to_bottom_on_mobile?: boolean
  }) => void
}

export const ModalContext = createContext<ModalContext | null>(null)

export const ModalProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [modal_content, _set_modal_content] = useState<ReactNode>()
  const [pin_to_bottom_on_mobile, set_pin_to_bottom_on_mobile] =
    useState<boolean>()

  const set_modal_content = (params: {
    modal_content?: ReactNode
    pin_to_bottom_on_mobile?: boolean
  }) => {
    _set_modal_content(params.modal_content)
    set_pin_to_bottom_on_mobile(params.pin_to_bottom_on_mobile)
  }

  useEffect(() => {
    const handle_popstate = () => {
      set_modal_content({})
      history.go(1)
    }
    if (modal_content) {
      window.addEventListener('popstate', handle_popstate)
    }
    return () => window.removeEventListener('popstate', handle_popstate)
  }, [modal_content])

  return (
    <ModalContext.Provider value={{ set_modal_content, modal_content }}>
      <UiCommonTemplate_Modal
        slot_modal_content={modal_content}
        on_outside_click={() => {
          set_modal_content({})
        }}
        pin_to_bottom_on_mobile={pin_to_bottom_on_mobile}
      >
        {props.children}
      </UiCommonTemplate_Modal>
    </ModalContext.Provider>
  )
}
