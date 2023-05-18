import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { BottomNavigationBar } from './BottomNavigationBar'
import { Meta } from '@storybook/react'

export default {
  title: 'Molecules/BottomNavigationBar',
  component: BottomNavigationBar,
} as Meta

export const standard = () => (
  <StorybookMargin>
    <BottomNavigationBar
      onClickAdd={() => {}}
      onClickMyLibrary={() => {}}
      onClickNotifications={() => {}}
      onClickSearch={() => {}}
      onClickUser={() => {}}
    />
  </StorybookMargin>
)
