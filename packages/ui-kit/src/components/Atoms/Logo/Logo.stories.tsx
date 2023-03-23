import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { StorybookSpacer } from '@/helpers/components/StorybookSpacer'
import { Meta } from '@storybook/react'
import { Logo } from './Logo'

export default {
  title: 'Atoms/Logo',
  component: Logo,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <Logo />
    <StorybookSpacer />
    <Logo text="taaabs" />
    <StorybookSpacer />
    <Logo isPrimary={false} />
    <StorybookSpacer />
    <Logo text="lorem ipsum" isPrimary={false} />
  </StorybookMargin>
)
