import { NewBookmark } from './new-bookmark'

export default {
  component: NewBookmark,
}

export const Primary = () => {
  return (
    <NewBookmark slot_header={<>header</>}>
      <div>content</div>
      <div>content</div>
    </NewBookmark>
  )
}
