import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { DesktopUserForHeader } from './desktop-user-for-header'

export default {
  component: DesktopUserForHeader,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <DesktopUserForHeader button_label="Lorem" button_on_click={() => {}} />
      <StorybookSpacer />
      <DesktopUserForHeader button_label="Lorem" button_on_click={() => {}} />
    </StorybookMargin>
  )
}
