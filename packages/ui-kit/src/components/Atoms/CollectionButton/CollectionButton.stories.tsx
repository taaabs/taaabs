import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { Meta, Story } from '@storybook/react'
import { CollectionButton, CollectionButtonProps } from './CollectionButton'

export default {
  title: 'Atoms/CollectionButton',
  component: CollectionButton,
} as Meta

const template: Story<CollectionButtonProps> = (props) => (
  <StorybookMargin>
    <CollectionButton {...props}>Click me</CollectionButton>
  </StorybookMargin>
)

export const standard = template.bind({})
standard.args = { href: '/' }
