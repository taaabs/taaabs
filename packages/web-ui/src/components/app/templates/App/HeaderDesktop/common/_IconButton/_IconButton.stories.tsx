import { StorybookMargin } from '@web-ui/helpers/storybook'
import { _IconButton } from './_IconButton'

export default {
  component: _IconButton,
}

export const Primary = () => (
  <StorybookMargin>
    <_IconButton icon_variant="ADD" on_click={() => {}} />
  </StorybookMargin>
)
