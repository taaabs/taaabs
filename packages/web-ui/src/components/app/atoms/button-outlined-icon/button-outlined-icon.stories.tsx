import { ButtonOutlinedIcon } from './button-outlined-icon'
import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'

export default {
  component: ButtonOutlinedIcon,
}

export const Primary = () => (
  <StorybookMargin>
    <ButtonOutlinedIcon iconVariant="ADD" onClick={() => {}} />
  </StorybookMargin>
)