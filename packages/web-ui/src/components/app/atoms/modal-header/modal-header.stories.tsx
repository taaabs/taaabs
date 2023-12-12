import { ModalHeader } from './modal-header'

export default {
  component: ModalHeader,
}

export const Primary = () => {
  return <ModalHeader title="Lorem ipsum" on_click_close={() => {}} />
}
