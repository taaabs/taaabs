import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { Input } from './input'

export default {
  component: Input,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <Input on_change={() => {}} value="Lorem" />
    </StorybookMargin>
  )
}
