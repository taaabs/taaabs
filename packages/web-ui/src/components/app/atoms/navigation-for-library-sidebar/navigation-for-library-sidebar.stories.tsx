import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { NavigationForLibrarySidebar } from './navigation-for-library-sidebar'

export default {
  component: NavigationForLibrarySidebar,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <NavigationForLibrarySidebar
        navigationItems={[
          { label: 'All bookmarks', onClick: () => {}, isActive: true },
          { label: 'Categories', onClick: () => {}, isActive: false },
        ]}
      />
    </StorybookMargin>
  )
}
