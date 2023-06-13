import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import {
  NavigationForAppHeader,
  NavigationForAppHeaderTypes,
} from './NavigationForAppHeader'

export default {
  component: NavigationForAppHeader,
}

const navigation: NavigationForAppHeaderTypes.Props['navigation'] = [
  { label: 'Lorem', href: '/lorem', isActive: true },
  { label: 'Ipsum', href: '/ipsum', isActive: false },
]

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ height: '60px' }}>
        <NavigationForAppHeader navigation={navigation} />
      </div>
    </StorybookMargin>
  )
}
