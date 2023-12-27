import { Helpers } from '@web-ui'
import { LogoForHeader } from '.'

export default {
  component: LogoForHeader,
}

export const Primary = () => (
  <Helpers.Storybook.StorybookMargin>
    <LogoForHeader href="" />
    <Helpers.Storybook.StorybookSpacer />
    <LogoForHeader href="" is_large={true} />
  </Helpers.Storybook.StorybookMargin>
)
