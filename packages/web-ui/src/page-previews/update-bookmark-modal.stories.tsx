import { Box } from '@web-ui/components/app/atoms/box'
import { HeadingWithSubheading } from '@web-ui/components/app/atoms/heading-with-subheading'
import { ModalFooter } from '@web-ui/components/app/templates/content/modal-footer'
import { ModalHeader } from '@web-ui/components/app/templates/content/modal-header'
import { FormModal } from '@web-ui/components/app/templates/content'
import { Modal } from '@web-ui/components/common/templates/modal'
import { lorem_ipsum } from '@web-ui/helpers'

export default {
  title: 'page-previews/update-bookmark-modal',
}

export const Primary = () => {
  return (
    <Modal
      children={<>{lorem_ipsum.long}</>}
      slot_modal={
        <FormModal
          slot_header={<ModalHeader title_="Update bookmark" />}
          slot_footer={
            <ModalFooter
              button_label_="Update"
              is_disabled_={false}
              on_click_cancel_={() => {}}
            />
          }
        >
          <Box>
            <HeadingWithSubheading heading="Links" />
          </Box>
          <Box>
            <HeadingWithSubheading heading="Title" />
          </Box>
          <Box>
            <HeadingWithSubheading heading="Tags" />
          </Box>
        </FormModal>
      }
    />
  )
}
