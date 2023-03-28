import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Meta, Story } from '@storybook/react'
import { Icon } from './Icon'

export default {
  title: 'Atoms/Icon',
  component: Icon,
} as Meta

export const icons: Story = () => (
  <StorybookMargin>
    <Icon variant={'ACTIVITY'} />
    <StorybookSpacer />
    <Icon variant={'ALIAS'} />
    <StorybookSpacer />
    <Icon variant={'ARCHIVE'} />
    <StorybookSpacer />
    <Icon variant={'COLLECTION_FILLED'} />
    <StorybookSpacer />
    <Icon variant={'COLLECTION'} />
    <StorybookSpacer />
    <Icon variant={'GREATER_THAN'} />
    <StorybookSpacer />
    <Icon variant={'HOME_FILLED'} />
    <StorybookSpacer />
    <Icon variant={'HOME'} />
    <StorybookSpacer />
    <Icon variant={'PIN'} />
    <StorybookSpacer />
    <Icon variant={'RECENT_FILLED'} />
    <StorybookSpacer />
    <Icon variant={'RECENT'} />
    <StorybookSpacer />
    <Icon variant={'SORT'} />
    <StorybookSpacer />
    <Icon variant={'STAR_FILLED'} />
    <StorybookSpacer />
    <Icon variant={'STAR'} />
    <StorybookSpacer />
    <Icon variant={'TRASH'} />
  </StorybookMargin>
)
