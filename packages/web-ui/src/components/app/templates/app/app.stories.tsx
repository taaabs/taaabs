import { loremIpsum } from '@web-ui/helpers/storybook/lorem-ipsum'
import { App } from './app'

export default {
  component: App,
}

export const Primary = () => (
  <App
    slot_AppHeaderDesktop={<>header desktop</>}
    slot_AppHeaderMobile={<>header mobile</>}
    slot_BottomNavigationBar={<>bottom navigation bar</>}
  >
    {loremIpsum.long}
  </App>
)
