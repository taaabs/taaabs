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
  }
}

export const Input: React.FC<Input.Props> = ({
  message_type = 'info',
  ...props
}) => {
  return (
    <div>
      <input
        className={cn([styles.input])}
        onChange={(e) => props.on_change(e.target.value)}
        value={props.value}
      />
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
