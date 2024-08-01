import { lorem_ipsum } from '@web-ui/helpers'
import { App } from './App'

export default {
  component: App,
}

export const Primary = () => (
  <App
    slot_header_desktop={<>header desktop</>}
    slot_header_mobile={<>header mobile</>}
    slot_bottom_navigation_bar={<>bottom navigation bar</>}
  >
    {lorem_ipsum.long}
  </App>
)
