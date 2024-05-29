import { Dictionary } from '@/dictionaries/dictionary'
import { Content as UiCommonTemplate_Modal_Content } from '../../../web-ui/src/components/common/templates/modal/content'
import { Header as UiCommonTemplate_Modal_Content_Header } from '../../../web-ui/src/components/common/templates/modal/content/header'
import { Footer as UiCommonTemplate_Modal_Content_Footer } from '../../../web-ui/src/components/common/templates/modal/content/footer'
import { Delete as UiCommonTemplate_Modal_Content_Delete } from '../../../web-ui/src/components/common/templates/modal/content/delete'
import { useState } from 'react'

export const delete_bookmark_modal_setter = (params: {
  modal_context: any
  title?: string
  dictionary: Dictionary
}) =>
  new Promise<boolean>((resolve) => {
    const on_submit_handler = () => resolve(true)
    const on_close_handler = () => resolve(false)
    params.modal_context.set_modal({
      modal: (
        <_Modal
          on_submit={on_submit_handler}
          on_close={on_close_handler}
          dictionary={params.dictionary}
          title={params.title}
        />
      ),
    })
  })

const _Modal: React.FC<{
  on_submit: () => void
  on_close: () => void
  dictionary: Dictionary
  title?: string
}> = (props) => {
  const [is_deleting, set_is_deleting] = useState<boolean>()

  return (
    <UiCommonTemplate_Modal_Content
      width={400}
      slot_header={
        <UiCommonTemplate_Modal_Content_Header
          title={props.dictionary.app.delete_modal.delete_bookmark}
        />
      }
      slot_footer={
        <UiCommonTemplate_Modal_Content_Footer
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
      }
    >
      <UiCommonTemplate_Modal_Content_Delete
        text={props.dictionary.app.delete_modal.are_you_sure}
        bookmark_title={props.title}
      />
    </UiCommonTemplate_Modal_Content>
  )
}
