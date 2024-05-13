'use client'

import { Modal as UiCommonTemplates_Modal } from '@web-ui/components/common/templates/modal'
import { createContext, ReactNode, useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

export type ModalContext = {
  modal?: ReactNode
  set_modal: (params: {
    modal?: ReactNode
    pin_to_bottom_on_mobile?: boolean
  }) => void
}

export const ModalContext = createContext<ModalContext | null>(null)

export const ModalProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [modal, _set_modal] = useState<ReactNode>()
  const [pin_to_bottom_on_mobile, set_pin_to_bottom_on_mobile] =
    useState<boolean>()

  const set_modal = (params: {
    modal?: ReactNode
    pin_to_bottom_on_mobile?: boolean
  }) => {
    _set_modal(params.modal)
    set_pin_to_bottom_on_mobile(params.pin_to_bottom_on_mobile)
  }

  useEffect(() => {
    const handle_popstate = () => {
      set_modal({})
      history.go(1)
    }
    if (modal) {
      window.addEventListener('popstate', handle_popstate)
    }
    return () => window.removeEventListener('popstate', handle_popstate)
  }, [modal])

  return (
    <ModalContext.Provider value={{ set_modal, modal }}>
      <UiCommonTemplates_Modal
        slot_modal={
          modal && (
            <OutsideClickHandler
              onOutsideClick={() => {
                set_modal({})
              }}
            >
              {modal}
            </OutsideClickHandler>
          )
        }
        pin_to_bottom_on_mobile={pin_to_bottom_on_mobile}
      >
        {props.children}
      </UiCommonTemplates_Modal>
    </ModalContext.Provider>
  )
}
