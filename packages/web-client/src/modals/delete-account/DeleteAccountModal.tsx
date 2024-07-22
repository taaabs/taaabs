import { Dictionary } from '@/dictionaries/dictionary'
import { Modal as UiModal } from '@web-ui/components/Modal'
import { Header as UiModal_Header } from '@web-ui/components/Modal/Header'
import { Footer as UiModal_Footer } from '@web-ui/components/Modal/Footer'
import { Content as UiModal_Content } from '@web-ui/components/Modal/Content'
import { useContext, useState } from 'react'
import { ModalContext } from '@/providers/ModalProvider'

namespace DeleteAccountModal {
  export type Props = {
    on_submit: () => void
    on_close: () => void
    dictionary: Dictionary
  }
}

export const DeleteAccountModal: React.FC<DeleteAccountModal.Props> = (
  props,
) => {
  const modal_context = useContext(ModalContext)!
  const [is_deleting, set_is_deleting] = useState<boolean>()

  const content = (
    <UiModal_Content>
      {props.dictionary.settings.general.delete_account.modal.text}
    </UiModal_Content>
  )

  const header = (
    <UiModal_Header
      title={props.dictionary.settings.general.delete_account.modal.header}
      on_close={props.on_close}
    />
  )

  const footer = (
    <UiModal_Footer
      button_label={
        props.dictionary.settings.general.delete_account.modal.button_label
      }
      is_disabled={is_deleting}
      button_on_click={() => {
        set_is_deleting(true)
        props.on_submit()
      }}
      on_click_cancel={props.on_close}
      is_danger={true}
      translations={{
        cancel: props.dictionary.settings.general.delete_account.modal.cancel,
      }}
    />
  )

  return (
    <UiModal
      is_open={modal_context.is_open}
      is_dismissible={!is_deleting}
      on_close={props.on_close}
      width={400}
      slot_header={header}
      slot_content={content}
      slot_footer={footer}
    />
  )
}
