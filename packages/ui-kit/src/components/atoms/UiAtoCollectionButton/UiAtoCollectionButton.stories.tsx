import { Margin } from '@/helpers/Margin'
import { Meta, Story } from '@storybook/react'
import { UiAtoCollectionButton, UiAtoCollectionButtonProps } from './UiAtoCollectionButton'

export default {
  title: 'Atoms/UiAtoCollectionButton',
  component: UiAtoCollectionButton,
} as Meta

const template: Story<UiAtoCollectionButtonProps> = (props) => (
  <Margin>
    <UiAtoCollectionButton {...props}>Click me</UiAtoCollectionButton>
  </Margin>
)

export const standard = template.bind({})
standard.args = { href: '/' }
