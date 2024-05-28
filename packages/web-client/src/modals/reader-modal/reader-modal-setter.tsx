import { Dictionary } from '@/dictionaries/dictionary'
import dynamic from 'next/dynamic'

const DynamicReaderModal = dynamic(() => import('./dynamic-reader-modal'), {
  ssr: false,
})

export const reader_modal_setter = (params: {
  modal_context: any
  dictionary: Dictionary
  parsed_reader_data: string
}) =>
  new Promise((resolve) => {
    const on_close_handler = () => resolve(null)
    params.modal_context.set_modal({
      modal: (
        <DynamicReaderModal
          reader_data={JSON.parse(params.parsed_reader_data)}
          on_close={on_close_handler}
          dictionary={params.dictionary}
        />
      ),
    })
  })
