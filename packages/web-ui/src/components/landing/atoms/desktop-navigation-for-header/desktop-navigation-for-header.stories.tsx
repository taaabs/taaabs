import { Helpers } from '@web-ui'
import { DesktopNavigationForHeader } from './desktop-navigation-for-header'

export default {
  component: DesktopNavigationForHeader,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <DesktopNavigationForHeader
        navigation_items={[
          { label: 'Pricing', href: '/', is_active: false },
          { label: 'Help', href: '/', is_active: true },
          { label: 'Forum', href: '/', is_active: false },
        ]}
      />
    </Helpers.Storybook.StorybookMargin>
  )
}
