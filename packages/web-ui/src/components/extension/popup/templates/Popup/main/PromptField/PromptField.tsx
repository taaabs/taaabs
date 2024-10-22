import { Input } from '@web-ui/components/Input'
import styles from './PromptField.module.scss'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Switch } from '@web-ui/components/Switch/Switch'

export namespace PromptField {
  export type Props = {
    value: string
    on_submit: () => void
    on_change: (value: string) => void
    is_switch_disabled: boolean
    is_switch_checked: boolean
    is_switch_visible: boolean
    on_switch_click: () => void
    is_history_enabled: boolean
    prompts_history: string[]
    assistant_selector_slot: React.ReactNode
    is_plain_text_too_long: boolean
    text_not_found: boolean
    translations: {
      new_prompt: string
      placeholder: string
      switch: string
      active_input_placeholder_suffix: string
      plain_text_too_long: React.ReactNode
      text_not_found: React.ReactNode
      active_assistant: string
    }
  }
}

export const PromptField: React.FC<PromptField.Props> = (props) => {
  const [is_focused, set_is_focused] = useState<boolean>(false)
  const [prompts_history_index, set_prompts_history_index] =
    useState<number>(-1)

  const handle_key_down = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!props.is_switch_checked || !props.is_history_enabled) return

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

      <div className={styles.header}>
        <span>{props.translations.new_prompt}</span>

        <div className={styles.header__switch}>
          {props.is_switch_visible && (
            <Switch
              label={props.translations.switch}
              is_checked={props.is_switch_checked}
              on_change={props.on_switch_click}
              is_disabled={props.is_switch_disabled}
            />
          )}
        </div>
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
          (is_focused && props.is_history_enabled && props.is_switch_checked
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

      <div className={styles.footer}>
        <div className={styles['footer__top-line']}>
          <span>{props.translations.active_assistant}</span>
          {props.assistant_selector_slot}
        </div>
        <div className={styles['footer__bottom-line']}>
          <a href="https://github.com/taaabs/taaabs" target="_blank">
            Star on GitHub
          </a>{' '}
          <span>·</span>{' '}
          <a href="https://buymeacoffee.com/robertpiosik" target="_blank">
            Buy me a coffee
          </a>{' '}
          <span>·</span>{' '}
          <a
            href="https://github.com/taaabs/taaabs/discussions"
            target="_blank"
          >
            Send feedback
          </a>
        </div>
      </div>
    </div>
  )
}
