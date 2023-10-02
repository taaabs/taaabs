import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { DesktopMenuItem } from './desktop-menu-item'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'
import { Wrapper } from '@web-ui/components/common/particles/wrapper'

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
