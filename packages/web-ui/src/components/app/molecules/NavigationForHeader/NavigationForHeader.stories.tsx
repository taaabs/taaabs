import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import {
  NavigationForHeader,
  NavigationForHeaderTypes,
} from './NavigationForHeader'

export default {
  component: NavigationForHeader,
}

const navigation: NavigationForHeaderTypes.Props['navigation'] = [
  { label: 'Lorem', href: '/lorem', isActive: true },
  { label: 'Ipsum', href: '/ipsum', isActive: false },
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
