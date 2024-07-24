import { Dictionary } from '@/dictionaries/dictionary'
import { EditTagsModal } from './EditTagsModal'
import { ModalContext } from '@/providers/ModalProvider'

export type Tags = { name: string; is_public?: boolean }[]

export const edit_tags_modal_setter = (params: {
  modal_context: ModalContext
  tags: Tags
  is_visibility_toggleable: boolean
  dictionary: Dictionary
}) =>
  new Promise<Tags | null>((resolve) => {
    const on_submit_handler = (tags: Tags) => resolve(tags)
    const on_close_handler = () => resolve(null)
    params.modal_context.set(
      <EditTagsModal
        key={Date.now()}
        tags={params.tags}
        is_visibility_toggleable={params.is_visibility_toggleable}
        on_submit={on_submit_handler}
        on_close={on_close_handler}
        dictionary={params.dictionary}
      />,
    )
  })
