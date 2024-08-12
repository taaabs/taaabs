import { StoryFn } from '@storybook/react'
import { SavesContent } from './SavesContent'
import { StorybookMargin } from '@web-ui/helpers/storybook'

export default {
  component: SavesContent,
}

const Template: StoryFn<typeof SavesContent> = (args) => (
  <StorybookMargin>
    <SavesContent {...args} />
  </StorybookMargin>
)

export const Default = Template.bind({})
const default_args: SavesContent.Props = {
  users: [
    {
      username: 'user1',
      display_name: 'User One',
      is_following: false,
      saved_at: new Date('2024-08-10'),
    },
    {
      username: 'user2',
      display_name: 'User Two',
      is_following: true,
      saved_at: new Date('2024-05-10'),
    },
  ],
  locale: 'en',
  show_follow_buttons: true,
  app_url: 'https://example.com',
  on_follow_click: () => {},
  translations: {
    follow: 'Follow',
    unfollow: 'Unfollow',
  },
}
Default.args = default_args

export const NoFollowButtons = Template.bind({})
const no_follow_buttons_args: SavesContent.Props = {
  ...default_args,
  show_follow_buttons: false,
}
NoFollowButtons.args = no_follow_buttons_args

export const EmptyUsers = Template.bind({})
const empty_users_args: SavesContent.Props = {
  ...default_args,
  users: [],
}
EmptyUsers.args = empty_users_args
