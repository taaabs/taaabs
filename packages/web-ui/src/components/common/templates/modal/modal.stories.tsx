import { lorem_ipsum } from '@web-ui/helpers/storybook/lorem-ipsum'
import { Modal } from './modal'

export default {
  component: Modal,
}

export const Primary = () => (
  <Modal
    children={<>{lorem_ipsum.long}</>}
    slot_modal={<div>{lorem_ipsum.long}</div>}
  />
)
