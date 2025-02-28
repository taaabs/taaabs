import { Textarea } from '@web-ui/components/extension/popup/Textarea'
import { AssistantSelector } from '@web-ui/components/extension/popup/AssistantSelector'
import styles from './PromptField.module.scss'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { MessageHistory } from '@web-ui/components/extension/popup/MessageHistory'

export namespace PromptField {
  export type Props = {
    value: string
    on_submit: () => void
    on_change: (value: string) => void
    is_history_enabled: boolean
    prompts_history: string[]
    switches_slot: React.ReactNode
    autofocus: boolean
    websites?: Textarea.Website[]
    on_website_click?: (url: string) => void
    on_pin_click?: (url: string) => void
    on_history_back_click?: () => void
    on_history_forward_click?: () => void
    current_history_entry_timestamp?: number
    is_message_history_enabled?: boolean
    translations: {
      new_prompt: string
      placeholder: string
      active_input_placeholder_suffix: string
    }
    assistants: AssistantSelector.Assistant[]
    selected_assistant_name: string
    on_assistant_change: (name: string) => void
  }
}

export const PromptField: React.FC<PromptField.Props> = (props) => {
  const [is_focused, set_is_focused] = useState<boolean>(false)
  const [prompts_history_index, set_prompts_history_index] =
    useState<number>(-1)

  const handle_key_down = (e: React.KeyboardEvent<any>) => {
    if (!props.is_history_enabled) return

    if (is_focused) {
      if (e.key == 'ArrowUp') {
        e.preventDefault()
        if (prompts_history_index < props.prompts_history.length - 1) {
          set_prompts_history_index(prompts_history_index + 1)
          props.on_change(props.prompts_history[prompts_history_index + 1])
        }
      } else if (e.key == 'ArrowDown') {
        e.preventDefault()
        if (prompts_history_index > -1) {
          set_prompts_history_index(prompts_history_index - 1)
          if (prompts_history_index - 1 == -1) {
            props.on_change('')
          } else {
            props.on_change(props.prompts_history[prompts_history_index - 1])
          }
        }
      }
    }
  }

  const handle_change = (value: string) => {
    props.on_change?.(value)
  }

  // After submission we clear value thus index must be reset.
  useUpdateEffect(() => {
    if (props.value == '') {
      set_prompts_history_index(-1)
    }
  }, [props.value])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <AssistantSelector
          assistants={props.assistants}
          selected_name={props.selected_assistant_name}
          on_change={props.on_assistant_change}
        />

        <div>
          {props.is_message_history_enabled && (
            <MessageHistory
              timestamp={props.current_history_entry_timestamp}
              on_history_back_click={props.on_history_back_click}
              on_history_forward_click={props.on_history_forward_click}
            />
          )}
        </div>
      </div>

      <Textarea
        value={props.value}
        on_change={handle_change}
        disable_enter_new_lines={true}
        autofocus={props.autofocus}
        on_submit={props.on_submit}
        placeholder={
          props.translations.placeholder +
          (is_focused && props.is_history_enabled
            ? ` ${props.translations.active_input_placeholder_suffix}`
            : '')
        }
        on_focus={() => {
          set_is_focused(true)
        }}
        on_blur={() => {
          set_is_focused(false)
        }}
        on_key_down={handle_key_down}
        websites={props.websites}
        on_pin_click={props.on_pin_click}
        on_website_click={props.on_website_click}
      />

      {props.switches_slot && (
        <div className={styles.switches}>{props.switches_slot}</div>
      )}
    </div>
  )
}
