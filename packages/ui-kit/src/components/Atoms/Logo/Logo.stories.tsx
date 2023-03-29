import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Meta } from '@storybook/react'
import { Logo } from './Logo'

export default {
  title: 'Atoms/Logo',
  component: Logo,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <Logo size="small" />
    <StorybookSpacer />
    <Logo size="default" />
  </StorybookMargin>
)
