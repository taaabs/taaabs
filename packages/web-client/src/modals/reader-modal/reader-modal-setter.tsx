import { Dictionary } from '@/dictionaries/dictionary'
import dynamic from 'next/dynamic'

const DynamicReaderModal = dynamic(() => import('./dynamic-reader-modal'), {
  ssr: false,
})

export const reader_modal_setter = (params: {
  modal_context: any
  dictionary: Dictionary
  reader_data: string
}) =>
  new Promise((resolve) => {
    const on_close_handler = () => resolve(null)
    params.modal_context.set_modal_content({
      modal_content: (
        <DynamicReaderModal
          reader_data={JSON.parse(params.reader_data)}
          on_close={on_close_handler}
          dictionary={params.dictionary}
        />
      ),
      pin_to_bottom_on_mobile: true,
    })
  })
