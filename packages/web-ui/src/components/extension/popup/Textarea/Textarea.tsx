import cn from 'classnames'
import styles from './Textarea.scss'
import TextareaAutosize from 'react-textarea-autosize'
import { useState, useRef, useMemo, useEffect } from 'react'
import { Icon } from '../../../Icon'

export namespace Textarea {
  export type Website = {
    url: string
    title: string
    length: number
    is_pinned: boolean
    favicon?: string
  }
  export type Props = {
    value: string
    placeholder?: string
    on_change: (value: string) => void
    is_disabled?: boolean
    autofocus?: boolean
    disable_enter_new_lines?: boolean
    on_submit: () => void
    on_key_down?: (event: React.KeyboardEvent<any>) => void
    websites?: Website[]
    on_focus?: () => void
    on_blur?: () => void
    on_website_click?: (url: string) => void
    on_pin_click?: (url: string) => void
  }
}

export const Textarea: React.FC<Textarea.Props> = (props) => {
  const textarea_ref = useRef<HTMLTextAreaElement>(null)
  const [is_focused, set_is_focused] = useState(false)

  // Calculate total tokens
  const total_tokens = useMemo(() => {
    let total = 0

    // Add tokens from pinned context items
    if (props.websites) {
      total += props.websites.reduce((sum, item) => sum + item.length / 4, 0)
    }

    // Estimate tokens from input text (approximate 4 chars per token)
    const input_text_tokens = props.value.length / 4
    total += input_text_tokens

    return Math.ceil(total)
  }, [props.value, props.websites])

  const handle_focus = () => {
    set_is_focused(true)
    props.on_focus?.()
    textarea_ref.current!.select()
  }

  const handle_blur = () => {
    set_is_focused(false)
    props.on_blur?.()
  }

  const handle_container_click = () => {
    textarea_ref.current!.focus()
  }

  useEffect(() => {
    if (props.autofocus) {
      textarea_ref.current!.focus()
      textarea_ref.current!.select()
    }
  }, [])

  return (
    <div
      className={cn(styles.container, {
        [styles['container--focused']]: is_focused,
      })}
      onClick={handle_container_click}
    >
      {props.websites && props.websites.length > 0 && (
        <div className={styles.websites}>
          {props.websites.map((item) => (
            <div className={styles.websites__item} key={item.url}>
              <button
                className={styles.websites__item__bar}
                onClick={(e) => {
                  e.stopPropagation()
                  props.on_website_click?.(item.url)
                }}
                title={item.title + ` (${Math.ceil(item.length / 4)} tokens)`}
              >
                {item.favicon && <img src={item.favicon} alt="Favicon" />}
                <span>{item.title}</span>
              </button>
              <div className={styles.websites__item__actions}>
                <button
                  className={cn(styles.websites__item__actions__pin, {
                    [styles['websites__item__actions__pin--pinned']]:
                      item.is_pinned,
                  })}
                  onClick={(e) => {
                    e.stopPropagation()
                    props.on_pin_click?.(item.url)
                  }}
                  title="Pin"
                >
                  {item.is_pinned ? (
                    <Icon variant="PIN_FILLED" />
                  ) : (
                    <Icon variant="PIN" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <TextareaAutosize
        ref={textarea_ref}
        onChange={(e) => props.on_change(e.target.value)}
        value={props.value}
        placeholder={props.placeholder}
        minRows={2}
        maxRows={7}
        onFocus={handle_focus}
        onBlur={handle_blur}
        onKeyDown={(e) => {
          props.on_key_down?.(e)
          if (e.key == 'Enter') {
            if (props.disable_enter_new_lines) e.preventDefault()
            props.on_submit()
          }
        }}
      />
      <div className={styles.footer}>
        <div className={styles.footer__models}></div>
        <div className={styles.footer__right}>
          {total_tokens > 1 && (
            <div
              className={styles.footer__right__total}
              title="Estimated number of tokens in the message"
            >
              {total_tokens} tokens
            </div>
          )}
          <div className={styles.footer__right__submit}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                props.on_submit()
              }}
            >
              <Icon variant="ARROW_RIGHT" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
