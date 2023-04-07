import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { Meta } from '@storybook/react'
import { LogoForHeader } from '.'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'

export default {
  title: 'Atoms/LogoForHeader',
  component: LogoForHeader,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <LogoForHeader />
    <StorybookSpacer />
    <LogoForHeader user={{ username: 'lorem', backHref: '/lorem' }} />
  </StorybookMargin>
)
