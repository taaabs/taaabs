import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import hljs from 'highlight.js'
import styles from './_render-markdown.module.scss'

namespace _RenderMarkdown {
  export type Props = {
    content: string
  }
}

export const _RenderMarkdown: React.FC<_RenderMarkdown.Props> = (props) => {
  return (
    <ReactMarkdown
      className={styles.container}
      children={props.content}
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
              style={oneLight}
              wrapLines={true}
            />
          ) : (
            <code className={className} {...rest}>
              {children}
            </code>
          )
        },
      }}
    />
  )
}
