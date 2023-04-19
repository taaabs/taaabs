import { Meta } from '@storybook/react'
import { ButtonFollow } from './ButtonFollow'
import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'

export default {
  title: 'Atoms/ButtonFollow',
  component: ButtonFollow,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <ButtonFollow onClick={() => {}}>Lorem ipsum</ButtonFollow>
  </StorybookMargin>
)
