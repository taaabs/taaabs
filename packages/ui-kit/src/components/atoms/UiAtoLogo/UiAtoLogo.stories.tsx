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
    <div style={{ background: '#ddd', padding: '4rem' }}>
      <UiAtoLogo type="simple" />
      <Divider />
      <UiAtoLogo type="wide" />
    </div>
  </Margin>
)

export const standard = template.bind({})
