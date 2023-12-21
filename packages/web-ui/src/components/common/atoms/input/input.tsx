import cn from 'classnames'
import styles from './input.module.scss'

type MessageType = 'error' | 'warning' | 'info'

export namespace Input {
  export type Props = {
    value: string
    on_change: (value: string) => void
    message_type?: MessageType
    message?: React.ReactNode
    is_disabled?: boolean
    autofocus?: boolean
    lines?: number
  }
}

export const Input: React.FC<Input.Props> = ({
  message_type = 'info',
  ...props
}) => {
  return (
    <div>
      {props.lines && props.lines > 1 ? (
        <textarea
          className={cn([
            styles.field,
            styles.textarea,
            { [styles['field--error']]: message_type == 'error' },
          ])}
          onChange={(e) => props.on_change(e.target.value)}
          value={props.value}
          autoFocus={props.autofocus}
          rows={props.lines}
        />
      ) : (
        <input
          className={cn([
            styles.field,
            styles.input,
            { [styles['field--error']]: message_type == 'error' },
          ])}
          onChange={(e) => props.on_change(e.target.value)}
          value={props.value}
          autoFocus={props.autofocus}
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
