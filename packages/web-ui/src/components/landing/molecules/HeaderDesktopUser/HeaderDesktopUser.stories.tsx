import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'
import { HeaderDesktopUser } from './HeaderDesktopUser'
import { StorybookSpacer } from '@web-ui/helpers/storybook/StorybookSpacer'

export default {
  component: HeaderDesktopUser,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <HeaderDesktopUser
        buttonLabel="Lorem"
        buttonOnClick={() => {}}
        isLoading={false}
      />
      <StorybookSpacer />
      <HeaderDesktopUser
        buttonLabel="Lorem"
        buttonOnClick={() => {}}
        isLoading={true}
      />
    </StorybookMargin>
  )
}
