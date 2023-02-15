import { StorybookMargin } from '@/storybook-helpers/components/StorybookMargin'
import { Meta, Story } from '@storybook/react'
import { UiAtoCollectionButton, UiAtoCollectionButtonProps } from './UiAtoCollectionButton'

export default {
  title: 'Atoms/UiAtoCollectionButton',
  component: UiAtoCollectionButton,
} as Meta

const template: Story<UiAtoCollectionButtonProps> = (props) => (
  <StorybookMargin>
    <UiAtoCollectionButton {...props}>Click me</UiAtoCollectionButton>
  </StorybookMargin>
)

export const standard = template.bind({})
standard.args = { href: '/' }
