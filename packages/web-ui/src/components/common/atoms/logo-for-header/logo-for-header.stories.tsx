import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { LogoForHeader } from '.'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'

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
