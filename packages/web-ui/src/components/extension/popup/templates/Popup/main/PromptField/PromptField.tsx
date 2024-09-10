import { Input } from '@web-ui/components/Input'
import styles from './PromptField.module.scss'
import { Checkbox } from '@web-ui/components/Checkbox'
import { useState } from 'react'

export namespace PromptField {
  export type Props = {
    value: string
    on_submit: () => void
    on_change: (value: string) => void
    on_focus: () => void
    is_include_content_checkbox_disabled: boolean
    is_include_content_selected: boolean
    on_include_content_click: () => void
    prompts_history: string[]
    translations: {
      heading: string
      placeholder: string
      include_page_content: string
      active_input_placeholder_suffix: string
    }
  }
}

export const PromptField: React.FC<PromptField.Props> = (props) => {
  const [is_focused, set_is_focused] = useState<boolean>()
  const [prompts_history_index, set_prompts_history_index] =
    useState<number>(-1)
  const [last_typed_text, set_last_typed_text] = useState<string>('')

  const handle_key_down = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!props.is_include_content_selected) return

    if (is_focused) {
      if (event.key == 'ArrowUp') {
        event.preventDefault()
        if (prompts_history_index < props.prompts_history.length - 1) {
          set_prompts_history_index(prompts_history_index + 1)
          props.on_change(props.prompts_history[prompts_history_index + 1])
        }
      } else if (event.key == 'ArrowDown') {
        event.preventDefault()
        if (prompts_history_index > -1) {
          set_prompts_history_index(prompts_history_index - 1)
          if (prompts_history_index - 1 === -1) {
            props.on_change(last_typed_text)
          } else {
            props.on_change(props.prompts_history[prompts_history_index - 1])
          }
        }
      }
    }
  }

  const handle_change = (value: string) => {
    props.on_change?.(value)
    set_last_typed_text(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>{props.translations.heading}</div>
      <div className={styles.field}>
        <Input
          value={props.value}
          on_change={handle_change}
          min_lines={2}
          max_lines={8}
          disable_enter_new_lines={true}
          on_enter_pressed={props.on_submit}
          placeholder={
            props.translations.placeholder +
            (is_focused && props.is_include_content_selected
              ? ` ${props.translations.active_input_placeholder_suffix}`
              : '')
          }
          on_focus={() => {
            set_is_focused(true)
            props.on_focus()
          }}
          on_blur={() => {
            set_is_focused(false)
          }}
          suffix_action={{
            icon_variant: 'SEND',
            on_click: props.on_submit,
          }}
          on_key_down={handle_key_down}
        />

        <Checkbox
          label={props.translations.include_page_content}
          on_click={props.on_include_content_click}
          is_checked={props.is_include_content_selected}
          is_disabled={props.is_include_content_checkbox_disabled}
        />
      </div>
    </div>
  )
}
