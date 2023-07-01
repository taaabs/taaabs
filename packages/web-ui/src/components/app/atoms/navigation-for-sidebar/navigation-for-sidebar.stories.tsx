import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { NavigationForSidebar } from './navigation-for-sidebar'

export default {
  component: NavigationForSidebar,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <NavigationForSidebar
        navigationItems={[
          { label: 'All bookmarks', onClick: () => {}, isActive: true },
          { label: 'Categories', onClick: () => {}, isActive: false },
        ]}
      />
    </StorybookMargin>
  )
}
