import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { DesktopActions } from './DesktopActions'

export default {
  component: DesktopActions,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <DesktopActions
        library_button_label="Lorem"
        library_button_on_click={() => {}}
        github_url=""
      />
      <StorybookSpacer />
      <DesktopActions
        library_button_label="Lorem"
        library_button_on_click={() => {}}
        github_url=""
      />
    </StorybookMargin>
  )
}
