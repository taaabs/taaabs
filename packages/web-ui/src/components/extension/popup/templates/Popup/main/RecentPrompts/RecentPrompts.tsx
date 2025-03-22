import React, { useRef } from 'react'
import styles from './RecentPrompts.scss'
import cn from 'classnames'
import { useContextMenu } from 'use-context-menu'
import { Dropdown as UiDropdown } from '@web-ui/components/Dropdown'
import { StandardItem as UiDropdown_StandardItem } from '@web-ui/components/Dropdown/StandardItem'

export type Props = {
  recent_prompts: string[]
  default_prompts: string[]
  on_recent_prompt_click: (prompt: string) => void
  on_recent_prompt_middle_click: (prompt: string) => void
  on_remove_prompt: (prompt: string) => void
  is_disabled: boolean
  filter_phrase: string
  translations: {
    delete: string
  }
}

type FilteredPrompt =
  | string
  | {
      original_prompt: string
      highlighted_prompt: string
    }

export const RecentPrompts: React.FC<Props> = (props) => {
  const prompt_to_remove_ref = useRef<string>()

  const { contextMenu, onContextMenu } = useContextMenu(
    <UiDropdown>
      <UiDropdown_StandardItem
        label={props.translations.delete}
        icon_variant="DELETE"
        on_click={() => {
          props.on_remove_prompt(prompt_to_remove_ref.current!)
          prompt_to_remove_ref.current = undefined
        }}
        is_danger={true}
      />
    </UiDropdown>,
  )

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
    <>
      {contextMenu}
      <div
        className={cn(styles.prompts, {
          [styles['prompts--disabled']]: props.is_disabled,
        })}
      >
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
              onAuxClick={(e) => {
                if (e.button == 1) {
                  // Button check fixes Firefox
                  props.on_recent_prompt_middle_click(original_prompt)
                }
              }}
              onContextMenu={(e) => {
                prompt_to_remove_ref.current = original_prompt
                onContextMenu(e)
              }}
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
    </>
  )
}

const HighlightedText = (params: { text: string; highlight: string }) => {
  if (!params.highlight.trim()) return params.text
  const words = params.highlight
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length)
  const regex = new RegExp(`(${words.join('|')})`, 'gi')
  const parts = params.text.split(regex)
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
