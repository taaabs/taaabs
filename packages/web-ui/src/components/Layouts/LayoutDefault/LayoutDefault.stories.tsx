import { loremIpsum } from '@web-ui/helpers/storybook/lorem-ipsum'
import { LayoutDefault } from './LayoutDefault'

export default {
  component: LayoutDefault,
}

export const Primary = () => (
  <LayoutDefault
    slotHeaderDesktop={<>header desktop</>}
    slotHeaderMobile={<>header mobile</>}
    slotBottomNavigationBar={<>bottom navigation bar</>}
    slotFooterDesktop={<>footer desktop</>}
  >
    {loremIpsum.long}
  </LayoutDefault>
)
