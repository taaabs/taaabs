import { Meta } from '@storybook/react'
import { LayoutLanding } from './LayoutLanding'

export default {
  title: 'Molecules/LayoutLanding',
  component: LayoutLanding,
} as Meta

export const standard = () => (
  <LayoutLanding
    slotDesktopNavigationBar={<>desktop navigation bar</>}
    slotMobileNavigationBar={<>mobile navigation bar</>}
    slotFooter={<>footer</>}
  ></LayoutLanding>
)
