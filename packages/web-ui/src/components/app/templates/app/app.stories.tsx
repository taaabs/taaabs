import { Helpers } from '@web-ui'
import { App } from './app'

export default {
  component: App,
}

export const Primary = () => (
  <App
    slot_header_desktop={<>header desktop</>}
    slot_header_mobile={<>header mobile</>}
    slot_bottom_navigation_bar={<>bottom navigation bar</>}
  >
    {Helpers.lorem_ipsum.long}
  </App>
)
