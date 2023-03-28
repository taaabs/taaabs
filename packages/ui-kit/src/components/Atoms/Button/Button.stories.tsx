import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Meta, Story } from '@storybook/react'
import { Button } from './Button'

export default {
  title: 'Atoms/Button',
  component: Button,
} as Meta

export const sizes: Story = () => (
  <StorybookMargin>
    Small:
    <br />
    <br />
    <Button size="small">Click me!</Button>
    <StorybookSpacer />
    Default:
    <br />
    <br />
    <Button>Click me!</Button>
    <StorybookSpacer />
    Large:
    <br />
    <br />
    <Button size="large">Click me!</Button>
  </StorybookMargin>
)
