import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'
import { AppHeaderDesktop } from './app-header-desktop'

export default {
  component: AppHeaderDesktop,
}

export const Primary = () => (
  <StorybookMargin>
    <AppHeaderDesktop
      logoSlot={<div>logo</div>}
      navigationSlot={<div>navigation</div>}
      rightSideSlot={<div>right side</div>}
    />
    <StorybookSpacer />
  </StorybookMargin>
)
