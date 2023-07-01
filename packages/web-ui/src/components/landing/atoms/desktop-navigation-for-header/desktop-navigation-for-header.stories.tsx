import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { DesktopNavigationForHeader } from './desktop-navigation-for-header'

export default {
  component: DesktopNavigationForHeader,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <DesktopNavigationForHeader
        navigationItems={[
          { label: 'Pricing', href: '/', isActive: false },
          { label: 'Help', href: '/', isActive: true },
          { label: 'Forum', href: '/', isActive: false },
        ]}
      />
    </StorybookMargin>
  )
}
