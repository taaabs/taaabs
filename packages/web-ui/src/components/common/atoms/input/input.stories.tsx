import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { Input } from './input'

export default {
  component: Input,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <Input on_change={() => {}} value="Lorem" />
      <StorybookSpacer />
      <Input on_change={() => {}} value="Lorem" min_lines={2} />
    </StorybookMargin>
  )
}
