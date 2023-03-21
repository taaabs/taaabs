import { Meta, Story } from '@storybook/react'
import { MobileAppBar } from './MobileAppBar'

export default {
  title: 'Molecules/MobileAppBar',
  component: MobileAppBar,
} as Meta

export const standard: Story<MobileAppBar.Props> = () => (
  <div css={{ width: '400px' }}>
    <MobileAppBar
      hamburgerIsToggled={false}
      hamburgerOnClick={() => {}}
      tabsCount={3}
      tabsOnClick={() => {}}
    />
    <MobileAppBar
      hamburgerIsToggled={false}
      hamburgerOnClick={() => {}}
      tabsCount={3}
      tabsOnClick={() => {}}
    />
  </div>
)
