'use client'

import { Modal } from '@web-ui/components/common/templates/modal'
import { createContext, ReactNode, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

export const ModalContext = createContext<{
  modal?: ReactNode
  set_modal: (modal?: ReactNode) => void
} | null>(null)

export const ModalProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [modal, set_modal] = useState<ReactNode>()

  return (
    <ModalContext.Provider value={{ set_modal, modal }}>
      <Modal
        slot_modal={
          modal && (
            <OutsideClickHandler
              onOutsideClick={() => {
                set_modal(undefined)
              }}
            >
              {modal}
            </OutsideClickHandler>
          )
        }
      >
        {props.children}
      </Modal>
    </ModalContext.Provider>
  )
}
