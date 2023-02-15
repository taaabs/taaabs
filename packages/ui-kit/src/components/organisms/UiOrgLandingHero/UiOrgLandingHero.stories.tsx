import { Meta, Story } from '@storybook/react'
import { UiOrgLandingHero, UiOrgLandingHeroProps } from './UiOrgLandingHero'

export const uiOrgLandingHeroProps: UiOrgLandingHeroProps = {
  text: 'Meet Taaabs, bookmark manager that makes the web organized.',
}

export default {
  title: 'Organisms/UiOrgLandingHero',
  component: UiOrgLandingHero,
} as Meta

const template: Story<UiOrgLandingHeroProps> = (props) => (
  <UiOrgLandingHero {...props}></UiOrgLandingHero>
)

export const standard = template.bind({})
standard.args = uiOrgLandingHeroProps
