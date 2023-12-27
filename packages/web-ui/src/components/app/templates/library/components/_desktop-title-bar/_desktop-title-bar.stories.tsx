import { Helpers } from '@web-ui'
import { _DesktopTitleBar } from './_desktop-title-bar'

export default {
  component: _DesktopTitleBar,
}

export const Primary = () => (
  <Helpers.Storybook.StorybookMargin>
    <_DesktopTitleBar text="Lorem ipsum" />
  </Helpers.Storybook.StorybookMargin>
)
