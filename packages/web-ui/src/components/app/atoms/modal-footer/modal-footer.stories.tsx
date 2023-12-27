import { Helpers } from '@web-ui'
import { ModalFooter } from './modal-footer'

export default {
  component: ModalFooter,
}

export const Primary = () => {
  return (
    <div>
      <Helpers.Storybook.StorybookSpacer />
      <ModalFooter
        button_label="Lorem"
        on_click_cancel={() => {}}
        is_disabled={false}
      />
    </div>
  )
}
