import { UiAtoSpacer } from '@/components/atoms/UiAtoSpacer'
import { UiOrgLandingFeatureGrid } from '@/components/organisms/UiOrgLandingFeatureGrid'
import { uiOrgLandingFeatureGridPropsData } from '@/components/organisms/UiOrgLandingFeatureGrid/UiOrgLandingFratureGrid.data'
import { UiOrgLandingHero } from '@/components/organisms/UiOrgLandingHero/UiOrgLandingHero'
import { uiOrgLandingHeroPropsData } from '@/components/organisms/UiOrgLandingHero/UiOrgLandingHero.data'
import { UiLayoutLanding } from '@/layouts/UiLayoutLanding'
import { uiLayoutLandingPropsData } from '@/layouts/UiLayoutLanding/UiLayoutLanding.data'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'pages/landing/home',
} as Meta

const template: Story = () => (
  <UiLayoutLanding {...uiLayoutLandingPropsData}>
    <UiAtoSpacer />
    <UiOrgLandingHero {...uiOrgLandingHeroPropsData} />
    <UiAtoSpacer />
    <UiOrgLandingFeatureGrid {...uiOrgLandingFeatureGridPropsData} />
    <UiAtoSpacer />
  </UiLayoutLanding>
)

export const standard = template.bind({})
