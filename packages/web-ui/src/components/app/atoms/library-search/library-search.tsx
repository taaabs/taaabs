import Skeleton from 'react-loading-skeleton'
import styles from './library-search.module.scss'
import { use_is_hydrated } from '@shared/hooks'
import { Icon } from '@web-ui/components/common/particles/icon'
import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export namespace LibrarySearch {
  type Hint = {
    type: 'new' | 'recent'
    completion: string
  }
  export type Props = {
    placeholder: string
    search_string: string
    is_loading: boolean
    is_focused: boolean
    loading_progress_percentage?: number
    on_focus: () => void
    on_blur: () => void
    on_change: (value: string) => void
    on_submit: () => void
    on_click_hint: (index: number) => void
    on_click_recent_hint_remove: (index: number) => void
    on_clear_click: () => void
    hints?: Hint[]
    results_count?: number
  }
}

export const LibrarySearch: React.FC<LibrarySearch.Props> = (props) => {
  const is_hydrated = use_is_hydrated()
  const input = useRef<HTMLInputElement>(null)
  const [selected_hint_index, set_selected_hint_index] = useState<number>(-1)

  const handle_keyboard = (event: any) => {
    if (event.code == 'Slash' && !props.is_focused) {
      event.preventDefault()
      input.current?.focus()
    } else if (event.code == 'Tab') {
      if (props.hints) {
        event.preventDefault()
        props.on_change(
          props.search_string +
            props.hints[selected_hint_index == -1 ? 0 : selected_hint_index]
              .completion +
            ' ',
        )
      }
    } else if (event.code == 'ArrowDown') {
      if (props.hints) {
        event.preventDefault()
        set_selected_hint_index(
          props.hints.length == selected_hint_index + 1
            ? 0
            : selected_hint_index + 1,
        )
      }
    } else if (event.code == 'ArrowUp') {
      if (props.hints) {
        event.preventDefault()
        set_selected_hint_index(
          selected_hint_index == 0 || selected_hint_index == -1
            ? props.hints.length - 1
            : selected_hint_index - 1,
        )
      }
    } else if (event.code == 'Enter') {
      if (props.hints && selected_hint_index != -1) {
        props.on_change(
          props.search_string + props.hints[selected_hint_index].completion,
        )
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handle_keyboard)

    return () => {
      window.removeEventListener('keydown', handle_keyboard)
    }
  }, [props.hints, selected_hint_index, props.is_focused])

  useUpdateEffect(() => {
    set_selected_hint_index(-1)
  }, [props.hints])

  return is_hydrated ? (
    <div className={styles.container}>
      <div
        className={cn(
          styles.input,
          { [styles['input--yields-no-results']]: props.results_count == 0 },
          { [styles['input--focus']]: props.is_focused },
          {
            [styles['input--focus-yields-no-results']]:
              props.is_focused && props.results_count == 0,
          },
        )}
      >
        <button
          className={styles['input__left-side']}
          onClick={() => {
            if (!props.is_focused) {
              input.current?.focus()
              input.current!.value = ''
              input.current!.value = props.search_string
            }
          }}
        >
          {props.is_loading ? (
            <div className={styles.input__loader} />
          ) : (
            <Icon variant="SEARCH" />
          )}
        </button>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault()
            props.on_submit()
            input.current?.blur()
            props.on_blur()
          }}
          onClick={() => {
            if (!props.is_focused) {
              input.current?.focus()
              input.current?.focus()
              input.current!.value = ''
              input.current!.value = props.search_string
            }
          }}
        >
          <div
            className={cn(styles['form__styled-value'], {
              [styles['form__styled-value--yields-no-results']]:
                props.results_count == 0,
            })}
          >
            {/* /(?=@)(.*?)($|\s)/ */}
            {/* 'lorem @abc.com @abc.com ipsum' */}
            {/* ["lorem ", "@abc.com", " ", "@abc.com", " ipsum"] */}
            {props.search_string.split(/(?=@)(.*?)($|\s)/).map((str) => {
              if (str.substring(0, 1) == '@') {
                return (
                  <>
                    <span
                      className={styles['form__styled-value__pre-highlight']}
                    >
                      @
                    </span>
                    <>
                      <span
                        className={cn(styles['form__styled-value__highlight'], {
                          [styles['form__styled-value__highlight--no-results']]:
                            props.results_count == 0,
                        })}
                      >
                        {str.substring(1)}
                      </span>
                    </>
                  </>
                )
              } else {
                return <span>{str}</span>
              }
            })}
            {(props.search_string || selected_hint_index != -1) &&
              props.hints && (
                <>
                  <span className={styles['form__styled-value__completion']}>
                    {
                      props.hints[
                        selected_hint_index == -1 ? 0 : selected_hint_index
                      ]?.completion
                    }
                  </span>
                  <span className={styles['form__keycap']}>tab</span>
                </>
              )}
          </div>
          <input
            ref={input}
            value={props.search_string}
            style={{
              pointerEvents: !props.is_focused ? 'none' : undefined,
            }}
            placeholder={
              props.is_loading
                ? `One moment please... ${
                    props.loading_progress_percentage
                      ? props.loading_progress_percentage + '%'
                      : ''
                  }`
                : selected_hint_index != -1
                ? undefined
                : props.placeholder
            }
            onBlur={() => {
              setTimeout(() => {
                props.on_blur()
              }, 100)
            }}
            onFocus={() => {
              if (!props.is_focused) {
                props.on_focus()
              }
            }}
            onChange={(e) => {
              props.on_change(e.target.value)
            }}
          />
        </form>
        <div className={styles['input__right-side']}>
          {props.search_string ? (
            <>
              {props.results_count !== undefined && (
                <div
                  className={cn(styles['input__right-side__results-count'], {
                    [styles[
                      'input__right-side__results-count--yields-no-results'
                    ]]: props.results_count == 0,
                  })}
                >
                  {props.results_count == 0
                    ? 'no'
                    : props.results_count ==
                      system_values.max_library_search_results
                    ? `${system_values.max_library_search_results}+`
                    : props.results_count}{' '}
                  {props.results_count == 1 ? 'result' : 'results'}
                </div>
              )}
              <button
                className={cn(styles['input__right-side__clear'], {
                  [styles['input__right-side__clear--yields-no-results']]:
                    props.results_count == 0,
                })}
                onClick={() => {
                  props.on_clear_click()
                }}
              >
                <Icon variant="ADD" />
              </button>
            </>
          ) : (
            !props.is_focused && (
              <div className={styles['input__right-side__press_key']}>
                Type <div className={styles.form__keycap}>/</div> to search
              </div>
            )
          )}
        </div>
      </div>
      {props.hints && (
        <div className={styles.hints}>
          <div className={styles.hints__inner}>
            {props.hints.map((hint, i) => (
              <button
                key={
                  props.search_string +
                  (hint.completion ? hint.completion : '') +
                  hint.type
                }
                className={cn(styles.hints__inner__item, {
                  [styles['hints__inner__item--selected']]:
                    selected_hint_index == i,
                })}
                onClick={() => {
                  props.on_click_hint(i)
                }}
              >
                <div className={styles.hints__inner__item__icon}>
                  {hint.type == 'new' && <Icon variant="SEARCH" />}
                  {hint.type == 'recent' && <Icon variant="RECENT" />}
                </div>
                <div
                  className={cn(styles.hints__inner__item__content, {
                    [styles['hints__inner__item__content--recent']]:
                      hint.type == 'recent',
                  })}
                >
                  <span>{props.search_string}</span>
                  <span>{hint.completion}</span>
                  {selected_hint_index == i && (
                    <div
                      className={styles['hints__inner__item__content__keycap']}
                    >
                      enter
                    </div>
                  )}
                </div>
                {hint.type == 'recent' && (
                  <button
                    className={styles.hints__inner__item__remove}
                    onClick={(e) => {
                      e.stopPropagation()
                      props.on_click_recent_hint_remove(i)
                    }}
                  >
                    remove
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className={styles.skeleton}>
      <Skeleton borderRadius={999} />
    </div>
  )
}
