import { StorybookMargin } from '@web-ui/helpers/storybook'
import { BookmarksSkeleton } from './BookmarksSkeleton'

export default {
  component: BookmarksSkeleton,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ display: 'flex' }}>
        <BookmarksSkeleton />
      </div>
    </StorybookMargin>
  )
}