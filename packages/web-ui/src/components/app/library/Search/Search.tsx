import styles from './Search.module.scss'
import { memo, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Icon as UiIcon } from '@web-ui/components/Icon'
import OutsideClickHandler from 'react-outside-click-handler'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'

export namespace Search {
  type Hint = {
    type: 'new' | 'recent'
    completion: string
    search_string: string
  }

  export type Props = {
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
    hints_set_at_timestamp?: number
    queried_at_timestamp?: number
    results_count?: number
    is_slash_shortcut_disabled: boolean
    on_click_get_help: () => void
    is_full_text?: boolean
    toggle_full_text: () => void
    sort_by: SortBy
    translations: {
      placeholder: {
        default: string
        full_text: string
      }
      type: string
      to_search: string
      footer_tip: string
      get_help_link: string
      one_moment_please: string
    }
  }
}

export const Search: React.FC<Search.Props> = memo(
  function Search(props) {
    const input = useRef<HTMLInputElement>(null)
    const [selected_hint_index, set_selected_hint_index] = useState<number>(-1)
    const [is_focusedfix, set_is_focusedfix] = useState(false)
    const [sizer_width, set_sizer_width] = useState(0)
    const sizer = useRef<HTMLDivElement>(null)

    const [is_spinner_spinning, set_is_spinner_spinning] = useState(
      props.is_loading,
    )

    // Spin spinner only after 500ms of loading
    useEffect(() => {
      let timeoutId: NodeJS.Timeout | undefined = undefined
      if (props.is_loading) {
        timeoutId = setTimeout(() => {
          set_is_spinner_spinning(true)
        }, 500)
      } else {
        clearTimeout(timeoutId)
        set_is_spinner_spinning(false)
      }

      return () => clearTimeout(timeoutId)
    }, [props.is_loading])

    useUpdateEffect(() => {
      set_sizer_width(sizer.current?.getBoundingClientRect().width || 0)
    }, [props.search_string])

    useEffect(() => {
      set_is_focusedfix(props.is_focused)
      if (props.is_focused) {
        input.current?.focus()
      }
    }, [props.is_focused])

    const handle_keyboard = (event: KeyboardEvent) => {
      if (props.is_loading || props.is_full_text) return

      if (event.code == 'Escape' && props.is_focused) {
        input.current?.blur()
      } else if (event.code == 'Slash' && !props.is_slash_shortcut_disabled) {
        // Check if the active element is an input or textarea
        const activeElement = document.activeElement
        if (
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement
        ) {
          return // Don't handle slash if already in an input field
        }

        event.preventDefault()
        input.current?.focus()
      } else if (event.code == 'Tab') {
        if (props.hints) {
          event.preventDefault()
          if (
            props.hints[selected_hint_index == -1 ? 0 : selected_hint_index]
          ) {
            props.on_change(
              props.search_string +
                props.hints[selected_hint_index == -1 ? 0 : selected_hint_index]
                  .completion +
                ' ',
            )
          } else {
            props.on_change(props.search_string + ' ')
          }
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
    }, [
      props.hints,
      selected_hint_index,
      props.is_focused,
      props.is_slash_shortcut_disabled,
      props.is_loading,
      props.is_full_text,
    ])

    useUpdateEffect(() => {
      set_selected_hint_index(-1)
    }, [props.hints])

    return (
      <div className={styles.container}>
        <OutsideClickHandler onOutsideClick={props.on_blur}>
          <div
            className={cn(
              styles.box,
              { [styles['box--yields-no-results']]: props.results_count == 0 },
              { [styles['box--focus']]: props.is_focused },
              {
                [styles['box--focus-yields-no-results']]:
                  props.is_focused && props.results_count == 0,
              },
            )}
          >
            <button
              className={styles['box__left-side']}
              onClick={() => {
                if (!props.is_focused && !props.is_loading) {
                  input.current?.focus()
                  input.current!.value = ''
                  input.current!.value = props.search_string
                }
              }}
            >
              {is_spinner_spinning ? (
                <div className={styles.box__loader} />
              ) : (
                <UiIcon variant="SEARCH" />
              )}
            </button>
            {props.search_string.length == 0 && (
              <div className={styles.box__placeholder}>
                {props.is_loading && props.loading_progress_percentage
                  ? `${props.translations.one_moment_please} ${
                      props.loading_progress_percentage + '%'
                    }`
                  : selected_hint_index != -1
                  ? undefined
                  : props.is_full_text
                  ? props.translations.placeholder.full_text
                  : props.translations.placeholder.default}
              </div>
            )}
            <form
              className={styles.box__form}
              onSubmit={(e) => {
                e.preventDefault()
                props.on_submit()
                input.current?.blur()
                props.on_blur()
                set_is_focusedfix(false)
              }}
              onClick={() => {
                if (!props.is_focused && !props.is_loading) {
                  input.current?.focus()
                  input.current?.focus()
                  input.current!.value = ''
                  input.current!.value = props.search_string
                }
              }}
            >
              <div className={styles.box__form__content}>
                <div
                  className={cn(styles['box__form__content__styled-value'], {
                    [styles[
                      'box__form__content__styled-value--yields-no-results'
                    ]]: props.results_count == 0,
                  })}
                >
                  {/* /(?=site:)(.*?)($|\s)/ */}
                  {/* 'lorem site:abc.com site:abc.com ipsum' */}
                  {/* ["lorem ", "site:abc.com", " ", "site:abc.com", " ipsum"] */}
                  {props.search_string
                    .split(/(?=site:)(.*?)($|\s)/)
                    .map((str, i) => {
                      if (str.substring(0, 5) == 'site:') {
                        return (
                          <span key={i}>
                            <span
                              className={
                                styles[
                                  'box__form__content__styled-value__pre-highlight'
                                ]
                              }
                            >
                              site:
                            </span>
                            <span
                              className={cn(
                                styles[
                                  'box__form__content__styled-value__highlight'
                                ],
                                {
                                  [styles[
                                    'box__form__content__styled-value__highlight--no-results'
                                  ]]: props.results_count == 0,
                                },
                              )}
                            >
                              {str.substring(5)}
                            </span>
                          </span>
                        )
                      } else {
                        return <span key={i}>{str}</span>
                      }
                    })}
                  {!props.is_full_text &&
                    (props.search_string || selected_hint_index != -1) &&
                    props.hints &&
                    is_focusedfix && (
                      <>
                        <span
                          className={
                            styles[
                              'box__form__content__styled-value__completion'
                            ]
                          }
                        >
                          {
                            props.hints[
                              selected_hint_index == -1
                                ? 0
                                : selected_hint_index
                            ]?.completion
                          }
                        </span>
                        {props.hints.length > 0 && (
                          <span className={styles['box__form__keycap']}>
                            tab
                          </span>
                        )}
                      </>
                    )}
                </div>
                <div>
                  <div className={styles.box__form__content__sizer} ref={sizer}>
                    {props.search_string}
                  </div>
                  <input
                    ref={input}
                    value={props.search_string}
                    style={{
                      pointerEvents: !props.is_focused ? 'none' : undefined,
                      width: sizer_width > 250 ? `${sizer_width}px` : undefined,
                    }}
                    onBlur={(e) => {
                      if (
                        e.relatedTarget?.className !=
                          styles.hints__list__item &&
                        e.relatedTarget?.className != styles.hints__mode
                      ) {
                        props.on_blur()
                      }
                    }}
                    onFocus={() => {
                      if (!props.is_focused) {
                        props.on_focus()
                      }
                    }}
                    onChange={(e) => {
                      if (!e.target.value.endsWith('  ')) {
                        props.on_change(e.target.value)
                      }
                    }}
                  />
                </div>
              </div>
            </form>
            <div className={styles['box__right-side']}>
              {props.search_string ? (
                <>
                  {props.results_count !== undefined && (
                    <div
                      className={cn(styles['box__right-side__results-count'], {
                        [styles[
                          'box__right-side__results-count--yields-no-results'
                        ]]: props.results_count == 0,
                      })}
                    >
                      {props.results_count == 0
                        ? 'No'
                        : props.results_count ==
                          system_values.max_library_search_results
                        ? `${system_values.max_library_search_results}+`
                        : props.results_count}{' '}
                      {props.results_count == 1 ? 'result' : 'results'}
                    </div>
                  )}
                  <button
                    className={cn(styles['box__right-side__clear'], {
                      [styles['box__right-side__clear--yields-no-results']]:
                        props.results_count == 0,
                    })}
                    onClick={() => {
                      set_is_focusedfix(false)
                      props.on_clear_click()
                    }}
                  >
                    <UiIcon variant="ADD" />
                  </button>
                </>
              ) : (
                !props.is_focused && (
                  <div className={styles['box__right-side__press_key']}>
                    {props.translations.type}
                    <div className={styles.box__form__keycap}>/</div>
                    {props.translations.to_search}
                  </div>
                )
              )}
            </div>
          </div>
          <div
            className={cn(styles.hints, {
              [styles['hints--hidden']]: !(props.hints && is_focusedfix),
            })}
          >
            {/* <button
              className={styles.hints__mode}
              onClick={() => {
                props.toggle_full_text()
                input.current?.focus()
              }}
            >
              <span>Full-text search:</span>
              <span>{props.is_full_text ? 'enabled' : 'disabled'}</span>
            </button> */}

            {!props.is_full_text &&
              props.hints &&
              props.hints.length > 0 &&
              is_focusedfix && (
                <div className={styles.hints__list}>
                  {props.hints.map((hint, i) => (
                    <button
                      key={
                        props.search_string +
                        (hint.completion ? hint.completion : '') +
                        hint.type
                      }
                      className={cn(styles.hints__list__item, {
                        [styles['hints__list__item--selected']]:
                          selected_hint_index == i,
                      })}
                      onClick={() => {
                        props.on_click_hint(i)
                        set_is_focusedfix(false)
                        props.on_blur()
                      }}
                    >
                      <div className={styles.hints__list__item__icon}>
                        {hint.type == 'new' && <UiIcon variant="SEARCH" />}
                        {hint.type == 'recent' && <UiIcon variant="RECENT" />}
                      </div>
                      <div
                        className={cn(styles.hints__list__item__content, {
                          [styles['hints__list__item__content--recent']]:
                            hint.type == 'recent',
                        })}
                      >
                        <span>{hint.search_string}</span>
                        <span>{hint.completion}</span>
                        {selected_hint_index == i && (
                          <div
                            className={
                              styles['hints__list__item__content__keycap']
                            }
                          >
                            enter
                          </div>
                        )}
                      </div>
                      {hint.type == 'recent' && (
                        <div
                          className={styles.hints__list__item__remove}
                          onClick={(e) => {
                            e.stopPropagation()
                            props.on_click_recent_hint_remove(i)
                          }}
                          role="button"
                        >
                          Remove
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            <div className={styles.hints__footer}>
              <span>{props.translations.footer_tip}</span>
              <button onClick={props.on_click_get_help}>
                {props.translations.get_help_link}
              </button>
            </div>
          </div>
        </OutsideClickHandler>
      </div>
    )
  },
  (o, n) =>
    o.is_loading == n.is_loading &&
    o.is_focused == n.is_focused &&
    o.is_full_text == n.is_full_text &&
    o.search_string == n.search_string &&
    o.loading_progress_percentage == n.loading_progress_percentage &&
    o.results_count == n.results_count &&
    o.on_focus == n.on_focus &&
    o.on_blur == n.on_blur &&
    o.on_change == n.on_change &&
    o.on_clear_click == n.on_clear_click &&
    o.on_click_hint == n.on_click_hint &&
    o.on_click_recent_hint_remove == n.on_click_recent_hint_remove &&
    o.hints_set_at_timestamp == n.hints_set_at_timestamp &&
    o.queried_at_timestamp == n.queried_at_timestamp &&
    o.sort_by == n.sort_by,
)
