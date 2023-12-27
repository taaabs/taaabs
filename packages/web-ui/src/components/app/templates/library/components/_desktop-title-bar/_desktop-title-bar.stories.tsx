import { StorybookMargin } from '@web-ui/helpers/storybook'
import { _DesktopTitleBar } from './_desktop-title-bar'

export default {
  component: _DesktopTitleBar,
}

export const Primary = () => (
  <StorybookMargin>
    <_DesktopTitleBar text="Lorem ipsum" />
  </StorybookMargin>
)
