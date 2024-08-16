import { StoryFn } from '@storybook/react'
import { Wrapper } from './Wrapper'

export default {
  component: Wrapper,
}

const Template: StoryFn = (args) => <Wrapper {...args}>Content</Wrapper> 

export const Default = Template.bind({})

export const LandingPage = Template.bind({})
const landing_page_args: Wrapper.Props = {
  is_landing_page: true,
}
LandingPage.args = landing_page_args