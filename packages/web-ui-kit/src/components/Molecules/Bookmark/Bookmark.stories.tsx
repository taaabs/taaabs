import { Bookmark } from './Bookmark'
import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'

export default {
  component: Bookmark,
}

export const Primary = () => (
  <StorybookMargin>
    <Bookmark
      isStarred={false}
      visibility="public"
      page={{ title: 'x', description: 'x', url: 'https://example.com/test' }}
      added={new Date('2023-02-20')}
      addedFormat="timeAgo"
      infoBar={{ showArchived: false, showNSFW: true, showVisibility: true }}
    />
  </StorybookMargin>
)
