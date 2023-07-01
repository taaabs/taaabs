import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { BottomNavigationBar } from './bottom-navigation-bar'

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
