import { Meta, Story } from '@storybook/react'
import { UiAtoWrapper, UiAtoWrapperProps } from './UiAtoWrapper'

export default {
  title: 'Atoms/Wrapper',
  component: UiAtoWrapper,
} as Meta

const template: Story<UiAtoWrapperProps> = (props) => (
  <UiAtoWrapper>{props.children}</UiAtoWrapper>
)

export const standard = template.bind({})
standard.args = { children: 'content' }
