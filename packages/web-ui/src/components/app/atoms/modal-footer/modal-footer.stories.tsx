import { StorybookSpacer } from '@web-ui/helpers/storybook'
import { ModalFooter } from './modal-footer'

export default {
  component: ModalFooter,
}

export const Primary = () => {
  return (
    <div>
      <StorybookSpacer />
      <ModalFooter
        button_label="Lorem"
        on_click_cancel={() => {}}
        is_disabled={false}
      />
    </div>
  )
}
