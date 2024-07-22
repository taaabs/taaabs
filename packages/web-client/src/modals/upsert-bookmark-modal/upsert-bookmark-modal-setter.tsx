import { Dictionary } from '@/dictionaries/dictionary'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { UpsertBookmarkModal } from './UpsertBookmarkModal'
import { ModalContext } from '@/providers/ModalProvider'

export const upsert_bookmark_modal_setter = (params: {
  modal_context: ModalContext
  bookmark?: Bookmark_Entity
  is_archived?: boolean
  dictionary: Dictionary
}) =>
  new Promise<UpsertBookmark_Params | null>((resolve) => {
    const on_submit_handler = (bookmark: UpsertBookmark_Params) =>
      resolve(bookmark)
    const on_close_handler = () => resolve(null)
    params.modal_context.set(
      <UpsertBookmarkModal
        key={Date.now()}
        action="update"
        bookmark={params.bookmark}
        is_archived={params.is_archived}
        on_submit={on_submit_handler}
        on_close={on_close_handler}
        dictionary={params.dictionary}
      />,
    )
  })
