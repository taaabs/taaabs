import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { StorybookSpacer } from '@/helpers/components/StorybookSpacer'
import { Meta, Story } from '@storybook/react'
import { Button } from './Button'
import { ButtonTypes } from './Button.types'

export default {
  title: 'Atoms/Button',
  component: Button,
} as Meta

const template: Story<ButtonTypes.Props> = (props) => (
  <StorybookMargin>
    Default:
    <br/>
    <br/>
    <Button {...props}>Click me!</Button>
    <StorybookSpacer />
    Large:
    <br/>
    <br/>
    <Button {...props} size={ButtonTypes.Size.LARGE}>Click me!</Button>
  </StorybookMargin>
)

export const standard = template.bind({})
standard.args = { href: '/' }
