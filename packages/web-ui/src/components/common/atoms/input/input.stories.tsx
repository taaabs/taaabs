import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { Input } from './input'

export default {
  component: Input,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <Input onChange={() => {}} value="Lorem" />
    </StorybookMargin>
  )
}
