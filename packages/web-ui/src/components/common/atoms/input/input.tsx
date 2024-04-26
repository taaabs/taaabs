import cn from 'classnames'
import styles from './input.module.scss'

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
    lines?: number
    on_focus?: () => void
    on_blur?: () => void
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
            { [styles['field--disabled']]: props.is_disabled },
          ])}
          onChange={(e) => props.on_change(e.target.value)}
          value={props.value}
          autoFocus={props.autofocus}
          rows={props.lines}
          placeholder={props.placeholder}
        />
      ) : (
        <input
          className={cn([
            styles.field,
            styles.input,
            { [styles['field--error']]: message_type == 'error' },
            { [styles['field--disabled']]: props.is_disabled },
          ])}
          onChange={(e) => props.on_change(e.target.value)}
          value={props.value}
          autoFocus={props.autofocus}
          placeholder={props.placeholder}
          onFocus={props.on_focus}
          onBlur={props.on_blur}
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
