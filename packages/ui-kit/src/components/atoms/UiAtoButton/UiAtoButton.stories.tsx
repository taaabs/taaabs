import { StorybookMargin } from '@/storybook-helpers/components/StorybookMargin'
import { Meta, Story } from '@storybook/react'
import { UiAtoButton, UiAtoButtonProps } from './UiAtoButton'

export default {
  title: 'Atoms/UiAtoButton',
  component: UiAtoButton,
} as Meta

const template: Story<UiAtoButtonProps> = (props) => (
  <StorybookMargin>
    <UiAtoButton {...props}>Click me</UiAtoButton>
  </StorybookMargin>
)

export const standard = template.bind({})
standard.args = { href: '/' }
