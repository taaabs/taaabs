import { Dictionary } from '@/dictionaries/dictionary'
import { ReaderData } from '@/utils/html-parser/reader-data'
import { Content as UiCommonTemplate_Modal_Content } from '@web-ui/components/common/templates/modal/content'
import { Header as UiCommonTemplate_Modal_Content_Header } from '@web-ui/components/common/templates/modal/content/header'
import ReactMarkdown from 'react-markdown'

export const reading_mode_modal = (params: {
  modal_context: any
  dictionary: Dictionary
  parsed_reader_data: string
}) =>
  new Promise((resolve) => {
    const on_close_handler = () => resolve(null)
    params.modal_context.set_modal({
      modal: (
        <_Modal
          reader_data={JSON.parse(params.parsed_reader_data)}
          on_close={on_close_handler}
          dictionary={params.dictionary}
        />
      ),
    })
  })

const _Modal: React.FC<{
  reader_data: ReaderData.Data
  on_close: () => void
  dictionary: Dictionary
}> = (props) => {
  console.log(props.reader_data)
  if (props.reader_data.type == ReaderData.ContentType.ARTICLE)
    return (
      <UiCommonTemplate_Modal_Content
        width={800}
        slot_header={
          <UiCommonTemplate_Modal_Content_Header title={'Reading mode'} />
        }
        slot_footer={
          <></>
          // <UiCommonTemplate_Modal_Content_Footer
          //   button_label={'Open original'}
          //   button_on_click={() => {}}
          //   on_click_cancel={props.on_close}
          //   translations={{
          //     cancel: 'Close',
          //   }}
          // />
        }
      >
        <ReactMarkdown children={props.reader_data.content} />
      </UiCommonTemplate_Modal_Content>
    )
}
