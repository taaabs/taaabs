import { StorybookMargin } from '@/helpers/components/StorybookMargin'
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
