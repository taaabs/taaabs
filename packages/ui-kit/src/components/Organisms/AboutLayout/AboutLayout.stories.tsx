import { Meta, Story } from '@storybook/react'
import { AboutLayout, AboutLayoutProps } from './AboutLayout'
import { uiAboutLayoutPropsData } from './AboutLayout.data'

export default {
  title: 'Layouts/AboutLayout',
  component: AboutLayout,
} as Meta

const Template: Story<AboutLayoutProps> = (props) => (
  <AboutLayout {...props}>body</AboutLayout>
)
export const standard = Template.bind({})
standard.args = uiAboutLayoutPropsData
