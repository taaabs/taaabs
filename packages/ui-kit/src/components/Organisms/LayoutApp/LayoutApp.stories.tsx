import { Meta, Story } from '@storybook/react'
import { LayoutApp } from './LayoutApp'

export default {
  title: 'Organisms/LayoutApp',
  component: LayoutApp,
} as Meta

const template: Story<LayoutApp.Props> = (props) => (
  <LayoutApp {...props}></LayoutApp>
)

export const standard = template.bind({})
standard.args = {}
