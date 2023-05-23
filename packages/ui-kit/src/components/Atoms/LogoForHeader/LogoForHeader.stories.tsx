import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { LogoForHeader } from '.'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'

export default {
  component: LogoForHeader,
}

export const Primary = () => (
  <StorybookMargin>
    <LogoForHeader />
    <StorybookSpacer />
    <LogoForHeader user={{ username: 'lorem', backHref: '/lorem' }} />
  </StorybookMargin>
)
