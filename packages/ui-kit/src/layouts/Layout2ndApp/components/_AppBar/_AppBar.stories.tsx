import { Meta } from '@storybook/react'
import { _AppBar } from './_AppBar'

export default {
  title: 'Layouts/Layout2ndApp/components/AppBar',
  component: _AppBar,
} as Meta

export const standard = () => (
  <_AppBar swipeLeftOnClick={() => {}} swipeRightOnClick={() => {}}>
    slot content
  </_AppBar>
)
