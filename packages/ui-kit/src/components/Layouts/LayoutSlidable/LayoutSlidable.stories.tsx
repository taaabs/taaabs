import { Meta, Story } from '@storybook/react'
import { LayoutSlidable } from './LayoutSlidable'

export default {
  title: 'Layouts/LayoutSlidable',
  component: LayoutSlidable,
} as Meta

const template: Story<LayoutSlidable.Props> = (props) => (
  <LayoutSlidable {...props}></LayoutSlidable>
)

export const standard = template.bind({})
standard.args = {}
