import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { StorybookSpacer } from '@/helpers/components/StorybookSpacer'
import { Meta, Story } from '@storybook/react'
import { Button } from './Button'
import { ButtonTypes } from './Button.types'

export default {
  title: 'Atoms/Button',
  component: Button,
} as Meta

export const sizes: Story = () => (
  <StorybookMargin>
    Default:
    <br />
    <br />
    <Button>Click me!</Button>
    <StorybookSpacer />
    Large:
    <br />
    <br />
    <Button size={ButtonTypes.Size.LARGE}>Click me!</Button>
  </StorybookMargin>
)
