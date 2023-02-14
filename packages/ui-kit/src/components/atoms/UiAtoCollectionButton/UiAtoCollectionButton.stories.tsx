import { Meta, Story } from '@storybook/react'
import { UiAtoCollectionButton, UiAtoCollectionButtonProps } from './UiAtoCollectionButton'

export default {
  title: 'Atoms/UiAtoCollectionButton',
  component: UiAtoCollectionButton,
} as Meta

const template: Story<UiAtoCollectionButtonProps> = (props) => (
  <div style={{ margin: '4rem' }}>
    <UiAtoCollectionButton {...props}>Click me</UiAtoCollectionButton>
  </div>
)

export const standard = template.bind({})
standard.args = { href: '/' }
