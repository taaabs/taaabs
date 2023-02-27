import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { Meta, Story } from '@storybook/react'
import { CollectionButton } from './CollectionButton'
import { CollectionButtonTypes } from './CollectionButton.types'

export default {
  title: 'Atoms/CollectionButton',
  component: CollectionButton,
} as Meta

const template: Story<CollectionButtonTypes.Props> = (props) => (
  <StorybookMargin>
    <CollectionButton {...props}>Click me</CollectionButton>
  </StorybookMargin>
)

export const standard = template.bind({})
standard.args = { href: '/' }
