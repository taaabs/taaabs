import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { Box } from './box'

export default {
  component: Box,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <Box>children</Box>
    </StorybookMargin>
  )
}
