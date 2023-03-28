import { loremIpsum } from '@/helpers/storybook/lorem-ipsum'
import { Meta } from '@storybook/react'
import { LayoutRoot } from './LayoutRoot'

export default {
  title: 'Layouts/LayoutRoot',
  component: LayoutRoot,
} as Meta

export const standard = () => (
  <LayoutRoot
    slotDesktopHeader={<>desktop navigation bar</>}
    slotMobileHeader={<>mobile navigation bar</>}
  >
    {loremIpsum.long}
  </LayoutRoot>
)
