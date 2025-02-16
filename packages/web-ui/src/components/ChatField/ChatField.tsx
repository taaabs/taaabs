import cn from 'classnames'
import styles from './ChatField.module.scss'
import TextareaAutosize from 'react-textarea-autosize'
import { useState, useRef } from 'react'
import { Icon } from '../Icon'

export namespace ChatField {
  type ContextItem = {
    id: string
    title: string
    is_checked: boolean
  }
  export type Props = {
    value: string
    placeholder?: string
    on_change: (value: string) => void
    is_disabled?: boolean
    autofocus?: boolean
    disable_enter_new_lines?: boolean
    on_submit?: () => void
    on_key_down?: (event: React.KeyboardEvent<any>) => void
    context?: ContextItem[]
    on_focus?: () => void
    on_blur?: () => void
  }
}

export const ChatField: React.FC<ChatField.Props> = (props) => {
  const textarea_ref = useRef<HTMLTextAreaElement>(null)
  const [is_focused, set_is_focused] = useState(false)

  const handle_focus = () => {
    set_is_focused(true)
    props.on_focus?.()
  }

  const handle_blur = () => {
    set_is_focused(false)
    props.on_blur?.()
  }

  const handle_container_click = () => {
    textarea_ref.current?.focus()
  }

  return (
    <div
      className={cn(styles.container, {
        [styles['container--focused']]: is_focused,
      })}
      onClick={handle_container_click}
    >
      {props.context && props.context.length > 0 && (
        <div className={styles.context}>
          {props.context.map((item) => (
            <button
              className={cn(styles.context__item, {
                [styles['context__item--selected']]: item.is_checked,
              })}
              key={item.id}
            >
              {item.is_checked && <Icon variant="CHECK" />}
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      )}
      <TextareaAutosize
        ref={textarea_ref}
        onChange={(e) => props.on_change(e.target.value)}
        value={props.value}
        autoFocus={props.autofocus}
        placeholder={props.placeholder}
        minRows={1}
        maxRows={5}
        onFocus={handle_focus}
        onBlur={handle_blur}
        onKeyDown={(e) => {
          props.on_key_down?.(e)
          if (e.key == 'Enter') {
            if (props.disable_enter_new_lines) e.preventDefault()
            props.on_submit?.()
          }
        }}
      />
      <div className={styles.footer}>
        <div className={styles.footer__models}></div>
        <div className={styles.footer__submit}>
          <button onClick={props.on_submit}>
            <Icon variant="SEND" />
          </button>
        </div>
      </div>
    </div>
  )
}
