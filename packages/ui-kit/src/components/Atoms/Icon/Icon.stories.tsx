import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { StorybookSpacer } from '@/helpers/components/StorybookSpacer'
import { Meta, Story } from '@storybook/react'
import { Icon } from './Icon'
import { IconTypes } from './Icon.types'

export default {
  title: 'Atoms/Icon',
  component: Icon,
} as Meta

export const icons: Story = () => (
  <StorybookMargin>
    <Icon variant={IconTypes.Variant['ACTIVITY']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['ALIAS']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['ARCHIVE']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['COLLECTION_FILLED']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['COLLECTION']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['HOME_FILLED']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['HOME']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['PIN']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['RECENT_FILLED']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['RECENT']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['SORT']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['STAR_FILLED']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['STAR']} />
    <StorybookSpacer />
    <Icon variant={IconTypes.Variant['TRASH']} />
  </StorybookMargin>
)
