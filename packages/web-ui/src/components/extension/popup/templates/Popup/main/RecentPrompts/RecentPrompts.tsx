import React from 'react'
import styles from './RecentPrompts.module.scss'
import cn from 'classnames'
import { Icon as UiIcon } from '@web-ui/components/Icon'

export namespace RecentPrompts {
  export type Props = {
    recent_prompts: string[]
    default_prompts: string[]
    on_recent_prompt_click: (prompt: string) => void
    is_disabled: boolean
    filter_phrase: string
  }
}

type FilteredPrompt =
  | string
  | {
      original_prompt: string
      highlighted_prompt: string
    }

const HighlightedText = ({
  text,
  highlight,
}: {
  text: string
  highlight: string
}) => {
  if (!highlight.trim()) return text

  const words = highlight
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length)
  const regex = new RegExp(`(${words.join('|')})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) =>
    words.includes(part.toLowerCase()) ? <mark key={i}>{part}</mark> : part,
  )
}

export const RecentPrompts: React.FC<RecentPrompts.Props> = (props) => {
  const filtered_prompts: FilteredPrompt[] = props.is_disabled
    ? props.recent_prompts
    : props.filter_phrase
    ? props.recent_prompts
        .filter((prompt) => {
          const filter_words = props.filter_phrase
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter((word) => word.length)
          return filter_words.every((word) =>
            prompt.toLowerCase().includes(word),
          )
        })
        .map((prompt) => ({
          original_prompt: prompt,
          highlighted_prompt: prompt,
        }))
    : props.recent_prompts

  const prompts_to_display =
    filtered_prompts.length > 0 ? filtered_prompts : props.recent_prompts

  return (
    <div className={styles.container}>
      <div className={styles.prompts}>
        <div
          className={cn(styles.prompts__inner, {
            [styles['prompts__inner--disabled']]: props.is_disabled,
          })}
        >
          {prompts_to_display.map((prompt, i) => {
            const original_prompt =
              typeof prompt == 'string' ? prompt : prompt.original_prompt
            const prompt_to_display =
              typeof prompt == 'string' ? prompt : prompt.highlighted_prompt
            const is_default_prompt =
              props.default_prompts.includes(original_prompt)

            return (
              <button
                key={i}
                onClick={() => props.on_recent_prompt_click(original_prompt)}
                className={cn(styles.prompts__inner__button, {
                  [styles['prompts__inner__button--clamp']]:
                    !props.filter_phrase,
                })}
                title={original_prompt}
              >
                {is_default_prompt ? (
                  <UiIcon variant="STAR_FILLED" />
                ) : (
                  <div className={styles.prompts__inner__button__dot} />
                )}
                <HighlightedText
                  text={prompt_to_display}
                  highlight={
                    filtered_prompts.length > 0 ? props.filter_phrase : ''
                  }
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
