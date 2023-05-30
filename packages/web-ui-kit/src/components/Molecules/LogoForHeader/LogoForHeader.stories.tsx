import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { LogoForHeader } from '.'

export default {
  component: LogoForHeader,
}

export const Primary = () => (
  <StorybookMargin>
    <LogoForHeader />
  </StorybookMargin>
)
