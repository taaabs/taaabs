import { Meta, Story } from '@storybook/react'
import { UiAtoButton, UiAtoButtonProps } from './UiAtoButton'

export default {
  title: 'Atoms/Button',
  component: UiAtoButton,
} as Meta

const template: Story<UiAtoButtonProps> = (props) => (
  <UiAtoButton {...props}>Click me</UiAtoButton>
)

export const standard = template.bind({})
standard.args = { href: '/' }
