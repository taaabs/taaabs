import Skeleton from 'react-loading-skeleton'
import styles from './library-search.module.scss'
import { use_is_hydrated } from '@shared/hooks'
import { memo, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { system_values } from '@shared/constants/system-values'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { Icon } from '@web-ui/components/common/particles/icon'
import OutsideClickHandler from 'react-outside-click-handler'

export namespace LibrarySearch {
  type Hint = {
    type_: 'new' | 'recent'
    completion_: string
    search_string_: string
  }

  export type Props = {
    search_string_: string
    is_loading_: boolean
    is_focused_: boolean
    loading_progress_percentage_?: number
    on_focus_: () => void
    on_blur_: () => void
    on_change_: (value: string) => void
    on_submit_: () => void
    on_click_hint_: (index: number) => void
    on_click_recent_hint_remove_: (index: number) => void
    on_clear_click_: () => void
    hints_?: Hint[]
    hints_set_at_timestamp_?: number
    queried_at_timestamp_?: number
    results_count_?: number
    is_slash_shortcut_disabled_: boolean
    on_click_get_help_: () => void
    is_full_text_?: boolean
    toggle_full_text_: () => void
    translations_: {
      placeholder_: {
        default_: string
        full_text_: string
      }
      type_: string
      to_search_: string
      footer_tip_: string
      get_help_link_: string
      one_moment_please_: string
    }
  }
}

export const LibrarySearch: React.FC<LibrarySearch.Props> = memo(
  function LibrarySearch(props) {
    const is_hydrated = use_is_hydrated()
    const input = useRef<HTMLInputElement>(null)
    const [selected_hint_index, set_selected_hint_index] = useState<number>(-1)
    const [is_focused_fix, set_is_focused_fix] = useState(false)
    const [sizer_width, set_sizer_width] = useState(0)
    const sizer = useRef<HTMLDivElement>(null)

    useUpdateEffect(() => {
      set_sizer_width(sizer.current?.getBoundingClientRect().width || 0)
    }, [props.search_string_])

    useEffect(() => {
      set_is_focused_fix(props.is_focused_)
      if (props.is_focused_) {
        input.current?.focus()
      }
    }, [props.is_focused_])

    const handle_keyboard = (event: any) => {
      if (props.is_loading_ || props.is_full_text_) return

      if (event.code == 'Escape' && props.is_focused_) {
        input.current?.blur()
      } else if (
        event.code == 'Slash' &&
        !props.is_focused_ &&
        !props.is_slash_shortcut_disabled_
      ) {
        event.preventDefault()
        input.current?.focus()
      } else if (event.code == 'Tab') {
        if (props.hints_) {
          event.preventDefault()
          if (
            props.hints_[selected_hint_index == -1 ? 0 : selected_hint_index]
          ) {
            props.on_change_(
              props.search_string_ +
                props.hints_[
                  selected_hint_index == -1 ? 0 : selected_hint_index
                ].completion_ +
                ' ',
            )
          } else {
            props.on_change_(props.search_string_ + ' ')
          }
        }
      } else if (event.code == 'ArrowDown') {
        if (props.hints_) {
          event.preventDefault()
          set_selected_hint_index(
            props.hints_.length == selected_hint_index + 1
              ? 0
              : selected_hint_index + 1,
          )
        }
      } else if (event.code == 'ArrowUp') {
        if (props.hints_) {
          event.preventDefault()
          set_selected_hint_index(
            selected_hint_index == 0 || selected_hint_index == -1
              ? props.hints_.length - 1
              : selected_hint_index - 1,
          )
        }
      } else if (event.code == 'Enter') {
        if (props.hints_ && selected_hint_index != -1) {
          props.on_change_(
            props.search_string_ +
              props.hints_[selected_hint_index].completion_,
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
      props.hints_,
      selected_hint_index,
      props.is_focused_,
      props.is_slash_shortcut_disabled_,
      props.is_loading_,
      props.is_full_text_,
    ])

    useUpdateEffect(() => {
      set_selected_hint_index(-1)
    }, [props.hints_])

    return is_hydrated ? (
      <div
        className={styles.container}
        style={{ pointerEvents: props.is_loading_ ? 'none' : undefined }}
      >
        <OutsideClickHandler onOutsideClick={props.on_blur_}>
          <div
            className={cn(
              styles.box,
              { [styles['box--yields-no-results']]: props.results_count_ == 0 },
              { [styles['box--focus']]: props.is_focused_ },
              {
                [styles['box--focus-yields-no-results']]:
                  props.is_focused_ && props.results_count_ == 0,
              },
            )}
          >
            <button
              className={styles['box__left-side']}
              onClick={() => {
                if (!props.is_focused_) {
                  input.current?.focus()
                  input.current!.value = ''
                  input.current!.value = props.search_string_
                }
              }}
            >
              {props.is_loading_ ? (
                <div className={styles.box__loader} />
              ) : (
                <Icon variant="SEARCH" />
              )}
            </button>
            <form
              className={styles.box__form}
              onSubmit={(e) => {
                e.preventDefault()
                props.on_submit_()
                input.current?.blur()
                props.on_blur_()
                set_is_focused_fix(false)
              }}
              onClick={() => {
                if (!props.is_focused_) {
                  input.current?.focus()
                  input.current?.focus()
                  input.current!.value = ''
                  input.current!.value = props.search_string_
                }
              }}
            >
              <div className={styles.box__form__content}>
                <div
                  className={cn(styles['box__form__content__styled-value'], {
                    [styles[
                      'box__form__content__styled-value--yields-no-results'
                    ]]: props.results_count_ == 0,
                  })}
                >
                  {/* /(?=site:)(.*?)($|\s)/ */}
                  {/* 'lorem site:abc.com site:abc.com ipsum' */}
                  {/* ["lorem ", "site:abc.com", " ", "site:abc.com", " ipsum"] */}
                  {props.search_string_
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
                                  ]]: props.results_count_ == 0,
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
                  {!props.is_full_text_ &&
                    (props.search_string_ || selected_hint_index != -1) &&
                    props.hints_ &&
                    is_focused_fix && (
                      <>
                        <span
                          className={
                            styles[
                              'box__form__content__styled-value__completion'
                            ]
                          }
                        >
                          {
                            props.hints_[
                              selected_hint_index == -1
                                ? 0
                                : selected_hint_index
                            ]?.completion_
                          }
                        </span>
                        {props.hints_.length > 0 && (
                          <span className={styles['box__form__keycap']}>
                            tab
                          </span>
                        )}
                      </>
                    )}
                </div>
                <div>
                  <div className={styles.box__form__content__sizer} ref={sizer}>
                    {props.search_string_}
                  </div>
                  <input
                    ref={input}
                    value={props.search_string_}
                    style={{
                      pointerEvents: !props.is_focused_ ? 'none' : undefined,
                      width: sizer_width > 250 ? `${sizer_width}px` : undefined,
                    }}
                    placeholder={
                      props.is_loading_ && props.loading_progress_percentage_
                        ? `${props.translations_.one_moment_please_} ${
                            props.loading_progress_percentage_ + '%'
                          }`
                        : selected_hint_index != -1
                        ? undefined
                        : props.is_full_text_
                        ? props.translations_.placeholder_.full_text_
                        : props.translations_.placeholder_.default_
                    }
                    onBlur={(e) => {
                      if (
                        e.relatedTarget?.className !=
                          styles.hints__list__item &&
                        e.relatedTarget?.className != styles.hints__mode
                      ) {
                        props.on_blur_()
                      }
                    }}
                    onFocus={() => {
                      if (!props.is_focused_) {
                        props.on_focus_()
                      }
                    }}
                    onChange={(e) => {
                      if (!e.target.value.endsWith('  ')) {
                        props.on_change_(e.target.value)
                      }
                    }}
                  />
                </div>
              </div>
            </form>
            <div className={styles['box__right-side']}>
              {props.search_string_ ? (
                <>
                  {props.results_count_ !== undefined && (
                    <div
                      className={cn(styles['box__right-side__results-count'], {
                        [styles[
                          'box__right-side__results-count--yields-no-results'
                        ]]: props.results_count_ == 0,
                      })}
                    >
                      {props.results_count_ == 0
                        ? 'No'
                        : props.results_count_ ==
                          system_values.max_library_search_results
                        ? `${system_values.max_library_search_results}+`
                        : props.results_count_}{' '}
                      {props.results_count_ == 1 ? 'result' : 'results'}
                    </div>
                  )}
                  <button
                    className={cn(styles['box__right-side__clear'], {
                      [styles['box__right-side__clear--yields-no-results']]:
                        props.results_count_ == 0,
                    })}
                    onClick={() => {
                      set_is_focused_fix(false)
                      props.on_clear_click_()
                    }}
                  >
                    <Icon variant="ADD" />
                  </button>
                </>
              ) : (
                !props.is_focused_ && (
                  <div className={styles['box__right-side__press_key']}>
                    {props.translations_.type_}
                    <div className={styles.box__form__keycap}>/</div>
                    {props.translations_.to_search_}
                  </div>
                )
              )}
            </div>
          </div>
          <div
            className={cn(styles.hints, {
              [styles['hints--hidden']]: !(props.hints_ && is_focused_fix),
            })}
          >
            <button
              className={styles.hints__mode}
              onClick={() => {
                props.toggle_full_text_()
                input.current?.focus()
              }}
            >
              <span>Full-text search:</span>
              <span>{props.is_full_text_ ? 'enabled' : 'disabled'}</span>
            </button>

            {!props.is_full_text_ &&
              props.hints_ &&
              props.hints_.length > 0 &&
              is_focused_fix && (
                <div className={styles.hints__list}>
                  {props.hints_.map((hint, i) => (
                    <button
                      key={
                        props.search_string_ +
                        (hint.completion_ ? hint.completion_ : '') +
                        hint.type_
                      }
                      className={cn(styles.hints__list__item, {
                        [styles['hints__list__item--selected']]:
                          selected_hint_index == i,
                      })}
                      onClick={() => {
                        props.on_click_hint_(i)
                        set_is_focused_fix(false)
                        props.on_blur_()
                      }}
                    >
                      <div className={styles.hints__list__item__icon}>
                        {hint.type_ == 'new' && <Icon variant="SEARCH" />}
                        {hint.type_ == 'recent' && <Icon variant="RECENT" />}
                      </div>
                      <div
                        className={cn(styles.hints__list__item__content, {
                          [styles['hints__list__item__content--recent']]:
                            hint.type_ == 'recent',
                        })}
                      >
                        <span>{hint.search_string_}</span>
                        <span>{hint.completion_}</span>
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
                      {hint.type_ == 'recent' && (
                        <div
                          className={styles.hints__list__item__remove}
                          onClick={(e) => {
                            e.stopPropagation()
                            props.on_click_recent_hint_remove_(i)
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
              <span>{props.translations_.footer_tip_}</span>
              <button onClick={props.on_click_get_help_}>
                {props.translations_.get_help_link_}
              </button>
            </div>
          </div>
        </OutsideClickHandler>
      </div>
    ) : (
      <div className={styles.skeleton}>
        <Skeleton />
      </div>
    )
  },
  (o, n) =>
    o.is_loading_ == n.is_loading_ &&
    o.is_focused_ == n.is_focused_ &&
    o.is_full_text_ == n.is_full_text_ &&
    o.search_string_ == n.search_string_ &&
    o.loading_progress_percentage_ == n.loading_progress_percentage_ &&
    o.results_count_ == n.results_count_ &&
    o.on_focus_ == n.on_focus_ &&
    o.on_blur_ == n.on_blur_ &&
    o.on_change_ == n.on_change_ &&
    o.on_clear_click_ == n.on_clear_click_ &&
    o.on_click_hint_ == n.on_click_hint_ &&
    o.on_click_recent_hint_remove_ == n.on_click_recent_hint_remove_ &&
    o.hints_set_at_timestamp_ == n.hints_set_at_timestamp_ &&
    o.queried_at_timestamp_ == n.queried_at_timestamp_,
)
