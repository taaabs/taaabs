import { Dictionary } from '@/dictionaries/dictionary'
import { SavesModal } from './SavesModal'
import { ModalContext } from '@/providers/ModalProvider'

export const saves_modal_setter = (params: {
  modal_context: ModalContext
  url: string
  saves: number
  dictionary: Dictionary
}) => {
  const on_close_handler = () => params.modal_context.close()
  params.modal_context.set(
    <SavesModal
      key={Date.now()}
      url={params.url}
      saves={params.saves}
      dictionary={params.dictionary}
      on_close={on_close_handler}
    />,
  )
}
