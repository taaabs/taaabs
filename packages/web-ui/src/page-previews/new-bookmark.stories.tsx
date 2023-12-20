import { Box } from '@web-ui/components/app/atoms/box'
import { BoxHeading } from '@web-ui/components/app/atoms/box-heading'
import { SimpleBackArrowHeader } from '@web-ui/components/app/atoms/simple-back-arrow-header'
import { NewBookmark } from '@web-ui/components/app/templates/new-bookmark'
import { Button } from '@web-ui/components/common/particles/button'

export default {
  title: 'page-previews/new-bookmark',
}

export const Primary = () => {
  return (
    <NewBookmark
      slot_header={<SimpleBackArrowHeader back_href="/" title="New bookmark" />}
      slot_footer={<Button size="medium">Create</Button>}
    >
      <Box>
        <BoxHeading heading="Lorem" />
      </Box>
      <Box>
        <BoxHeading heading="Ipsum" />
      </Box>
    </NewBookmark>
  )
}
