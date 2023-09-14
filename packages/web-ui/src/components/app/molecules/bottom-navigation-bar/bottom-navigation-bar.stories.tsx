import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { BottomNavigationBar } from './bottom-navigation-bar'

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
    />
  </StorybookMargin>
)
