import { Meta } from '@storybook/react'
import { LayoutApp } from './LayoutApp'

export default {
  title: 'Organisms/LayoutApp',
  component: LayoutApp,
} as Meta

export const standard = (
  <LayoutApp slotAside={<div>aside</div>} slotMain={<div>main</div>} />
)
