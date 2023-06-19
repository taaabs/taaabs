import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { NavigationForSidebar } from './NavigationForSidebar'

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
