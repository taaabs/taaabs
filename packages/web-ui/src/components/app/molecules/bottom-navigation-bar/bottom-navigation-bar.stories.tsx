import { BottomNavigationBar } from './bottom-navigation-bar'
import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'

export default {
  component: BottomNavigationBar,
}

export const Primary = () => (
  <StorybookMargin>
    <BottomNavigationBar
      items={[
        {
          icon_variant: 'HOME',
          icon_variant_active: 'HOME',
          label: 'Home',
          on_click: () => {},
          is_active: false,
        },
        {
          icon_variant: 'BOOKMARK',
          icon_variant_active: 'BOOKMARK',
          label: 'Bookmarks',
          on_click: () => {},
          is_active: true,
        },
        {
          icon_variant: 'NOTIFICATIONS',
          icon_variant_active: 'NOTIFICATIONS',
          label: 'Notifications',
          on_click: () => {},
          is_active: false,
        },
      ]}
    />
    <StorybookSpacer />
    <BottomNavigationBar
      items={[
        {
          icon_variant: 'BOOKMARK',
          icon_variant_active: 'BOOKMARK_FILLED',
          label: 'Bookmarks',
          on_click: () => {},
          is_active: true,
        },
        {
          icon_variant: 'ACTIVITY',
          icon_variant_active: 'ACTIVITY',
          label: 'Activity',
          on_click: () => {},
          is_active: false,
        },
      ]}
    />
  </StorybookMargin>
)
