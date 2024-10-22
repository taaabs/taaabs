import React, { useEffect, useRef, useState } from 'react'
import styles from './RecentPrompts.module.scss'
import cn from 'classnames'
import SimpleBar from 'simplebar-react'

import 'simplebar-react/dist/simplebar.min.css'

export namespace RecentPrompts {
  export type Props = {
    recent_prompts: string[]
    default_prompts: string[]
    on_recent_prompt_click: (prompt: string) => void
    on_recent_prompt_middle_click: (prompt: string) => void
    is_disabled: boolean
    filter_phrase: string
    translations: {
      heading: string
      searching_heading: string
    }
  }
}

type FilteredPrompt =
  | string
  | {
      original_prompt: string
      highlighted_prompt: string
    }

export const RecentPrompts: React.FC<RecentPrompts.Props> = (props) => {
  const container_ref = useRef<HTMLDivElement>(null)
  const [container_height, set_container_height] = useState<number>()

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

  // Handle dynamic height
  useEffect(() => {
    if (!container_ref.current) return
    const resize_observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container_ref.current) {
          set_container_height(entry.contentRect.height)
        }
      }
    })
    resize_observer.observe(container_ref.current)
    return () => resize_observer.disconnect()
  }, [])

  return (
    <div className={styles.container} ref={container_ref}>
      <SimpleBar style={{ height: container_height }}>
        <div
          className={cn(styles.prompts, {
            [styles['prompts--disabled']]: props.is_disabled,
          })}
        >
          <div className={styles.prompts__heading}>
            {props.filter_phrase && filtered_prompts.length > 0
              ? props.translations.searching_heading
              : props.translations.heading}
          </div>
          {prompts_to_display.map((prompt, i) => {
            const original_prompt =
              typeof prompt == 'string' ? prompt : prompt.original_prompt
            const prompt_to_display =
              typeof prompt == 'string' ? prompt : prompt.highlighted_prompt
            return (
              <div
                key={i}
                role="button"
                onClick={() => props.on_recent_prompt_click(original_prompt)}
                onAuxClick={() =>
                  props.on_recent_prompt_middle_click(original_prompt)
                }
                className={cn(styles.prompts__button, {
                  [styles['prompts__button--clamp']]: !props.filter_phrase,
                })}
                title={original_prompt}
              >
                {!props.filter_phrase && <sup>{i + 1}</sup>}
                <span>
                  <HighlightedText
                    text={prompt_to_display}
                    highlight={
                      filtered_prompts.length > 0 ? props.filter_phrase : ''
                    }
                  />
                </span>
              </div>
            )
          })}
        </div>
      </SimpleBar>
    </div>
  )
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
    words.includes(part.toLowerCase()) ||
    (i > 0 &&
      // Current part is " " ". " ", "
      /^(?:\s|\. |\s,)\s*$/.test(part) &&
      words.includes(parts[i - 1].toLowerCase())) ? (
      <mark key={i}>{part}</mark>
    ) : (
      part
    ),
  )
}
