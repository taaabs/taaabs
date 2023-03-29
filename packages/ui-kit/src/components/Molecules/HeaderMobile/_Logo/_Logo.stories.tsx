import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Meta, Story } from '@storybook/react'
import { _Logo } from '.'

export default {
  title: 'Molecules/HeaderMobile/_Logo',
  component: _Logo,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <_Logo />
    <StorybookSpacer />
    <_Logo user={{ displayName: 'Alicia Keys', backHref: '/' }} />
  </StorybookMargin>
)
