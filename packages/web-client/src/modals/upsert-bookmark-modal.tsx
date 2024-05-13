import { Dictionary } from '@/dictionaries/dictionary'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { UpsertBookmark as Form_UpsertBookmark } from '../forms/upsert-bookmark'
import { ModalContext } from '../providers/modal-provider'

export const upsert_bookmark_modal = (params: {
  modal_context: ModalContext
  bookmark?: Bookmark_Entity
  is_archived?: boolean
  dictionary: Dictionary
}) =>
  new Promise<UpsertBookmark_Params | null>((resolve) => {
    const on_submit_handler = (bookmark: UpsertBookmark_Params) =>
      resolve(bookmark)
    const on_close_handler = () => resolve(null)
    params.modal_context.set_modal({
      modal: (
        <Form_UpsertBookmark
          action="update"
          bookmark={params.bookmark}
          is_archived={params.is_archived}
          on_submit={on_submit_handler}
          on_close={on_close_handler}
          dictionary={params.dictionary}
        />
      ),
      pin_to_bottom_on_mobile: true,
    })
  })
