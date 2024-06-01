import { Dictionary } from '@/dictionaries/dictionary'
import { ContentReader as UiCommonTemplate_Modal_ContentReader } from '@web-ui/components/common/templates/modal/content-reader'
import { ReaderData } from '@shared/utils/html-parser/reader-data'
import { Chat as UiCommonTemplate_Modal_ContentReader_Chat } from '@web-ui/components/common/templates/modal/content-reader/chat'
import { Article as UiCommonTemplate_Modal_ContentReader_Article } from '@web-ui/components/common/templates/modal/content-reader/article'

export namespace ReaderModal {
  export type Props = {
    reader_data: ReaderData.Data
    on_close: () => void
    dictionary: Dictionary
  }
}

export const ReaderModal: React.FC<ReaderModal.Props> = (props) => {
  if (props.reader_data.type == ReaderData.ContentType.ARTICLE) {
    return (
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
    return (
      <UiCommonTemplate_Modal_ContentReader
        slot_left_panel={<></>}
        slot_right_panel={<></>}
      >
        <UiCommonTemplate_Modal_ContentReader_Chat chat={props.reader_data} />
      </UiCommonTemplate_Modal_ContentReader>
    )
  }
}
