import { StorybookMargin } from '@web-ui/helpers/storybook'
import { Pinned } from './pinned'

export default {
  component: Pinned,
}

export const Primary = () => (
  <StorybookMargin>
    <Pinned
      is_draggable_={true}
      on_middle_click_={() => {}}
      selected_archived_={false}
      selected_starred_={false}
      selected_tags_={[]}
      selected_unread_={false}
      items_={[
        {
          url_: 'https://github.com/1',
          title_: 'Example lorem ipsum lorem ipsum 1',
          bookmark_id_: 0,
          created_at_: new Date(),
          is_unread_: false,
          stars_: 0,
          tags_: [],
        },
        {
          url_: 'https://github.com/2',
          title_: 'Example lorem ipsum 2',
          bookmark_id_: 0,
          created_at_: new Date(),
          is_unread_: false,
          stars_: 0,
          tags_: [],
        },
        {
          url_: 'https://github.com/3',
          title_: 'Example lorem ipsum 3',
          stars_: 2,
          is_unread_: true,
          bookmark_id_: 0,
          created_at_: new Date(),
          tags_: [],
        },
        {
          url_: 'https://github.com/4',
          title_: 'Example lorem ipsum 4',
          bookmark_id_: 0,
          created_at_: new Date(),
          is_unread_: false,
          stars_: 0,
          tags_: [],
        },
        {
          url_: 'https://github.com/5',
          title_: 'Example lorem ipsum 5',
          stars_: 5,
          bookmark_id_: 0,
          created_at_: new Date(),
          is_unread_: false,
          tags_: [],
        },
      ]}
      on_change_={() => {}}
      on_click_={() => {}}
      favicon_host_="http://localhost:4000/v1/favicons"
      translations_={{
        nothing_pinned_: 'lorem ipsum',
      }}
    />
  </StorybookMargin>
)
