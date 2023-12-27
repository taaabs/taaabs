import { Helpers } from '@web-ui'
import { Input } from './input'

export default {
  component: Input,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <Input on_change={() => {}} value="Lorem" />
      <Helpers.Storybook.StorybookSpacer />
      <Input on_change={() => {}} value="Lorem" lines={2} />
    </Helpers.Storybook.StorybookMargin>
  )
}
