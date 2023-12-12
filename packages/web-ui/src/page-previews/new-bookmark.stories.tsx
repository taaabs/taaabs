import { Box } from '@web-ui/components/app/atoms/box'
import { BoxHeading } from '@web-ui/components/app/atoms/box-heading'
import { ModalFooter } from '@web-ui/components/app/atoms/modal-footer'
import { ModalHeader } from '@web-ui/components/app/atoms/modal-header'
import { Form } from '@web-ui/components/app/templates/form/form'
import { Button } from '@web-ui/components/common/particles/button'
import { Modal } from '@web-ui/components/common/templates/modal'
import { lorem_ipsum } from '@web-ui/helpers/storybook/lorem-ipsum'

export default {
  title: 'page-previews/new-bookmark',
}

export const Primary = () => {
  return (
    <Modal
      children={<>{lorem_ipsum.long}</>}
      slot_modal={
        <Form
          slot_header={
            <ModalHeader title="New bookmark" on_click_close={() => {}} />
          }
          slot_footer={
            <ModalFooter
              slot_right_side={<Button size="medium">Create</Button>}
            />
          }
        >
          <Box>
            <BoxHeading
              heading="Links"
              subheading="Add one or more urls directly related to the bookmarked resource like an article and a place it was shared from."
            />
          </Box>
          <Box>
            <BoxHeading
              heading="Title"
              subheading="Briefly describe your bookmark."
            />
          </Box>
          <Box>
            <BoxHeading
              heading="Tags"
              subheading="Accurate keywords help keeping your library organized."
            />
          </Box>
        </Form>
      }
    />
  )
}
