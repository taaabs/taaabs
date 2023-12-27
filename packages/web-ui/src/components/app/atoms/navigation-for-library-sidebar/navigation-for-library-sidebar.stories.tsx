import { StorybookMargin } from '@web-ui/helpers/storybook'
import { NavigationForLibrarySidebar } from './navigation-for-library-sidebar'

export default {
  component: NavigationForLibrarySidebar,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <NavigationForLibrarySidebar
        navigation_items={[
          { label: 'All bookmarks', on_click: () => {}, is_active: true },
          { label: 'Categories', on_click: () => {}, is_active: false },
        ]}
      />
    </StorybookMargin>
  )
}
