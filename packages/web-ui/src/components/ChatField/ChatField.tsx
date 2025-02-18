import cn from 'classnames'
import styles from './ChatField.module.scss'
import TextareaAutosize from 'react-textarea-autosize'
import { useState, useRef, useMemo } from 'react'
import { Icon } from '../Icon'

export namespace ChatField {
  type ContextItem = {
    url: string
    title: string
    tokens: number
    favicon: string
    is_pinned: boolean
    is_enabled: boolean
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
    on_context_item_title_click?: (url: string) => void
    on_context_item_pin_click?: (url: string) => void
  }
}

export const ChatField: React.FC<ChatField.Props> = (props) => {
  const textarea_ref = useRef<HTMLTextAreaElement>(null)
  const [is_focused, set_is_focused] = useState(false)

  // Calculate total tokens
  const total_tokens = useMemo(() => {
    let total = 0

    // Add tokens from pinned context items
    if (props.context) {
      total += props.context
        .filter((item) => item.is_enabled)
        .reduce((sum, item) => sum + item.tokens, 0)
    }

    // Estimate tokens from input text (approximate 4 chars per token)
    const input_text_tokens = Math.ceil(props.value.length / 4)
    total += input_text_tokens

    return total
  }, [props.value, props.context])

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
            <div className={styles.context__item} key={item.url}>
              <button
                className={cn(styles.context__item__bar, {
                  [styles['context__item__bar--selected']]: item.is_pinned,
                })}
                onClick={() => props.on_context_item_title_click?.(item.url)}
                title={item.title + ` (${item.tokens} tokens)`}
              >
                {item.favicon && <img src={item.favicon} />}
                <span>{item.title}</span>
              </button>
              <button
                className={cn(styles.context__item__pin, {
                  [styles['context__item__pin--pinned']]: item.is_pinned,
                })}
                onClick={() => props.on_context_item_pin_click?.(item.url)}
              >
                {item.is_pinned ? (
                  <Icon variant="PIN_FILLED" />
                ) : (
                  <Icon variant="PIN" />
                )}
              </button>
            </div>
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
        <div className={styles.footer__right}>
          <div className={styles.footer__right__total}>
            {total_tokens > 1000 ? total_tokens : ''}
          </div>
          <div className={styles.footer__right__submit}>
            <button onClick={props.on_submit}>
              <Icon variant="SEND" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
