import { Meta, Story } from '@storybook/react'
import { LayoutSidebar, LayoutSidebarProps } from './LayoutSidebar'

export default{
title: 'Layouts/LayoutSidebar',
component: LayoutSidebar
} as Meta

const template: Story<LayoutSidebarProps> = (props) => (
<LayoutSidebar {...props}></LayoutSidebar>
)

export const standard = template.bind({})
standard.args = {}