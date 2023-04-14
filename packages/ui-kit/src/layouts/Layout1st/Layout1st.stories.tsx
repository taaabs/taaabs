import { loremIpsum } from '@/helpers/storybook/lorem-ipsum'
import { Meta } from '@storybook/react'
import { Layout1st } from './Layout1st'

export default {
  title: 'Layouts/Layout1st',
  component: Layout1st,
} as Meta

export const standard = () => (
  <Layout1st
    slotHeaderDesktop={<>header desktop</>}
    slotHeaderMobile={<>header mobile</>}
    slotBottomNavigationBar={<>bottom navigation bar</>}
  >
    {loremIpsum.long}
  </Layout1st>
)
