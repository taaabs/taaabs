import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { NavigationForLanding } from './NavigationForLanding'

export default {
  component: NavigationForLanding,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <NavigationForLanding
        navigationItems={[
          { label: 'Pricing', href: '/', isActive: false },
          { label: 'Help', href: '/', isActive: true },
          { label: 'Forum', href: '/', isActive: false },
        ]}
      />
    </StorybookMargin>
  )
}
