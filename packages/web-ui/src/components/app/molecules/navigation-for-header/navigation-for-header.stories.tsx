import { Helpers } from '@web-ui'
import { NavigationForHeader } from './navigation-for-header'

export default {
  component: NavigationForHeader,
}

const navigation: NavigationForHeader.Props['navigation'] = [
  { label: 'Lorem', href: '/lorem', is_active: true },
  { label: 'Lorem', href: '/ipsum', is_active: false },
]

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <div style={{ height: '60px' }}>
        <NavigationForHeader navigation={navigation} />
      </div>
    </Helpers.Storybook.StorybookMargin>
  )
}
