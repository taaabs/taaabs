import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { DesktopNavigationForHeader } from './desktop-navigation-for-header'

export default {
  component: DesktopNavigationForHeader,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <DesktopNavigationForHeader
        navigation_items={[
          { label: 'Pricing', href: '/', is_active: false },
          { label: 'Help', href: '/', is_active: true },
          { label: 'Forum', href: '/', is_active: false },
        ]}
      />
    </StorybookMargin>
  )
}
