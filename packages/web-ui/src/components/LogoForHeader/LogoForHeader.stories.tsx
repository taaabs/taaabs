import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { LogoForHeader } from '.'

export default {
  component: LogoForHeader,
}

export const Primary = () => (
  <StorybookMargin>
    <LogoForHeader href="" />
    <StorybookSpacer />
    <LogoForHeader href="" is_large={true} />
  </StorybookMargin>
)
