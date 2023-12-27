import { Helpers } from '@web-ui'
import { AppHeaderDesktop } from './app-header-desktop'

export default {
  component: AppHeaderDesktop,
}

export const Primary = () => (
  <Helpers.Storybook.StorybookMargin>
    <AppHeaderDesktop
      slot_left_side_logo={<div>logo</div>}
      slot_left_side_navigation={<div>navigation</div>}
      slot_right_side={<div>right side</div>}
    />
    <Helpers.Storybook.StorybookSpacer />
  </Helpers.Storybook.StorybookMargin>
)
