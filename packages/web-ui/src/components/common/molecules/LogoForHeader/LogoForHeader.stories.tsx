import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { LogoForHeader } from '.'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'

export default {
  component: LogoForHeader,
}

export const Primary = () => (
  <StorybookMargin>
    <LogoForHeader href="" />
    <StorybookSpacer />
    <LogoForHeader href="" isLarge={true} />
  </StorybookMargin>
)