import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { StorybookSpacer } from '@/helpers/components/StorybookSpacer'
import { Meta, Story } from '@storybook/react'
import { _Logo } from '.'

export default {
  title: 'Molecules/DesktopTopNavigationBar/_Logo',
  component: _Logo,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <_Logo />
    <StorybookSpacer />
    <_Logo username="alicia" />
  </StorybookMargin>
)
