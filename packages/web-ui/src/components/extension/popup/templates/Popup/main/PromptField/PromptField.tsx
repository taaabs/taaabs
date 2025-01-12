import { Input } from '@web-ui/components/Input'
import styles from './PromptField.module.scss'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export namespace PromptField {
  export type Props = {
    value: string
    on_submit: () => void
    on_change: (value: string) => void
    is_history_enabled: boolean
    prompts_history: string[]
    is_plain_text_too_long: boolean
    text_not_found: boolean
    switches_slot: React.ReactNode
    translations: {
      new_prompt: string
      placeholder: string
      switch: string
      active_input_placeholder_suffix: string
      plain_text_too_long: React.ReactNode
      text_not_found: React.ReactNode
    }
  }
}

export const PromptField: React.FC<PromptField.Props> = (props) => {
  const [is_focused, set_is_focused] = useState<boolean>(false)
  const [prompts_history_index, set_prompts_history_index] =
    useState<number>(-1)

  const handle_key_down = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        <span>{props.translations.new_prompt}</span>
      </div>

      <Input
        value={props.value}
        on_change={handle_change}
        min_lines={2}
        max_lines={8}
        disable_enter_new_lines={true}
        autofocus={true}
        on_enter_pressed={props.on_submit}
        placeholder={
          props.translations.placeholder +
          (is_focused && props.is_history_enabled
            ? ` ${props.translations.active_input_placeholder_suffix}`
            : '')
        }
        on_focus={(e) => {
          set_is_focused(true)
          e.target.select()
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

      {props.switches_slot && (
        <div className={styles.switches}>{props.switches_slot}</div>
      )}

      {props.is_plain_text_too_long && (
        <div className={`${styles.alert} ${styles['alert--warn']}`}>
          {props.translations.plain_text_too_long}
        </div>
      )}
      {props.text_not_found && (
        <div className={`${styles.alert} ${styles['alert--error']}`}>
          {props.translations.text_not_found}
        </div>
      )}
    </div>
  )
}
