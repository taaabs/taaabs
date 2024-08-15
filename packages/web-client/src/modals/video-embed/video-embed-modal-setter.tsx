import { Dictionary } from '@/dictionaries/dictionary'
import { VideoEmbedModal } from './VideoEmbedModal'
import { ModalContext } from '@/providers/ModalProvider'

export const video_embed_setter = (params: {
  modal_context: ModalContext
  url: string
  dictionary: Dictionary
}) => {
  const on_close_handler = () => params.modal_context.close()
  params.modal_context.set(
    <VideoEmbedModal
      key={Date.now()}
      url={params.url}
      dictionary={params.dictionary}
      on_close={on_close_handler}
    />,
  )
}
