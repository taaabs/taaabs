import { Helpers } from '@web-ui'
import { Modal } from './modal'

export default {
  component: Modal,
}

export const Primary = () => (
  <Modal
    children={<>{Helpers.lorem_ipsum.long}</>}
    slot_modal={<div>{Helpers.lorem_ipsum.long}</div>}
  />
)
