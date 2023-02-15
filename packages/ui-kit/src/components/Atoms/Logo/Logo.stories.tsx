import { StorybookMargin } from '@/helpers/components/StorybookMargin'
import { StorybookSpacer } from '@/helpers/components/StorybookSpacer'
import { Meta, Story } from '@storybook/react'
import { Logo, LogoProps } from './Logo'

export default {
  title: 'Atoms/Logo',
  component: Logo,
} as Meta

const template: Story = () => (
  <StorybookMargin>
    <div style={{ background: '#ddd', padding: '4rem' }}>
      <Logo type="simple" />
      <StorybookSpacer />
      <Logo type="wide" />
    </div>
  </StorybookMargin>
)

export const standard = template.bind({})
