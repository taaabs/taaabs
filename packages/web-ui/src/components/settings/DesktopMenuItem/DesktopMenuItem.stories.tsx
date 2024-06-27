import { DesktopMenuItem } from './DesktopMenuItem'
import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { Wrapper } from '@web-ui/components/common/templates/wrapper'

export default {
  component: DesktopMenuItem,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <Wrapper>
        <DesktopMenuItem is_active={true} href="" label="Lorem ipsum" />
        <StorybookSpacer />
        <DesktopMenuItem is_active={false} href="" label="Lorem ipsum" />
      </Wrapper>
    </StorybookMargin>
  )
}
