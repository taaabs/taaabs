import { Ui } from '@/index'
import { uiLayoutLandingPropsData } from '@/components/Layouts/LayoutLanding/LayoutLanding.data'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'pages/landing/home',
} as Meta

const template: Story = () => (
  <Ui.Layouts.LayoutLanding {...uiLayoutLandingPropsData}>
    <Ui.Atoms.Spacer size="large" />
    <Ui.Organisms.Landing.Hero {...Ui.Organisms.Landing.HeroPropsData} />
    <Ui.Atoms.Spacer size="large" />
    <Ui.Organisms.Landing.FeatureGrid
      {...Ui.Organisms.Landing.FeatureGridPropsData}
    />
    <Ui.Atoms.Spacer size="large" />
  </Ui.Layouts.LayoutLanding>
)

export const standard = template.bind({})
