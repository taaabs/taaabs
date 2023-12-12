import { Form } from './form'

export default {
  component: Form,
}

export const Primary = () => {
  return (
    <Form slot_header={<>header</>} slot_footer={<>footer</>}>
      <div>content</div>
      <div>content</div>
    </Form>
  )
}
