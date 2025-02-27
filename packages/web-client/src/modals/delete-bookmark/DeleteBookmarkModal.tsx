import { Dictionary } from '@/dictionaries/dictionary'
import { Modal as Ui_Modal } from '@web-ui/components/Modal'
import { Header as Ui_Modal_Header } from '@web-ui/components/Modal/Header'
import { Footer as Ui_Modal_Footer } from '@web-ui/components/Modal/Footer'
import { Content as Ui_Modal_Content } from '@web-ui/components/Modal/Content'
import { useState } from 'react'

namespace DeleteBookmarkModal {
  export type Props = {
    title?: string
    on_submit: () => void
    on_close: () => void
    dictionary: Dictionary
  }
}

export const DeleteBookmarkModal: React.FC<DeleteBookmarkModal.Props> = (
  props,
) => {
  const [is_deleting, set_is_deleting] = useState<boolean>()

  const content = (
    <Ui_Modal_Content>
      <span>
        {props.dictionary.app.delete_modal.are_you_sure}{' '}
        {props.title ? (
          <strong>{props.title}</strong>
        ) : (
          <i>{props.dictionary.app.delete_modal.untitled}</i>
        )}
      </span>
    </Ui_Modal_Content>
  )

  const header = (
    <Ui_Modal_Header
      title={props.dictionary.app.delete_modal.delete_bookmark}
      on_close={props.on_close}
    />
  )

  const footer = (
    <Ui_Modal_Footer
      button_label={props.dictionary.app.delete_modal.delete}
      is_disabled={is_deleting}
      button_on_click={() => {
        set_is_deleting(true)
        props.on_submit()
      }}
      on_click_cancel={props.on_close}
      is_danger={true}
      translations={{
        cancel: props.dictionary.app.delete_modal.cancel,
      }}
    />
  )

  return (
    <Ui_Modal
      is_dismissible={!is_deleting}
      on_close={props.on_close}
      width={400}
      slot_header={header}
      slot_content={content}
      slot_footer={footer}
    />
  )
}
