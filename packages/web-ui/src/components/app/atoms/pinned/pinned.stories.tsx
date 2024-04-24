import { StorybookMargin } from '@web-ui/helpers/storybook'
import { Pinned } from './pinned'

export default {
  component: Pinned,
}

export const Primary = () => (
  <StorybookMargin>
    <Pinned
      is_draggable={true}
      on_middle_click={() => {}}
      selected_archived={false}
      selected_starred={false}
      selected_tags={[]}
      selected_unread={false}
      items={[
        {
          url: 'https://github.com/1',
          title: 'Example lorem ipsum lorem ipsum 1',
          bookmark_id: 0,
          created_at: new Date(),
          is_unread: false,
          stars: 0,
          tags: [],
        },
        {
          url: 'https://github.com/2',
          title: 'Example lorem ipsum 2',
          bookmark_id: 0,
          created_at: new Date(),
          is_unread: false,
          stars: 0,
          tags: [],
        },
        {
          url: 'https://github.com/3',
          title: 'Example lorem ipsum 3',
          stars: 2,
          is_unread: true,
          bookmark_id: 0,
          created_at: new Date(),
          tags: [],
        },
        {
          url: 'https://github.com/4',
          title: 'Example lorem ipsum 4',
          bookmark_id: 0,
          created_at: new Date(),
          is_unread: false,
          stars: 0,
          tags: [],
        },
        {
          url: 'https://github.com/5',
          title: 'Example lorem ipsum 5',
          stars: 5,
          bookmark_id: 0,
          created_at: new Date(),
          is_unread: false,
          tags: [],
        },
      ]}
      on_change={() => {}}
      on_click={() => {}}
      favicon_host="http://localhost:4000/v1/favicons"
      translations={{
        nothing_pinned: 'lorem ipsum',
      }}
    />
  </StorybookMargin>
)
