import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import styles from './_RenderMarkdown.module.scss'
import { Icon as UiCommonParticle_Icon } from '@web-ui/components/Icon'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import { language_map } from './language-map'

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
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ children, className }) {
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
              language_fallback = hljs.highlightAuto(
                children_parsed.substring(0, 2000), // Limit length for faster processing
              ).language
            }
            return (
              <div className={styles.code}>
                <div className={styles.code__header}>
                  <div className={styles.code__header__language}>
                    {language && <span>{(language_map as any)[language]}</span>}
                    {language_fallback && (
                      <>
                        <span>
                          {(language_map as any)[language_fallback] ||
                            language_fallback}
                          <sup> unsure</sup>
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard
                        .writeText(children_parsed)
                        .then(() => {
                          alert('Copied to clipboard')
                        })
                    }}
                  >
                    <UiCommonParticle_Icon variant="COPY" />
                  </button>
                </div>
                {language || language_fallback ? (
                  <div
                    className={styles.code__highlight}
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlight(children_parsed, {
                        language: (language || language_fallback)!,
                      }).value,
                    }}
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
