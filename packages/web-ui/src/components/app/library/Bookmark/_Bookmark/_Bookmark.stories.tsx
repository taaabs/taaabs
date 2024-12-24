import { Meta, StoryFn } from '@storybook/react'
import { _Bookmark } from './_Bookmark'
import { StorybookMargin } from '@web-ui/helpers/storybook'

export default {
  component: _Bookmark,
} as Meta

const mock_on_saves_click = () => {
  console.log('Saves clicked')
}
const mock_on_video_player_click = () => {
  console.log('Saves clicked')
}
const mock_on_click = () => {
  console.log('Bookmark clicked')
}
const mock_on_tag_click = (tag_id: number) => {
  console.log('Tag clicked:', tag_id)
}
const mock_on_tag_delete_click = (tag_id: number) => {
  console.log('Tag delete clicked:', tag_id)
}
const mock_on_tag_rename_click = (tag_id: number) => {
  console.log('Tag rename clicked:', tag_id)
}
const mock_on_tags_order_change = (tags: _Bookmark.Props['tags']) => {
  console.log('Tags order changed:', tags)
}
const mock_on_selected_tag_click = (tag_id: number) => {
  console.log('Selected tag clicked:', tag_id)
}
const mock_on_get_points_given_click = () => {
  console.log('Get points given clicked')
}
const mock_on_give_point_click = (points: number) => {
  console.log('Give point clicked:', points)
}
const mock_on_modify_tags_click = () => {
  console.log('Modify tags clicked')
}
const mock_on_link_click = (url: string) => {
  console.log('Link clicked:', url)
}
const mock_on_reading_mode_click = (url: string) => {
  console.log('Reading mode clicked:', url)
}
const mock_on_link_middle_click = () => {
  console.log('Link middle clicked')
}
const mock_on_new_tab_click = (url: string) => {
  console.log('New tab clicked:', url)
}

const base_args: _Bookmark.Props = {
  locale: 'en',
  is_search_result: false,
  bookmark_id: 1,
  updated_at: '2023-03-01T12:00:00.000Z',
  is_public: true,
  points: 10,
  points_given: 5,
  title: 'Example Bookmark',
  note: 'This is an example bookmark',
  date: new Date('2023-03-01T12:00:00.000Z'),
  created_at: new Date('2023-03-01T12:00:00.000Z'),
  density: 'default',
  is_compact: false,
  library_url: 'https://example.com/library',
  on_saves_click: mock_on_saves_click,
  on_video_player_click: mock_on_video_player_click,
  on_tag_click: mock_on_tag_click,
  on_tag_delete_click: mock_on_tag_delete_click,
  on_tag_rename_click: mock_on_tag_rename_click,
  on_tags_order_change: mock_on_tags_order_change,
  on_selected_tag_click: mock_on_selected_tag_click,
  on_get_points_given_click: mock_on_get_points_given_click,
  on_give_point_click: mock_on_give_point_click,
  on_modify_tags_click: mock_on_modify_tags_click,
  tags: [
    { id: 1, is_public: true, name: 'Tag 1', yields: 10 },
    { id: 2, is_public: false, name: 'Tag 2', yields: 5 },
  ],
  search_params: '',
  on_click: mock_on_click,
  is_unsorted: false,
  stars: 3,
  links: [
    {
      url: 'https://example.com/site/link1',
      site_path: 'site',
      saves: 10,
      menu_slot: <div>Menu slot 1</div>,
      is_pinned: true,
      open_snapshot: false,
      is_public: true,
    },
    {
      url: 'https://example.com/link2',
      saves: 5,
      menu_slot: <div>Menu slot 2</div>,
      is_pinned: false,
      open_snapshot: true,
      is_public: false,
    },
  ],
  on_link_click: mock_on_link_click,
  on_link_middle_click: mock_on_link_middle_click,
  on_new_tab_click: mock_on_new_tab_click,
  favicon_host: 'http://localhost:4000/v1/favicons',
  menu_slot: <div>Menu slot</div>,
  should_dim_visited_links: true,
  current_filter: '',
  on_tag_drag_start: () => {
    console.log('Tag drag started')
  },
  dragged_tag: { id: 1, name: 'Tag 1', yields: 10 },
  on_mouse_up: () => {
    console.log('Mouse up')
  },
  translations: {
    rename: 'Rename',
    delete: 'Delete',
  },
}

const Template: StoryFn<_Bookmark.Props> = (args) => (
  <StorybookMargin>
    <_Bookmark {...args} />
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

export const Unsorted = Template.bind({})
Unsorted.args = {
  ...base_args,
  is_unsorted: true,
}

export const WithHighlights = Template.bind({})
WithHighlights.args = {
  ...base_args,
  highlights: [
    [8, 8],
    [36, 8],
  ],
}
