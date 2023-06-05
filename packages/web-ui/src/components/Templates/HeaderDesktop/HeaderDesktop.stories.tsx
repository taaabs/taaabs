import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'
import { HeaderDesktop } from './HeaderDesktop'

export default {
  component: HeaderDesktop,
}

export const Primary = () => (
  <StorybookMargin>
    <HeaderDesktop
      logoSlot={<div>logo</div>}
      navigationSlot={<div>navigation</div>}
      rightSideSlot={<div>right side</div>}
    />
    <StorybookSpacer />
  </StorybookMargin>
)
