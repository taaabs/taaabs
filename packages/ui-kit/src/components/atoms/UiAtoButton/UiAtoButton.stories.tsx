import { Meta, Story } from '@storybook/react'
import { UiAtoButton, UiAtoButtonProps } from './UiAtoButton'

export default {
  title: 'atoms/button',
  component: UiAtoButton,
} as Meta

const Template: Story<UiAtoButtonProps> = (props) => (
  <UiAtoButton {...props}>Click me</UiAtoButton>
)

export const standard = Template.bind({})
standard.args = { href: '/' }
