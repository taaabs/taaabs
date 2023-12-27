import { Box } from '@web-ui/components/app/atoms/box'
import { BoxHeading } from '@web-ui/components/app/atoms/box-heading'
import { ModalFooter } from '@web-ui/components/app/atoms/modal-footer'
import { ModalHeader } from '@web-ui/components/app/atoms/modal-header'
import { FormModal } from '@web-ui/components/app/templates/form-modal'
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
          slot_header={<ModalHeader title="Update bookmark" />}
          slot_footer={
            <ModalFooter
              button_label="Update"
              is_disabled={false}
              on_click_cancel={() => {}}
            />
          }
        >
          <Box>
            <BoxHeading heading="Links" />
          </Box>
          <Box>
            <BoxHeading heading="Title" />
          </Box>
          <Box>
            <BoxHeading heading="Tags" />
          </Box>
        </FormModal>
      }
    />
  )
}
