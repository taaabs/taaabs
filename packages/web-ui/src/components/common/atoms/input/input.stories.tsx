import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { Input } from './input'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'

export default {
  component: Input,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <Input on_change={() => {}} value="Lorem" />
      <StorybookSpacer />
      <Input on_change={() => {}} value="Lorem" lines={2} />
    </StorybookMargin>
  )
}
