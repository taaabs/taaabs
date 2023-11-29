import Skeleton from 'react-loading-skeleton'
import styles from './library-search.module.scss'
import { use_is_hydrated } from '@shared/hooks'
import { Icon } from '@web-ui/components/common/particles/icon'
import { useRef, useState } from 'react'
import cn from 'classnames'
import OutsideClickHandler from 'react-outside-click-handler'

export namespace LibrarySearch {
  type Hint = {
    type: 'new' | 'recent'
    term: string
    completion?: string
    yields?: number
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
    on_click_hint: (index: number) => void
    on_click_recent_hint_remove: (index: number) => void
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
      <OutsideClickHandler
        onOutsideClick={() => {
          props.on_blur()
          set_is_focused(false)
        }}
        disabled={props.hints && props.hints.length > 0}
      >
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
          <button
            className={styles['input__left-side']}
            style={{
              pointerEvents: !is_focused ? 'none' : undefined,
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
            }}
          >
            <div
              className={cn(styles['form__styled-value'], {
                [styles['form__styled-value--yields-no-results']]:
                  props.results_count == 0,
              })}
            >
              {/* /(?=site:)(.*?)($|\s)/ */}
              {/* 'lorem site:abc.com site:abc.com ipsum' */}
              {/* ["lorem ", "site:abc.com", " ", "site:abc.com", " ipsum"] */}
              {props.search_string.split(/(?=site:)(.*?)($|\s)/).map((str) => {
                if (str.substring(0, 5) == 'site:') {
                  return str.split(':').map((str, i) => (
                    <>
                      {i == 0 && (
                        <span
                          className={
                            styles['form__styled-value__pre-highlight']
                          }
                        >
                          {str}
                          {i == 0 && <>{':'}</>}
                        </span>
                      )}
                      {i == 1 && (
                        <>
                          <span
                            className={cn(
                              styles['form__styled-value__highlight'],
                              {
                                [styles[
                                  'form__styled-value__highlight--no-results'
                                ]]: props.results_count == 0,
                              },
                            )}
                          >
                            {str}
                          </span>
                          <span> </span>
                        </>
                      )}
                    </>
                  ))
                } else {
                  return str
                }
              })}
            </div>
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
              onChange={(e) => {
                props.on_change(e.target.value)
              }}
            />
          </form>
          {props.search_string && (
            <div className={styles['input__right-side']}>
              {props.results_count !== undefined && (
                <div
                  className={cn(styles['input__right-side__results-count'], {
                    [styles[
                      'input__right-side__results-count--yields-no-results'
                    ]]: props.results_count == 0,
                  })}
                >
                  {props.results_count == 0 ? 'no' : props.results_count}{' '}
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
                  input.current?.focus()
                }}
              >
                <Icon variant="ADD" />
              </button>
            </div>
          )}
        </div>
      </OutsideClickHandler>
      {props.hints && (
        <div className={styles.hints}>
          <OutsideClickHandler
            onOutsideClick={() => {
              props.on_blur()
              set_is_focused(false)
            }}
            disabled={!props.hints}
          >
            <div className={styles.hints__inner}>
              {props.hints.map((hint, i) => (
                <button
                  key={hint.term + hint.completion + hint.type}
                  className={styles.hints__inner__item}
                  onClick={() => {
                    props.on_click_hint(i)
                    props.on_blur()
                    set_is_focused(false)
                  }}
                >
                  <div className={styles.hints__inner__item__icon}>
                    {hint.type == 'new' && <Icon variant="SEARCH" />}
                    {hint.type == 'recent' && <Icon variant="RECENT" />}
                  </div>
                  <div className={styles.hints__inner__item__text}>
                    <span>{hint.term}</span>
                    {hint.completion && <span>{hint.completion}</span>}
                    {hint.yields && <span>{hint.yields}</span>}
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
          </OutsideClickHandler>
        </div>
      )}
    </div>
  ) : (
    <div className={styles.skeleton}>
      <Skeleton borderRadius={999} />
    </div>
  )
}
