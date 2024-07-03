import { lorem_ipsum } from '@web-ui/helpers'
import { Modal } from './modal'

export default {
  component: Modal,
}

export const Primary = () => (
  <Modal
    children={<>{lorem_ipsum.long}</>}
    content={<div>{lorem_ipsum.long}</div>}
    on_outside_click={() => {}}
  />
)
