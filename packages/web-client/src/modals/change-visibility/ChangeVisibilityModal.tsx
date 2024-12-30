import { Dictionary } from '@/dictionaries/dictionary'
import { Modal as Ui_Modal } from '@web-ui/components/Modal'
import { Header as Ui_Modal_Header } from '@web-ui/components/Modal/Header'
import { Footer as Ui_Modal_Footer } from '@web-ui/components/Modal/Footer'
import { Content as Ui_Modal_Content } from '@web-ui/components/Modal/Content'
import { useState } from 'react'

namespace ChangeVisibilityModal {
  export type Props = {
    on_submit: () => void
    on_close: () => void
    dictionary: Dictionary
  }
}

export const ChangeVisibilityModal: React.FC<ChangeVisibilityModal.Props> = (
  props,
) => {
  const [is_updating, set_is_updating] = useState<boolean>()

  const content = (
    <Ui_Modal_Content>
      <span>
        {
          props.dictionary.app.change_visibility_modal
            .change_to_public_confirmation
        }
      </span>
    </Ui_Modal_Content>
  )

  const header = (
    <Ui_Modal_Header
      title={props.dictionary.app.change_visibility_modal.change_visibility}
      on_close={props.on_close}
    />
  )

  const footer = (
    <Ui_Modal_Footer
      button_label={props.dictionary.app.change_visibility_modal.confirm}
      is_disabled={is_updating}
      button_on_click={() => {
        set_is_updating(true)
        props.on_submit()
      }}
      on_click_cancel={props.on_close}
      translations={{
        cancel: props.dictionary.app.change_visibility_modal.cancel,
      }}
    />
  )

  return (
    <Ui_Modal
      is_dismissible={!is_updating}
      on_close={props.on_close}
      width={400}
      slot_header={header}
      slot_content={content}
      slot_footer={footer}
    />
  )
}
