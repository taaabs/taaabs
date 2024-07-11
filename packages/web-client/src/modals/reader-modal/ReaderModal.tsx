import { Dictionary } from '@/dictionaries/dictionary'
import { ContentReader as UiModal_ContentReader } from '@web-ui/components/modal/ContentReader'
import { ReaderData } from '@shared/utils/html-parser/reader-data'
import { Modal as UiModal } from '@web-ui/components/modal'
import { Header as UiModal_Header } from '@web-ui/components/modal/Header'
import { Chat as UiModal_ContentReader_Chat } from '@web-ui/components/modal/ContentReader/Chat'
import { Article as UiModal_ContentReader_Article } from '@web-ui/components/modal/ContentReader/Article'
import { ReactNode, useContext } from 'react'
import { ModalContext } from '@/providers/modal-provider'

export namespace ReaderModal {
  export type Props = {
    reader_data: ReaderData.Data
    dictionary: Dictionary
  }
}

export const ReaderModal: React.FC<ReaderModal.Props> = (props) => {
  const modal_context = useContext(ModalContext)!

  let content: ReactNode

  if (props.reader_data.type == ReaderData.ContentType.ARTICLE) {
    content = (
      <UiModal_ContentReader>
        <UiModal_ContentReader_Article article={props.reader_data} />
      </UiModal_ContentReader>
    )
  } else if (props.reader_data.type == ReaderData.ContentType.CHAT) {
    content = (
      <UiModal_ContentReader>
        <UiModal_ContentReader_Chat chat={props.reader_data} />
      </UiModal_ContentReader>
    )
  }

  const header = <UiModal_Header title={'Reader'} on_close_click={() => {}} />

  return (
    <UiModal
      is_open={modal_context.is_open}
      width={800}
      on_close={modal_context.close}
      slot_header={header}
      slot_content={content}
      is_dismissible={true}
    />
  )
}
