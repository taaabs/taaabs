import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { Meta, Story } from '@storybook/react'
import { Button, ButtonProps } from './Button'

export default {
  title: 'Atoms/Button',
  component: Button,
} as Meta

const template: Story<ButtonProps> = (props) => (
  <StorybookMargin>
    <Button {...props}>Click me</Button>
  </StorybookMargin>
)

export const standard = template.bind({})
standard.args = { href: '/' }
