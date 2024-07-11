import { Dictionary } from '@/dictionaries/dictionary'
import { DeleteBookmarkModal } from './DeleteBookmarkModal'
import { ModalContext } from '@/providers/modal-provider'

export const delete_bookmark_modal_setter = (params: {
  modal_context: ModalContext
  title?: string
  dictionary: Dictionary
}) =>
  new Promise<boolean>((resolve) => {
    const on_submit_handler = () => resolve(true)
    const on_close_handler = () => resolve(false)
    params.modal_context.set(
      <DeleteBookmarkModal
        key={Date.now()}
        on_submit={on_submit_handler}
        on_close={on_close_handler}
        dictionary={params.dictionary}
        title={params.title}
      />,
    )
  })
