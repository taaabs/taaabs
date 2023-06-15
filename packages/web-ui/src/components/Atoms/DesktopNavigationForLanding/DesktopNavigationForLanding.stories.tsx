import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { DesktopNavigationForLanding } from './DesktopNavigationForLanding'

export default {
  component: DesktopNavigationForLanding,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <DesktopNavigationForLanding
        navigationItems={[
          { label: 'Pricing', href: '/', isActive: false },
          { label: 'Help', href: '/', isActive: true },
          { label: 'Forum', href: '/', isActive: false },
        ]}
      />
    </StorybookMargin>
  )
}
