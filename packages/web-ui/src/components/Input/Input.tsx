import cn from 'classnames'
import styles from './Input.module.scss'
import TextareaAutosize from 'react-textarea-autosize'
import { Icon } from '../Icon'

type State = 'error' | 'warning' | 'info'

export namespace Input {
  export type Props = {
    value: string
    placeholder?: string
    on_change: (value: string) => void
    message_type?: State
    message?: React.ReactNode
    is_disabled?: boolean
    autofocus?: boolean
    min_lines?: number
    is_note?: boolean
    on_focus?: () => void
    on_blur?: () => void
    additional_properties?: any
    suffix_action?: { icon_variant: Icon.Variant; on_click?: () => void }
  }
}

export const Input: React.FC<Input.Props> = ({
  message_type = 'info',
  ...props
}) => {
  return (
    <div>
      {props.min_lines ? (
        <TextareaAutosize
          className={cn([
            styles.field,
            styles.textarea,
            { [styles['field--error']]: message_type == 'error' },
            { [styles['field--disabled']]: props.is_disabled },
            { [styles['field--note']]: props.is_note },
          ])}
          onChange={(e) => props.on_change(e.target.value)}
          value={props.value}
          autoFocus={props.autofocus}
          placeholder={props.placeholder}
          minRows={props.min_lines}
        />
      ) : (
        <input
          className={cn([
            styles.field,
            styles.input,
            { [styles['field--error']]: message_type == 'error' },
            { [styles['field--disabled']]: props.is_disabled },
            { [styles['field--note']]: props.is_note },
          ])}
          onChange={(e) => props.on_change(e.target.value)}
          value={props.value}
          autoFocus={props.autofocus}
          placeholder={props.placeholder}
          onFocus={props.on_focus}
          onBlur={props.on_blur}
          {...props.additional_properties}
        />
      )}
      {props.message && (
        <div
          className={cn([
            styles.message,
            { [styles['message--error']]: message_type == 'error' },
            { [styles['message--warning']]: message_type == 'warning' },
            { [styles['message--info']]: message_type == 'info' },
          ])}
        >
          {props.message}
        </div>
      )}
    </div>
  )
}