import { BottomNavigationBar } from './bottom-navigation-bar'
import { StorybookMargin } from '@web-ui/helpers/storybook'

export default {
  component: BottomNavigationBar,
}

export const Primary = () => (
  <StorybookMargin>
    <BottomNavigationBar
      add_on_click={() => {}}
      my_library_on_click={() => {}}
      notifications_on_click={() => {}}
      search_on_click={() => {}}
      user_on_click={() => {}}
      home_on_click={() => {}}
    />
  </StorybookMargin>
)
