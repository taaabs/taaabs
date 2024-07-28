import { StoryFn, Meta, Args } from '@storybook/react'
import { Footer } from './Footer'
import { StorybookMargin } from '@web-ui/helpers/storybook'

export default {
  component: Footer,
} as Meta

const Template: StoryFn<Footer.Props> = (args) => (
  <StorybookMargin>
    <Footer {...args} />
  </StorybookMargin>
)

export const Default = Template.bind({})
const default_args: Footer.Props = {
  button_label: 'Submit',
  button_on_click: () => alert('Submit button clicked'),
  on_click_cancel: () => alert('Cancel button clicked'),
  translations: {
    cancel: 'Cancel',
  },
}
Default.args = default_args

export const WithChildren = Template.bind({})
const with_children_args: Footer.Props = {
  ...default_args,
  children: <div>Slot</div>,
}
WithChildren.args = with_children_args

export const Disabled = Template.bind({})
const disabled_args: Footer.Props = {
  ...default_args,
  is_disabled: true,
}
Disabled.args = disabled_args

export const Danger = Template.bind({})
const danger_args: Footer.Props = {
  ...default_args,
  button_label: 'Delete',
  is_danger: true,
}
Danger.args = danger_args
