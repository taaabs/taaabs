import { StorybookMargin } from '@/helpers/storybook/StorybookMargin'
import { BottomNavigationBar } from './BottomNavigationBar'

export default {
  component: BottomNavigationBar,
}

export const Primary = () => (
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
