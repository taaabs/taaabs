import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { HeaderDesktop } from './HeaderDesktop'

export default {
  component: HeaderDesktop,
}

export const Primary = () => (
  <StorybookMargin>
    <HeaderDesktop
      slot_left={<div>Left</div>}
      slot_middle={<div>Middle</div>}
      slot_right={<div>Right</div>}
    />
    <StorybookSpacer />
  </StorybookMargin>
)
