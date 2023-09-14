import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { DesktopUserForHeader } from './desktop-user-for-header'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'

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
