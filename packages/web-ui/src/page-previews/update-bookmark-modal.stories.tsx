import { Footer as UiCommonTemplate_Modal_ContentStandard_Footer } from '@web-ui/components/common/Modal/Footer'
import { Header as UiCommonTemplate_Modal_ContentStandard_Header } from '@web-ui/components/common/Modal/Header'
import { ContentStandard as UiCommonTemplage_Modal_ContentStandard } from '@web-ui/components/common/Modal/content'
import { Modal } from '@web-ui/components/common/modal'
import { lorem_ipsum } from '@web-ui/helpers'

export default {
  title: 'page-previews/update-bookmark-modal',
}

export const Primary = () => {
  return (
    <Modal
      on_outside_click={() => {}}
      children={<>{lorem_ipsum.long}</>}
      content={
        <UiCommonTemplage_Modal_ContentStandard
          width={500}
          slot_header={
            <UiCommonTemplate_Modal_ContentStandard_Header title="Update bookmark" />
          }
          slot_footer={
            <UiCommonTemplate_Modal_ContentStandard_Footer
              button_label="Update"
              is_disabled={false}
              on_click_cancel={() => {}}
              button_on_click={() => {}}
              translations={{
                cancel: 'Cancel',
              }}
            />
          }
        >
          Lorem ipsum
        </UiCommonTemplage_Modal_ContentStandard>
      }
    />
  )
}
