import { UiAtoSpacer } from '@/components/atoms/UiAtoSpacer'
import { UiOrgLandingFeatureGrid } from '@/components/organisms/UiOrgLandingFeatureGrid'
import { uiOrgLandingFeatureGridProps } from '@/components/organisms/UiOrgLandingFeatureGrid/UiOrgLandingFeatureGrid.stories'
import { UiOrgLandingHero } from '@/components/organisms/UiOrgLandingHero/UiOrgLandingHero'
import { uiOrgLandingHeroProps } from '@/components/organisms/UiOrgLandingHero/UiOrgLandingHero.stories'
import { UiLayoutLanding } from '@/layouts/UiLayoutLanding'
import { uiLayoutLandingPropsData } from '@/layouts/UiLayoutLanding/UiLayoutLanding.stories'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'pages/landing/home',
} as Meta

const template: Story = () => (
  <UiLayoutLanding {...uiLayoutLandingPropsData}>
    <UiAtoSpacer />
    <UiOrgLandingHero {...uiOrgLandingHeroProps} />
    <UiAtoSpacer />
    <UiOrgLandingFeatureGrid {...uiOrgLandingFeatureGridProps} />
    <UiAtoSpacer />
  </UiLayoutLanding>
)

export const standard = template.bind({})
