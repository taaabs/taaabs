import { Box } from '@web-ui/components/app/atoms/box'
import { BoxHeading } from '@web-ui/components/app/atoms/box-heading'
import { SimpleBackArrowHeader } from '@web-ui/components/app/atoms/simple-back-arrow-header'
import { Form } from '@web-ui/components/app/templates/form/form'

export default {
  title: 'page-previews/new-bookmark',
}

export const Primary = () => {
  return (
    <Form
      slot_header={<SimpleBackArrowHeader back_href="/" title="New bookmark" />}
    >
      <Box>
        <BoxHeading heading="x" subheading="x" />
      </Box>
      <Box>1</Box>
    </Form>
  )
}
