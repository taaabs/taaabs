import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { Meta } from '@storybook/react'
import { Logo } from './Logo'

export default {
  title: 'Atoms/Logo',
  component: Logo,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <Logo />
  </StorybookMargin>
)
