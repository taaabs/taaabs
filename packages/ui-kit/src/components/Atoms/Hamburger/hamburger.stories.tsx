import { StorybookMargin as HamburgerStory } from '@/helpers/components/StorybookMargin'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import { Hamburger } from './'

export default {
  title: 'Atoms/Hamburger',
  component: Hamburger,
} as Meta

export const standard: Story = () => (
  <HamburgerStory>
    <HamburgerTester />
  </HamburgerStory>
)

const HamburgerTester: React.FC = () => {
  const [isToggled, setIsToggled] = useState(false)
  return (
    <Hamburger
      isToggled={isToggled}
      onClick={() => {
        setIsToggled(!isToggled)
      }}
    />
  )
}
