import { Meta, StoryFn } from '@storybook/react'
import { _FeedItem } from './_FeedItem'
import { StorybookMargin } from '@web-ui/helpers/storybook'

export default {
  component: _FeedItem,
} as Meta

const mock_on_click = () => {
  console.log('Bookmark clicked')
}

const base_args: _FeedItem.Props = {
  locale: 'en',
  title: 'Example Bookmark',
  url: '',
  date: new Date('2023-03-01T12:00:00.000Z'),
  created_at: new Date('2023-03-01T12:00:00.000Z'),
  density: 'default',
  is_compact: false,
  on_click: mock_on_click,
  favicon_host: 'http://localhost:4000/v1/favicons',
  menu_slot: <div>Menu slot</div>,
  creator: {
    username: 'alicia',
    display_name: 'Alicia Keys',
    total_bookmarks: 22000,
    is_followed: false,
  },
  translations: {
    bookmarks: 'bookmarks',
    save: 'Save',
  },
}

const Template: StoryFn<_FeedItem.Props> = (args) => (
  <StorybookMargin>
    <_FeedItem {...args} />
  </StorybookMargin>
)

export const Default = Template.bind({})
Default.args = {
  ...base_args,
}

export const Compact = Template.bind({})
Compact.args = {
  ...base_args,
  density: 'compact',
  is_compact: true,
}
