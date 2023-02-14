import { Divider } from '@/helpers/Divider'
import { Margin } from '@/helpers/Margin'
import { Meta, Story } from '@storybook/react'
import { UiAtoLogo, UiAtoLogoProps } from './UiAtoLogo'

export default {
  title: 'Atoms/UiAtoLogo',
  component: UiAtoLogo,
} as Meta

const template: Story = () => (
  <Margin>
    <UiAtoLogo type="simple" />
    <Divider />
    <UiAtoLogo type="wide" />
  </Margin>
)

export const standard = template.bind({})
