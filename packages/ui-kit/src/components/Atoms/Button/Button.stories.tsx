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
    <Button {...props}>I'm default</Button>
    <StorybookSpacer />
    <Button {...props} size={ButtonTypes.Size.LARGE}>
      I'm large
    </Button>
  </StorybookMargin>
)

export const standard = template.bind({})
standard.args = { href: '/' }
