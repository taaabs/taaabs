import { Meta, Story } from '@storybook/react'
import { Hero, HeroProps } from './Hero'
import { HeroPropsData } from './Hero.data'

export default {
  title: 'Organisms/Landing/Hero',
  component: Hero,
} as Meta

const template: Story<HeroProps> = (props) => (
  <Hero {...props}></Hero>
)

export const standard = template.bind({})
standard.args = HeroPropsData
