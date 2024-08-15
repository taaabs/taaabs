import { DesktopMenuItem } from './DesktopMenuItem'
import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { Wrapper as UiWrapper } from '@web-ui/components/Wrapper'

export default {
  component: DesktopMenuItem,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <UiWrapper>
        <DesktopMenuItem is_active={true} href="" label="Lorem ipsum" />
        <StorybookSpacer />
        <DesktopMenuItem is_active={false} href="" label="Lorem ipsum" />
      </UiWrapper>
    </StorybookMargin>
  )
}
