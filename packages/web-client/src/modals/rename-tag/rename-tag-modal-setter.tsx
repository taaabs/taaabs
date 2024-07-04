import { Dictionary } from '@/dictionaries/dictionary'
import { RenameTagModal } from './rename-tag-modal'
import { ModalContext } from '@/providers/modal-provider'

export const rename_tag_modal_setter = (params: {
  modal_context: ModalContext
  name: string
  dictionary: Dictionary
}) =>
  new Promise<string | null>((resolve) => {
    const on_submit_handler = (name: string) => resolve(name)
    const on_close_handler = () => resolve(null)
    params.modal_context.set(
      <RenameTagModal
        key={Date.now()}
        name={params.name}
        on_submit={on_submit_handler}
        on_close={on_close_handler}
        dictionary={params.dictionary}
      />,
    )
  })
