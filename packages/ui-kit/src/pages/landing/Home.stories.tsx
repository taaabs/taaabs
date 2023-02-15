import { Atoms, Organisms } from '@/components'
import { LayoutLanding } from '@/layouts/LayoutLanding'
import { uiLayoutLandingPropsData } from '@/layouts/LayoutLanding/LayoutLanding.data'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'pages/landing/home',
} as Meta

const template: Story = () => (
  <LayoutLanding {...uiLayoutLandingPropsData}>
    <Atoms.Spacer size="large" />
    <Organisms.Landing.Hero {...Organisms.Landing.HeroPropsData} />
    <Atoms.Spacer size="large" />
    <Organisms.Landing.FeatureGrid
      {...Organisms.Landing.FeatureGridPropsData}
    />
    <Atoms.Spacer size="large" />
  </LayoutLanding>
)

export const standard = template.bind({})
