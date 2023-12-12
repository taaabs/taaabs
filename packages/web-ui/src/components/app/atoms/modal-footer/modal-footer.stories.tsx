import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'
import { ModalFooter } from './modal-footer'

export default {
  component: ModalFooter,
}

export const Primary = () => {
  return (
    <div>
      <StorybookSpacer />
      <ModalFooter slot_right_side={<div>slot</div>} />
    </div>
  )
}
