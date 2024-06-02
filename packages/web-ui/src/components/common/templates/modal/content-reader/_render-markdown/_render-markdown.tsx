import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import hljs from 'highlight.js'
import styles from './_render-markdown.module.scss'
import { Icon as UiCommonParticle_Icon } from '@web-ui/components/common/particles/icon'
import { toast } from 'react-toastify'

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
          const { children, className } = props
          if (!children?.toString()?.includes('\n')) {
            return <code>{children}</code>
          } else {
            const children_parsed = String(children).replace(/\n$/, '')
            const language = (className?.match(/language-(\S+)/) || [
              null,
              undefined,
            ])[1]
            let language_fallback: string | undefined
            if (!language) {
              language_fallback = hljs.highlightAuto(children_parsed).language
            }
            return language ? (
              <div className={styles.code}>
                <div className={styles.code__header}>
                  <span>{language}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard
                        .writeText(children_parsed)
                        .then(() => {
                          toast.success('Copied to clipboard')
                        })
                    }}
                  >
                    <UiCommonParticle_Icon variant="COPY" />
                  </button>
                </div>
                <SyntaxHighlighter
                  language={language || language_fallback}
                  PreTag={'div'}
                  children={children_parsed}
                  style={oneLight}
                  customStyle={{ marginTop: 0 }}
                />
              </div>
            ) : (
              <code>{children}</code>
            )
          }
        },
      }}
    />
  )
}
