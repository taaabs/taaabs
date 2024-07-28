import { StoryFn, Meta } from '@storybook/react'
import { Header } from './Header'
import { StorybookMargin } from '@web-ui/helpers/storybook'

export default {
  component: Header,
} as Meta

const Template: StoryFn<Header.Props> = (args) => (
  <StorybookMargin>
    <Header {...args} />
  </StorybookMargin>
)

export const Default = Template.bind({})
const default_args: Header.Props = {
  title: 'Title',
  on_close: () => alert('Close button clicked'),
}
Default.args = default_args

export const WithChildren = Template.bind({})
const with_children_args: Header.Props = {
  ...default_args,
  children: <div>slot</div>,
}
WithChildren.args = with_children_args
