import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { _DesktopTitleBar } from './_DesktopTitleBar'

export default {
  component: _DesktopTitleBar,
}

export const Primary = () => (
  <StorybookMargin>
    <_DesktopTitleBar primaryText="Lorem ipsum" secondaryText="lorem" />
  </StorybookMargin>
)
