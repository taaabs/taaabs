import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { DesktopUserForHeader } from './DesktopUserForHeader'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'

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
