import { Dictionary } from '@/dictionaries/dictionary'
import { ReaderData } from '@/utils/html-parser/reader-data'
import { Content as UiCommonTemplate_Modal_Content } from '@web-ui/components/common/templates/modal/content'
import { Header as UiCommonTemplate_Modal_Content_Header } from '@web-ui/components/common/templates/modal/content/header'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import hljs from 'highlight.js'

export namespace ReaderModal {
  export type Props = {
    reader_data: ReaderData.Data
    on_close: () => void
    dictionary: Dictionary
  }
}

export const ReaderModal: React.FC<ReaderModal.Props> = (props) => {
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
        <ReactMarkdown
          children={props.reader_data.content}
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const { children, className, ...rest } = props
              const children_parsed = String(children).replace(/\n$/, '')
              let language: string | undefined = undefined
              const match = /language-(\w+)/.exec(className || '')
              if (match) {
                language = match[1]
              } else {
                language = hljs.highlightAuto(children_parsed).language
              }
              return language ? (
                <SyntaxHighlighter
                  PreTag="div"
                  language={language}
                  children={children_parsed}
                  style={vscDarkPlus}
                />
              ) : (
                <code className={className} {...rest}>
                  {children}
                </code>
              )
            },
          }}
        />
      </UiCommonTemplate_Modal_Content>
    )
}
