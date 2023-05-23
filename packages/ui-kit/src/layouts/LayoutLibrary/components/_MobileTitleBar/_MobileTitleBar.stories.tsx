import { Meta } from '@storybook/react'
import { _MobileTitleBar } from './_MobileTitleBar'

export default {
  title: 'Layouts/LayoutLibrary/components/AppBar',
  component: _MobileTitleBar,
} as Meta

export const Standard = () => (
  <_MobileTitleBar swipeLeftOnClick={() => {}} swipeRightOnClick={() => {}}>
    slot content
  </_MobileTitleBar>
)
