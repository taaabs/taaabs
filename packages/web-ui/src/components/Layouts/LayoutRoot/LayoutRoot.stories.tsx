import { loremIpsum } from '@web-ui/helpers/storybook/lorem-ipsum'
import { Meta } from '@storybook/react'
import { LayoutRoot } from './LayoutRoot'

export default {
  title: 'Layouts/LayoutRoot',
  component: LayoutRoot,
} as Meta

export const Primary = () => (
  <LayoutRoot
    slotHeaderDesktop={<>header desktop</>}
    slotHeaderMobile={<>header mobile</>}
    slotBottomNavigationBar={<>bottom navigation bar</>}
    slotFooterDesktop={<>footer desktop</>}
  >
    {loremIpsum.long}
  </LayoutRoot>
)
