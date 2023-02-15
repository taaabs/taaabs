import { Meta, Story } from '@storybook/react'
import { UiOrgLandingHero, UiOrgLandingHeroProps } from './UiOrgLandingHero'
import { uiOrgLandingHeroPropsData } from './UiOrgLandingHero.data'

export default {
  title: 'Organisms/UiOrgLandingHero',
  component: UiOrgLandingHero,
} as Meta

const template: Story<UiOrgLandingHeroProps> = (props) => (
  <UiOrgLandingHero {...props}></UiOrgLandingHero>
)

export const standard = template.bind({})
standard.args = uiOrgLandingHeroPropsData
