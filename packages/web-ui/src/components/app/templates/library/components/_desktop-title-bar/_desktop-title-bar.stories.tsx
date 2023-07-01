import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { _DesktopTitleBar } from './_desktop-title-bar'

export default {
  component: _DesktopTitleBar,
}

export const Primary = () => (
  <StorybookMargin>
    <_DesktopTitleBar primaryText="Lorem ipsum" secondaryText="lorem" />
  </StorybookMargin>
)
