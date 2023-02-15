import { Meta, Story } from '@storybook/react'
import { UiLayoutLanding, UiLayoutLandingProps } from './UiLayoutLanding'

export const uiLayoutLandingPropsData: UiLayoutLandingProps = {
  logIn: { label: 'Log in', onClick: () => {} },
  getStarted: { label: 'Get started', onClick: () => {} },
}

export default {
  title: 'layouts/UiLayoutLanding',
  component: UiLayoutLanding,
} as Meta

const Template: Story<UiLayoutLandingProps> = (props) => (
  <UiLayoutLanding {...props}>body</UiLayoutLanding>
)
export const standard = Template.bind({})
standard.args = uiLayoutLandingPropsData
