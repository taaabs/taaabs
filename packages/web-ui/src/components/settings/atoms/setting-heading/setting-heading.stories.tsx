import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { SettingHeading } from './setting-heading'

export default {
  component: SettingHeading,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <SettingHeading heading="Lorem" subheading="Ipsum" />
    </StorybookMargin>
  )
}
