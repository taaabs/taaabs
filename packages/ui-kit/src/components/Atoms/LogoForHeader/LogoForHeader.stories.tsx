import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { Meta } from '@storybook/react'
import { LogoForHeader } from '.'

export default {
  title: 'Atoms/LogoForHeader',
  component: LogoForHeader,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <LogoForHeader />
  </StorybookMargin>
)
