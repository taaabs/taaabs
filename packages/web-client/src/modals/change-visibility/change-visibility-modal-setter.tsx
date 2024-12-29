import { Dictionary } from '@/dictionaries/dictionary'
import { ChangeVisibilityModal } from './ChangeVisibilityModal'
import { ModalContext } from '@/providers/ModalProvider'

export const change_visibility_modal_setter = (params: {
  modal_context: ModalContext
  dictionary: Dictionary
}) =>
  new Promise<boolean>((resolve) => {
    const on_submit_handler = () => resolve(true)
    const on_close_handler = () => resolve(false)
    params.modal_context.set(
      <ChangeVisibilityModal
        key={Date.now()}
        on_submit={on_submit_handler}
        on_close={on_close_handler}
        dictionary={params.dictionary}
      />,
    )
  })
