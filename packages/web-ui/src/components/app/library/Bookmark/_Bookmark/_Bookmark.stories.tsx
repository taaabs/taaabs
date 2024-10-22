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
      is_parsed: true,
    },
    {
      url: 'https://example.com/link2',
      saves: 5,
      menu_slot: <div>Menu slot 2</div>,
      is_pinned: false,
      open_snapshot: true,
      is_public: false,
      is_parsed: false,
    },
  ],
  on_link_click: mock_on_link_click,
  on_reading_mode_click: mock_on_reading_mode_click,
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
  cover:
    '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',
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
