import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Meta } from '@storybook/react'
import { Icon } from './Icon'

export default {
  title: 'Atoms/Icon',
  component: Icon,
} as Meta

export const Icons = () => (
  <StorybookMargin>
    <Icon variant={'ADD'} />
    <StorybookSpacer />
    <Icon variant={'BOOKMARK'} />
    <StorybookSpacer />
    <Icon variant={'GREATER_THAN'} />
    <StorybookSpacer />
    <Icon variant={'MOBILE_TITLE_BAR_MENU'} />
    <StorybookSpacer />
    <Icon variant={'MOBILE_TITLE_BAR_VIEW_OPTIONS'} />
    <StorybookSpacer />
    <Icon variant={'SEARCH'} />
    <StorybookSpacer />
    <Icon variant={'STAR_FILLED'} />
    <StorybookSpacer />
    <Icon variant={'STAR'} />
    <StorybookSpacer />
    <Icon variant={'SUN'} />
    <StorybookSpacer />
    <Icon variant={'USER_ADD'} />
    <StorybookSpacer />
    <Icon variant={'USER_REMOVE'} />
    <StorybookSpacer />
    <Icon variant={'USER'} />
    <StorybookSpacer />
  </StorybookMargin>
)
