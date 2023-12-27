import { Helpers } from '@web-ui'
import { Box } from './box'

export default {
  component: Box,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <Box>children</Box>
    </Helpers.Storybook.StorybookMargin>
  )
}
