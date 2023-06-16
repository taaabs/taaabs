import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { HeaderDesktopNavigation } from './HeaderDesktopNavigation'

export default {
  component: HeaderDesktopNavigation,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <HeaderDesktopNavigation
        navigationItems={[
          { label: 'Pricing', href: '/', isActive: false },
          { label: 'Help', href: '/', isActive: true },
          { label: 'Forum', href: '/', isActive: false },
        ]}
      />
    </StorybookMargin>
  )
}
