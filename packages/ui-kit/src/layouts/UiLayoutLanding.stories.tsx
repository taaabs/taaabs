import { Meta, Story } from '@storybook/react'
import { UiLayoutLanding, UiLayoutLandingProps } from './UiLayoutLanding'

export default {
  title: 'layouts/landing',
  component: UiLayoutLanding,
} as Meta

const Template: Story<UiLayoutLandingProps> = (props) => (
  <UiLayoutLanding {...props}>body</UiLayoutLanding>
)
export const standard = Template.bind({})
standard.args = {
  logIn: { label: 'Log in', onClick: () => {} },
  getStarted: { label: 'Get started', onClick: () => {} },
}
