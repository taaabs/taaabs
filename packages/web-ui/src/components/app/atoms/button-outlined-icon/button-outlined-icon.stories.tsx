import { StorybookMargin } from '@web-ui/helpers/storybook'
import { ButtonOutlinedIcon } from './button-outlined-icon'

export default {
  component: ButtonOutlinedIcon,
}

export const Primary = () => (
  <StorybookMargin>
    <ButtonOutlinedIcon icon_variant="ADD" on_click={() => {}} />
  </StorybookMargin>
)
