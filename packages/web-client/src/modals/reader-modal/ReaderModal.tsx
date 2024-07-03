import { Dictionary } from '@/dictionaries/dictionary'
import { ContentReader as UiCommonTemplate_Modal_ContentReader } from '@web-ui/components/common/templates/modal/content-reader'
import { ReaderData } from '@shared/utils/html-parser/reader-data'
import { Chat as UiCommonTemplate_Modal_ContentReader_Chat } from '@web-ui/components/common/templates/modal/content-reader/chat'
import { Article as UiCommonTemplate_Modal_ContentReader_Article } from '@web-ui/components/common/templates/modal/content-reader/article'
import { ReactNode, useContext, useRef, useState } from 'react'
import { Content, Header, Portal, Sheet } from 'react-sheet-slide'
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
      <UiCommonTemplate_Modal_ContentReader
        slot_left_panel={<></>}
        slot_right_panel={<></>}
      >
        <UiCommonTemplate_Modal_ContentReader_Article
          article={props.reader_data}
        />
      </UiCommonTemplate_Modal_ContentReader>
    )
  } else if (props.reader_data.type == ReaderData.ContentType.CHAT) {
    content = (
      <UiCommonTemplate_Modal_ContentReader
        slot_left_panel={<></>}
        slot_right_panel={<></>}
      >
        <UiCommonTemplate_Modal_ContentReader_Chat chat={props.reader_data} />
      </UiCommonTemplate_Modal_ContentReader>
    )
  }

  return (
    <Portal>
      <div style={{ '--modal-width': '900px' } as any}>
        <Sheet ref={ref} open={is_open} onDismiss={() => set_is_open(false)}>
          <Content>{content}</Content>
        </Sheet>
      </div>
    </Portal>
  )
}
