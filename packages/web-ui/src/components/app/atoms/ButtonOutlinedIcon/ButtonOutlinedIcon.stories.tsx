import { ButtonOutlinedIcon } from './ButtonOutlinedIcon'
import { StorybookMargin } from '@web-ui/helpers/storybook/StorybookMargin'

export default {
  component: ButtonOutlinedIcon,
}

export const Primary = () => (
  <StorybookMargin>
    <ButtonOutlinedIcon iconVariant="ADD" onClick={() => {}} />
  </StorybookMargin>
)
