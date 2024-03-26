import { StorybookMargin } from '@web-ui/helpers/storybook'
import { Pinned } from './pinned'

export default {
  component: Pinned,
}

export const Primary = () => (
  <StorybookMargin>
    <Pinned
      items={[
        {
          url: 'https://github.com/1',
          title: 'Example lorem ipsum lorem ipsum 1',
        },
        { url: 'https://github.com/2', title: 'Example lorem ipsum 2' },
        {
          url: 'https://github.com/3',
          title: 'Example lorem ipsum 3',
          stars: 2,
          is_unread: true,
        },
        { url: 'https://github.com/4', title: 'Example lorem ipsum 4' },
        {
          url: 'https://github.com/5',
          title: 'Example lorem ipsum 5',
          stars: 5,
        },
      ]}
      on_change={() => {}}
      on_link_click={() => {}}
      favicon_host="http://localhost:4000/v1/favicons"
      header_title="Pinned"
    />
  </StorybookMargin>
)
