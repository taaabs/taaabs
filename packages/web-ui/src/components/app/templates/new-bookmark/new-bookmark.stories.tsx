import { NewBookmark } from './new-bookmark'

export default {
  component: NewBookmark,
}

export const Primary = () => {
  return (
    <NewBookmark slot_header={<>header</>} slot_footer={<>footer</>}>
      <div>content</div>
      <div>content</div>
    </NewBookmark>
  )
}
