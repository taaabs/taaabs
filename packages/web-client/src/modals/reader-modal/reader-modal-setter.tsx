import { Dictionary } from '@/dictionaries/dictionary'
import { ModalContext } from '@/providers/ModalProvider'
import dynamic from 'next/dynamic'

const DynamicReaderModal = dynamic(() => import('./DynamicReaderModal'), {
  ssr: false,
})

export const reader_modal_setter = (params: {
  modal_context: ModalContext
  dictionary: Dictionary
  reader_data: string
}) => {
  params.modal_context.set(
    <DynamicReaderModal
      key={Date.now()}
      reader_data={JSON.parse(params.reader_data)}
      dictionary={params.dictionary}
    />,
  )
}
