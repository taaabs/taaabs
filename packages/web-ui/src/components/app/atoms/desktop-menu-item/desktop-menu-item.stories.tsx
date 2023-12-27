import { Helpers,Ui } from '@web-ui'
import { DesktopMenuItem } from './desktop-menu-item'

export default {
  component: DesktopMenuItem,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <Ui.Common.Templates.Wrapper>
        <DesktopMenuItem is_active={true} href="" label="Lorem ipsum" />
        <Helpers.Storybook.StorybookSpacer />
        <DesktopMenuItem is_active={false} href="" label="Lorem ipsum" />
      </Ui.Common.Templates.Wrapper>
    </Helpers.Storybook.StorybookMargin>
  )
}
