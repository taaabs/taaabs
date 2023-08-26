import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { SettingBox } from './setting-box'

export default {
  component: SettingBox,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <SettingBox>children</SettingBox>
    </StorybookMargin>
  )
}
