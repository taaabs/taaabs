import { Margin } from '@/helpers/Margin'
import { Meta, Story } from '@storybook/react'
import { UiAtoButton, UiAtoButtonProps } from './UiAtoButton'

export default {
  title: 'Atoms/UiAtoButton',
  component: UiAtoButton,
} as Meta

const template: Story<UiAtoButtonProps> = (props) => (
  <Margin>
    <UiAtoButton {...props}>Click me</UiAtoButton>
  </Margin>
)

export const standard = template.bind({})
standard.args = { href: '/' }
