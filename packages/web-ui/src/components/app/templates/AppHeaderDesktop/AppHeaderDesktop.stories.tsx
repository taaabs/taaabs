import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'
import { AppHeaderDesktop } from './AppHeaderDesktop'

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
