import { Dictionary } from '@/dictionaries/dictionary'
import { Content as UiCommonTemplate_Modal_Content } from '../../../web-ui/src/components/common/templates/modal/content'
import { Header as UiCommonTemplate_Modal_Content_Header } from '../../../web-ui/src/components/common/templates/modal/content/header'
import { Footer as UiCommonTemplate_Modal_Content_Footer } from '../../../web-ui/src/components/common/templates/modal/content/footer'
import { Delete as UiCommonTemplate_Modal_Content_Delete } from '../../../web-ui/src/components/common/templates/modal/content/delete'

export const delete_bookmark_modal = (params: {
  modal_context: any
  title?: string
  dictionary: Dictionary
}) =>
  new Promise<boolean>((resolve) => {
    const on_submit_handler = () => resolve(true)
    const on_close_handler = () => resolve(false)
    params.modal_context.set_modal({
      modal: (
        <UiCommonTemplate_Modal_Content
          width={400}
          slot_header={
            <UiCommonTemplate_Modal_Content_Header
              title={params.dictionary.app.delete_modal.delete_bookmark}
            />
          }
          slot_footer={
            <UiCommonTemplate_Modal_Content_Footer
              button_label={params.dictionary.app.delete_modal.delete}
              is_disabled={false}
              button_on_click={on_submit_handler}
              on_click_cancel={on_close_handler}
              translations={{
                cancel: params.dictionary.app.delete_modal.cancel,
              }}
            />
          }
        >
          <UiCommonTemplate_Modal_Content_Delete
            text={params.dictionary.app.delete_modal.are_you_sure}
            bookmark_title={params.title}
          />
        </UiCommonTemplate_Modal_Content>
      ),
    })
  })
