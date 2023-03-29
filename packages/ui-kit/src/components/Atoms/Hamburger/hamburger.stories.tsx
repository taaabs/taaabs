import { StorybookMargin as HamburgerStory } from '@/helpers/storybook/StorybookMargin'
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
    <div
      onClick={() => {
        setIsToggled(!isToggled)
      }}
    >
      <Hamburger isToggled={isToggled} />
    </div>
  )
}
