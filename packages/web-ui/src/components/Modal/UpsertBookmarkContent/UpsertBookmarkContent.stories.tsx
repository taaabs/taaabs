import { UpsertBookmarkContent } from './UpsertBookmarkContent'

export default {
  component: UpsertBookmarkContent,
}

export const Default = () => {
  return (
    <UpsertBookmarkContent
      slot_title={<div>Title Content</div>}
      slot_note={<div>Note Content</div>}
      slot_tags={<div>Tags Content</div>}
      slot_cover={<div>Cover Content</div>}
      slot_links={<div>Links Content</div>}
    />
  )
}
