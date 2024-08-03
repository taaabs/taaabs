import { Dictionary } from '@/dictionaries/dictionary'
import { ReaderData } from '@shared/utils/html-parser/reader-data'
import { ReaderModal as UiReaderModal } from '@web-ui/components/ReaderModal'
import { Header as UiModal_Header } from '@web-ui/components/Modal/Header'
import { Article as UiReaderModal_Article } from '@web-ui/components/ReaderModal/Article'
import { Chat as UiReaderModal_Chat } from '@web-ui/components/ReaderModal/Chat'
import { ReactNode, useContext } from 'react'
import { ModalContext } from '@/providers/ModalProvider'

export namespace ReaderModal {
  export type Props = {
    reader_data: ReaderData.Data
    dictionary: Dictionary
  }
}

export const ReaderModal: React.FC<ReaderModal.Props> = (props) => {
  const modal_context = useContext(ModalContext)

  let content: ReactNode

  if (props.reader_data.type == ReaderData.ContentType.ARTICLE) {
    content = <UiReaderModal_Article article={props.reader_data} />
  } else if (props.reader_data.type == ReaderData.ContentType.CHAT) {
    content = <UiReaderModal_Chat chat={props.reader_data} />
  }

  const header = (
    <UiModal_Header title={'Reader'} on_close={modal_context.close} />
  )

  return (
    <UiReaderModal
      is_open={modal_context.is_open}
      on_close={modal_context.close}
      slot_header={header}
      slot_content={content}
    />
  )
}
