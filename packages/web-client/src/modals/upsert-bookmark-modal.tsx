import { UpsertBookmarkForm } from '@/forms'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'

export const upsert_bookmark_modal = (params: {
  modal_context: any
  bookmark?: Bookmark_Entity
  is_archived?: boolean
  auth_token: string
}) =>
  new Promise<Bookmark_Entity>((resolve) => {
    const on_submit_handler = (bookmark: Bookmark_Entity) => resolve(bookmark)
    const on_close_handler = () => params.modal_context.set_modal()
    params.modal_context.set_modal(
      <UpsertBookmarkForm
        action="update"
        bookmark={params.bookmark}
        is_archived={params.is_archived}
        on_submit={on_submit_handler}
        on_close={on_close_handler}
        auth_token={params.auth_token}
      />,
    )
  })
