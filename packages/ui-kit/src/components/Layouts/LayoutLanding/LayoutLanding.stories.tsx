import { Meta, Story } from '@storybook/react'
import { LayoutLanding, LayoutLandingProps } from './LayoutLanding'
import { uiLayoutLandingPropsData } from './LayoutLanding.data'

export default {
  title: 'Layouts/LayoutLanding',
  component: LayoutLanding,
} as Meta

const Template: Story<LayoutLandingProps> = (props) => (
  <LayoutLanding {...props}>body</LayoutLanding>
)
export const standard = Template.bind({})
standard.args = uiLayoutLandingPropsData
