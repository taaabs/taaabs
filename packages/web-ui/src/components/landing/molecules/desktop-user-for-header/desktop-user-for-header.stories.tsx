import { Helpers } from '@web-ui'
import { DesktopUserForHeader } from './desktop-user-for-header'

export default {
  component: DesktopUserForHeader,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <DesktopUserForHeader button_label="Lorem" button_on_click={() => {}} />
      <Helpers.Storybook.StorybookSpacer />
      <DesktopUserForHeader button_label="Lorem" button_on_click={() => {}} />
    </Helpers.Storybook.StorybookMargin>
  )
}
