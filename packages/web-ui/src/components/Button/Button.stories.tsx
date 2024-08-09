import { StoryFn, Meta } from '@storybook/react'
import { Button } from './Button'

export default {
  component: Button,
  argTypes: {
    on_click: { action: 'clicked' },
  },
} as Meta

const Template: StoryFn<Button.Props> = (args) => <Button {...args} />

export const Default = Template.bind({})
const default_args: Button.Props = {
  children: 'Default Button',
}
Default.args = default_args

export const Small = Template.bind({})
const small_args: Button.Props = {
  size: 'small',
  children: 'Small Button',
}
Small.args = small_args

export const Medium = Template.bind({})
const medium_args: Button.Props = {
  size: 'medium',
  children: 'Medium Button',
}
Medium.args = medium_args

export const Large = Template.bind({})
const large_args: Button.Props = {
  size: 'large',
  children: 'Large Button',
}
Large.args = large_args

export const Danger = Template.bind({})
const danger_args: Button.Props = {
  is_danger: true,
  children: 'Danger Button',
}
Danger.args = danger_args

export const Disabled = Template.bind({})
const disabled_args: Button.Props = {
  is_disabled: true,
  children: 'Disabled Button',
}
Disabled.args = disabled_args

export const WithLink = Template.bind({})
const with_link_args: Button.Props = {
  href: '/some-link',
  children: 'Link Button',
}
WithLink.args = with_link_args

export const SubmitType = Template.bind({})
const submit_type_args: Button.Props = {
  type: 'submit',
  children: 'Submit Button',
}
SubmitType.args = submit_type_args
