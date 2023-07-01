import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { DesktopUserForHeader } from './desktop-user-for-header'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'

export default {
  component: DesktopUserForHeader,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <DesktopUserForHeader buttonLabel="Lorem" buttonOnClick={() => {}} />
      <StorybookSpacer />
      <DesktopUserForHeader buttonLabel="Lorem" buttonOnClick={() => {}} />
    </StorybookMargin>
  )
}
