import { loremIpsum } from '@web-ui/helpers/storybook/lorem-ipsum'
import { App } from './app'

export default {
  component: App,
}

export const Primary = () => (
  <App
    slotAppHeaderDesktop={<>header desktop</>}
    slotAppHeaderMobile={<>header mobile</>}
    slotBottomNavigationBar={<>bottom navigation bar</>}
  >
    {loremIpsum.long}
  </App>
)
