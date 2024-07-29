import { StoryFn, Meta } from '@storybook/react'
import { SavingStatus } from './SavingStatus'
import { StorybookMargin } from '@web-ui/helpers/storybook'

export default {
  component: SavingStatus,
  argTypes: {
    is_saving: {
      control: 'boolean',
    },
  },
} as Meta<SavingStatus.Props>;

const Template: StoryFn<typeof SavingStatus> = (args) => (
  <StorybookMargin>
    <SavingStatus {...args} />
  </StorybookMargin>
)

export const Default = Template.bind({})
const default_args: SavingStatus.Props = {
  is_saving: true,
  dictionary: {
    saving: 'Saving...',
    saved: 'Saved',
  },
}
Default.args = default_args