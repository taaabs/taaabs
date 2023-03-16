import { Ui } from '@/index'
import { uiAboutLayoutPropsData } from '@/components/Organisms/AboutLayout/AboutLayout.data'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'pages/landing/home',
} as Meta

const template: Story = () => (
  <Ui.Organisms.AboutLayout {...uiAboutLayoutPropsData}>
    <Ui.Atoms.Spacer size="large" />
    <Ui.Organisms.Landing.Sections.Hero {...Ui.Organisms.Landing.Sections.HeroPropsData} />
    <Ui.Atoms.Spacer size="large" />
    <Ui.Organisms.Landing.Sections.FeatureGrid
      {...Ui.Organisms.Landing.Sections.FeatureGridPropsData}
    />
    <Ui.Atoms.Spacer size="large" />
  </Ui.Organisms.AboutLayout>
)

export const standard = template.bind({})
