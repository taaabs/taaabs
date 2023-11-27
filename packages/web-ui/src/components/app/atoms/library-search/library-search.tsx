import Skeleton from 'react-loading-skeleton'
import styles from './library-search.module.scss'
import { use_is_hydrated } from '@shared/hooks'
import { Icon } from '@web-ui/components/common/particles/icon'
import { useRef, useState } from 'react'
import cn from 'classnames'

export namespace LibrarySearch {
  type Hint = {
    type: 'new' | 'recent'
    text: string
  }
  export type Props = {
    placeholder: string
    search_string: string
    is_loading: boolean
    loading_progress_percentage?: number
    on_focus: () => void
    on_blur: () => void
    on_change: (value: string) => void
    on_submit: () => void
    on_click_clear_search_string: () => void
    on_click_hint: (hint: string) => void
    on_click_recent_hint_remove: (hint: string) => void
    on_clear_click: () => void
    hints?: Hint[]
    results_count?: number
  }
}

export const LibrarySearch: React.FC<LibrarySearch.Props> = (props) => {
  const is_hydrated = use_is_hydrated()
  const [is_focused, set_is_focused] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  return is_hydrated ? (
    <div className={styles.container}>
      <div
        className={cn(
          styles.input,
          { [styles['input--yields-no-results']]: props.results_count == 0 },
          { [styles['input--focus']]: is_focused },
          {
            [styles['input--focus-yields-no-results']]:
              is_focused && props.results_count == 0,
          },
        )}
      >
        {props.is_loading ? (
          <div className={styles.input__loader} />
        ) : (
          <Icon variant="SEARCH" />
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            input.current?.blur()
            props.on_submit()
          }}
        >
          <input
            ref={input}
            value={props.search_string}
            placeholder={
              props.is_loading
                ? `Initializing... ${
                    props.loading_progress_percentage
                      ? props.loading_progress_percentage + '%'
                      : ''
                  }`
                : props.placeholder
            }
            onFocus={() => {
              props.on_focus()
              set_is_focused(true)
            }}
            onBlur={() => {
              props.on_blur()
              set_is_focused(false)
            }}
            onChange={(e) => {
              props.on_change(e.target.value)
            }}
          />
        </form>
        {props.search_string && (
          <div className={styles.input__actions}>
            {props.results_count !== undefined && (
              <div
                className={cn(styles['input__actions__results-count'], {
                  [styles['input__actions__results-count--yields-no-results']]:
                    props.results_count == 0,
                })}
              >
                {props.results_count} results
              </div>
            )}
            <button
              className={cn(styles.input__actions__clear, {
                [styles['input__actions__clear--yields-no-results']]:
                  props.results_count == 0,
              })}
              onClick={props.on_clear_click}
            >
              <Icon variant="ADD" />
            </button>
          </div>
        )}
      </div>
      {props.hints && (
        <div className={styles.hints}>
          {props.hints.map((hint) => (
            <button
              key={hint.text + hint.type}
              className={styles.hints__item}
              onClick={() => {
                props.on_click_hint(hint.text)
              }}
            >
              <div className={styles.hints__item__icon}>
                {hint.type == 'new' && <Icon variant="SEARCH" />}
                {hint.type == 'recent' && <Icon variant="RECENT" />}
              </div>
              <div className={styles.hints__item__text}>
                <span>
                  {hint.text.substring(0, props.search_string.length)}
                </span>
                <span>{hint.text.substring(props.search_string.length)}</span>
              </div>
              {hint.type == 'recent' && (
                <button
                  className={styles.hints__item__remove}
                  onClick={(e) => {
                    e.stopPropagation()
                    props.on_click_recent_hint_remove(hint.text)
                  }}
                >
                  remove
                </button>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className={styles.skeleton}>
      <Skeleton borderRadius={999} />
    </div>
  )
}
