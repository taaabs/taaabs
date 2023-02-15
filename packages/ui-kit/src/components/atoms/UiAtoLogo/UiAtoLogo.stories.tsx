import { StorybookMargin } from '@/storybook-helpers/components/StorybookMargin'
import { StorybookSpacer } from '@/storybook-helpers/components/StorybookSpacer'
import { Meta, Story } from '@storybook/react'
import { UiAtoLogo, UiAtoLogoProps } from './UiAtoLogo'

export default {
  title: 'Atoms/UiAtoLogo',
  component: UiAtoLogo,
} as Meta

const template: Story = () => (
  <StorybookMargin>
    <div style={{ background: '#ddd', padding: '4rem' }}>
      <UiAtoLogo type="simple" />
      <StorybookSpacer />
      <UiAtoLogo type="wide" />
    </div>
  </StorybookMargin>
)

export const standard = template.bind({})
