import { Content } from './content'

export default {
  component: Content,
}

export const Primary = () => {
  return (
    <Content slot_header={<>header</>} slot_footer={<>footer</>}>
      <div>content</div>
      <div>content</div>
    </Content>
  )
}
