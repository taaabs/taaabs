import { Meta, Story } from '@storybook/react'
import { Wrapper, WrapperProps } from './Wrapper'

export default {
  title: 'Atoms/Wrapper',
  component: Wrapper,
} as Meta

const template: Story<WrapperProps> = (props) => (
  <Wrapper>{props.children}</Wrapper>
)

export const standard = template.bind({})
standard.args = { children: 'content' }
