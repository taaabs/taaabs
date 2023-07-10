import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { NavigationForHeader } from './navigation-for-header'

export default {
  component: NavigationForHeader,
}

const navigation: NavigationForHeader.Props['navigation'] = [
  { label: 'Lorem', href: '/lorem', isActive: true },
  { label: 'Lorem', href: '/ipsum', isActive: false },
]

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ height: '60px' }}>
        <NavigationForHeader navigation={navigation} />
      </div>
    </StorybookMargin>
  )
}
