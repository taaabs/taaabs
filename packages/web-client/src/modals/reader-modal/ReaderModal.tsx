import { Dictionary } from '@/dictionaries/dictionary'
import { ContentReader as UiModal_ContentReader } from '@web-ui/components/modal/ContentReader'
import { ReaderData } from '@shared/utils/html-parser/reader-data'
import { Chat as UiModal_ContentReader_Chat } from '@web-ui/components/modal/ContentReader/Chat'
import { Article as UiModal_ContentReader_Article } from '@web-ui/components/modal/ContentReader/Article'
import { ReactNode, useContext, useRef, useState } from 'react'
import { Content, Header, Footer, Portal, Sheet } from 'react-sheet-slide'
import { ModalContext } from '@/providers/modal-provider'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export namespace ReaderModal {
  export type Props = {
    reader_data: ReaderData.Data
    dictionary: Dictionary
  }
}

export const ReaderModal: React.FC<ReaderModal.Props> = (props) => {
  const [is_open, set_is_open] = useState(true)
  const ref = useRef(null)
  const modal_context = useContext(ModalContext)!

  useUpdateEffect(() => {
    set_is_open(false)
  }, [modal_context.close_trigger])

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

  return (
    <Portal>
      <div style={{ '--modal-width': '800px' } as any}>
        <Sheet ref={ref} open={is_open} onDismiss={() => set_is_open(false)}>
          <Header>11</Header>
          <Content>{content}</Content>
          <Footer>11</Footer>
        </Sheet>
      </div>
    </Portal>
  )
}
