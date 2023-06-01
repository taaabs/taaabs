import { Meta } from '@storybook/react'
import { _MobileTitleBar } from './_MobileTitleBar'

export default {
  title: 'Layouts/LayoutLibrary/components/AppBar',
  component: _MobileTitleBar,
} as Meta

export const Primary = () => (
  <_MobileTitleBar
    swipeLeftOnClick={() => {}}
    swipeRightOnClick={() => {}}
    topLineText="Lorem ipsum"
    bottomLineText="lorem"
  />
)
