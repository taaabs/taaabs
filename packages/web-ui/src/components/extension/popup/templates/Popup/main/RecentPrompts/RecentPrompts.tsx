import React, { useEffect, useRef, useState } from 'react'
import styles from './RecentPrompts.module.scss'
import cn from 'classnames'
import SimpleBar from 'simplebar-react'
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
    heading: string
    searching_heading: string
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
  const container_ref = useRef<HTMLDivElement>(null)
  const [container_height, set_container_height] = useState<number>()
  const simplebar_ref = useRef<any>()
  const [show_top_shadow, set_show_top_shadow] = useState(false)
  const [show_bottom_shadow, set_show_bottom_shadow] = useState(true)
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

  // Subscribe to scroll events of simplebar
  useEffect(() => {
    const simplebar_el = simplebar_ref.current.getScrollElement()
    const handle_scroll = () => {
      set_show_top_shadow(simplebar_el.scrollTop > 5)
      set_show_bottom_shadow(
        simplebar_el.scrollTop + simplebar_el.clientHeight + 5 <
          simplebar_el.scrollHeight,
      )
    }
    simplebar_el.addEventListener('scroll', handle_scroll)
    return () => simplebar_el.removeEventListener('scroll', handle_scroll)
  }, [])

  return (
    <div
      className={cn(styles.container, {
        [styles['container--show-top-shadow']]: show_top_shadow,
        [styles['container--show-bottom-shadow']]: show_bottom_shadow,
      })}
      ref={container_ref}
    >
      {contextMenu}
      <SimpleBar
        style={{ height: container_height }}
        ref={simplebar_ref}
      >
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
      </SimpleBar>
    </div>
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
