import { loremIpsum } from '@web-ui/helpers/storybook/lorem-ipsum'
import { App } from './App'

export default {
  component: App,
}

export const Primary = () => (
  <App
    slotAppHeaderDesktop={<>header desktop</>}
    slotAppHeaderMobile={<>header mobile</>}
    slotBottomNavigationBar={<>bottom navigation bar</>}
    slotFooterDesktop={<>footer desktop</>}
  >
    {loremIpsum.long}
  </App>
)
