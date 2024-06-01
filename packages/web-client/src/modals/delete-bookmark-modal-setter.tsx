import { Dictionary } from '@/dictionaries/dictionary'
import { ContentStandard as UiCommonTemplate_Modal_ContentStandard } from '@web-ui/components/common/templates/modal/content-standard'
import { Header as UiCommonTemplate_Modal_ContentStandard_Header } from '@web-ui/components/common/templates/modal/content-standard/header'
import { Footer as UiCommonTemplate_Modal_ContentStandard_Footer } from '@web-ui/components/common/templates/modal/content-standard/footer'
import { Delete as UiCommonTemplate_Modal_ContentStandard_Delete } from '@web-ui/components/common/templates/modal/content-standard/delete'
import { useState } from 'react'

export const delete_bookmark_modal_setter = (params: {
  modal_context: any
  title?: string
  dictionary: Dictionary
}) =>
  new Promise<boolean>((resolve) => {
    const on_submit_handler = () => resolve(true)
    const on_close_handler = () => resolve(false)
    params.modal_context.set_modal_content({
      modal_content: (
        <_ModalContent
          on_submit={on_submit_handler}
          on_close={on_close_handler}
          dictionary={params.dictionary}
          title={params.title}
        />
      ),
    })
  })

const _ModalContent: React.FC<{
  on_submit: () => void
  on_close: () => void
  dictionary: Dictionary
  title?: string
}> = (props) => {
  const [is_deleting, set_is_deleting] = useState<boolean>()

  return (
    <UiCommonTemplate_Modal_ContentStandard
      width={400}
      slot_header={
        <UiCommonTemplate_Modal_ContentStandard_Header
          title={props.dictionary.app.delete_modal.delete_bookmark}
        />
      }
      slot_footer={
        <UiCommonTemplate_Modal_ContentStandard_Footer
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
      <UiCommonTemplate_Modal_ContentStandard_Delete
        text={props.dictionary.app.delete_modal.are_you_sure}
        bookmark_title={props.title}
      />
    </UiCommonTemplate_Modal_ContentStandard>
  )
}
