import { UiAtoWrapper } from '@/components/atoms/UiAtoWrapper'
import { Margin } from '@/helpers/Margin'
import { Meta, Story } from '@storybook/react'
import { UiOrgLandingHero, UiOrgLandingHeroProps } from './UiOrgLandingHero'

export default {
  title: 'Organisms/UiOrgLandingHero',
  component: UiOrgLandingHero,
} as Meta

const template: Story<UiOrgLandingHeroProps> = (props) => (
  <UiOrgLandingHero {...props}></UiOrgLandingHero>
)

export const standard = template.bind({})
standard.args = { text: 'Meet Taaabs, bookmark manager that makes the web organized.' }
