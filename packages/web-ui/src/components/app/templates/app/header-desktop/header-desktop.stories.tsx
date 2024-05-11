import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { HeaderDesktop } from './header-desktop'

export default {
  component: HeaderDesktop,
}

export const Primary = () => (
  <StorybookMargin>
    <HeaderDesktop
      slot_logo={<div>logo</div>}
      slot_navigation={<div>navigation</div>}
      slot_right_side={<div>right side</div>}
      translations={{ powered_by: 'Powered by' }}
      cockroach_url="https://example.com"
    />
    <StorybookSpacer />
  </StorybookMargin>
)
