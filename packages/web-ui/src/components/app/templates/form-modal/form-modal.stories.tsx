import { FormModal } from './form-modal'

export default {
  component: FormModal,
}

export const Primary = () => {
  return (
    <FormModal slot_header={<>header</>} slot_footer={<>footer</>}>
      <div>content</div>
      <div>content</div>
    </FormModal>
  )
}
