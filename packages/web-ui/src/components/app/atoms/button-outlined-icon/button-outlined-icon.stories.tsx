import { ButtonOutlinedIcon } from './button-outlined-icon'
import { Helpers } from '@web-ui'

export default {
  component: ButtonOutlinedIcon,
}

export const Primary = () => (
  <Helpers.Storybook.StorybookMargin>
    <ButtonOutlinedIcon icon_variant="ADD" on_click={() => {}} />
  </Helpers.Storybook.StorybookMargin>
)
