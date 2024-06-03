import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import styles from './_render-markdown.module.scss'
import { Icon as UiCommonParticle_Icon } from '@web-ui/components/common/particles/icon'
import { toast } from 'react-toastify'
import { detect_code_language } from '@web-ui/utils/detect-code-language'

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
              language_fallback = detect_code_language(children_parsed)
            }
            return (
              <div className={styles.code}>
                <div className={styles.code__header}>
                  <div className={styles.code__header__language}>
                    {language ? (
                      <span>{(language_map as any)[language] || language}</span>
                    ) : (
                      ''
                    )}
                    {language_fallback ? (
                      <>
                        <span>
                          {(language_map as any)[language_fallback] ||
                            language_fallback}
                          <sup> detected</sup>
                        </span>
                      </>
                    ) : (
                      ''
                    )}
                  </div>

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
                {language || language_fallback ? (
                  <SyntaxHighlighter
                    language={language || language_fallback}
                    PreTag={'div'}
                    children={children_parsed}
                    style={oneLight}
                    customStyle={{ marginTop: 0 }}
                  />
                ) : (
                  <code className="language-">{children}</code>
                )}
              </div>
            )
          }
        },
      }}
    />
  )
}

const language_map = {
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  python: 'Python',
  ruby: 'Ruby',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  'c++': 'C++',
  php: 'PHP',
  swift: 'Swift',
  go: 'Go',
  r: 'R',
  shell: 'bash',
  bash: 'bash',
  sql: 'SQL',
  json: 'JSON',
  yaml: 'YAML',
  markdown: 'Markdown',
  rust: 'Rust',
  zig: 'Zig',
}
