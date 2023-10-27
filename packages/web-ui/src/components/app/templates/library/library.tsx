import { sharedValues } from '@web-ui/constants'
import useSwipe from 'beautiful-react-hooks/useSwipe'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import useSwipeEvents from 'beautiful-react-hooks/useSwipeEvents'
import cn from 'classnames'
import { useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import StickyBox from 'react-sticky-box'
import { _DesktopTitleBar } from './components/_desktop-title-bar'
import { _MobileTitleBar } from './components/_mobile-title-bar'
import { use_scroll_restore } from './hooks/use-scroll-restore'
import styles from './library.module.scss'
import { use_is_hydrated } from '@shared/hooks'

export namespace Library {
  export type Props = {
    slot_sidebar: React.ReactNode
    slot_aside: React.ReactNode
    title_bar?: string
    slot_bookmarks: React.ReactNode
    is_getting_first_bookmarks: boolean
    is_getting_more_bookmarks: boolean
    has_more_bookmarks: boolean
    no_results: boolean
    get_more_bookmarks: () => void
    clear_selected_tags?: () => void
    clear_date_range?: () => void
    show_bookmarks_skeleton: boolean
    is_user_swiping_months: boolean
  }
}

const SLIDABLE_WIDTH = 300

export const Library: React.FC<Library.Props> = (props) => {
  const container = useRef<HTMLDivElement>(null)
  const sidebar = useRef<HTMLDivElement>(null)
  const main = useRef<HTMLDivElement>(null)
  const aside = useRef<HTMLDivElement>(null)
  const end_of_bookmarks = useRef<HTMLDivElement>(null)
  const is_hydrated = use_is_hydrated()
  use_scroll_restore()
  const is_end_of_bookmarks_visible = useViewportSpy(end_of_bookmarks)

  // Removing 'useSwipeEvents' breaks reload/history back. Investigate why.
  useSwipeEvents(undefined, {
    preventDefault: false,
  })
  const swipe_state_container = useSwipe(container, {
    preventDefault: false,
    threshold: 20,
  })

  const swipe_state_main = useSwipe(main, {
    preventDefault: false,
  })

  const [is_side_left_moving, set_is_side_left_moving] = useState(false)
  const [is_side_right_moving, set_is_side_right_moving] = useState(false)
  const [is_side_left_open, set_is_side_left_open] = useState(false)
  const [is_side_right_open, set_is_side_right_open] = useState(false)

  useUpdateEffect(() => {
    if (props.is_user_swiping_months) return

    if (swipe_state_container.direction == 'left') {
      if (!is_side_left_open && !is_side_right_open) {
        toggle_right_side()
      } else if (is_side_left_open) {
        toggle_left_side()
      }
    } else if (swipe_state_container.direction == 'right') {
      if (!is_side_left_open && !is_side_right_open) {
        toggle_left_side()
      } else if (is_side_right_open) {
        toggle_right_side()
      }
    }
  }, [swipe_state_container])

  useUpdateEffect(() => {
    if (is_side_left_moving || is_side_right_moving) return

    if (
      swipe_state_main.direction == 'down' ||
      swipe_state_main.direction == 'up'
    ) {
      if (is_side_left_open) {
        toggle_left_side()
      } else if (is_side_right_open) {
        toggle_right_side()
      }
    }
  }, [swipe_state_main])

  const toggle_right_side = () => {
    if (is_side_left_moving || is_side_right_moving) return

    if (!is_side_right_open) {
      set_is_side_right_open(true)
      document.body.style.overflow = 'hidden'
    } else {
      set_is_side_right_open(false)
      setTimeout(() => {
        document.body.style.overflow = ''
      }, 300)
    }

    set_is_side_right_moving(true)
    setTimeout(() => {
      set_is_side_right_moving(false)
    }, 300)
  }

  const toggle_left_side = () => {
    if (is_side_left_moving || is_side_right_moving) return
    if (props.is_user_swiping_months) return

    if (!is_side_left_open) {
      set_is_side_left_open(true)
      document.body.style.overflow = 'hidden'
    } else {
      set_is_side_left_open(false)
      setTimeout(() => {
        document.body.style.overflow = ''
      }, 300)
    }

    set_is_side_left_moving(true)
    setTimeout(() => {
      set_is_side_left_moving(false)
    }, 300)
  }

  useUpdateEffect(() => {
    if (
      is_end_of_bookmarks_visible &&
      props.has_more_bookmarks &&
      !props.is_getting_more_bookmarks &&
      !props.is_getting_first_bookmarks
    ) {
      props.get_more_bookmarks()
    }
  }, [is_end_of_bookmarks_visible])

  useUpdateEffect(() => {
    if (!props.is_getting_first_bookmarks) {
      window.scrollTo(0, 0)
    }
  }, [props.is_getting_first_bookmarks])

  return (
    <div className={styles.container} ref={container}>
      <div
        className={cn(styles['mobile-title-bar'], {
          [styles['mobile-title-bar--moved-to-left']]: is_side_right_open,
          [styles['mobile-title-bar--moved-to-right']]: is_side_left_open,
        })}
      >
        <_MobileTitleBar
          swipe_left_on_click={
            !is_side_left_open ? toggle_left_side : undefined
          }
          swipe_right_on_click={
            !is_side_right_open ? toggle_right_side : undefined
          }
          text={props.title_bar ? props.title_bar : undefined}
        />
      </div>
      <div className={styles.content}>
        <div
          className={cn(styles.sidebar, {
            [styles['aside--hidden']]: !(
              (is_side_left_open || is_side_left_moving) &&
              !is_side_right_open
            ),
          })}
          ref={sidebar}
          style={{
            width: `${SLIDABLE_WIDTH}px`,
            zIndex: !is_side_right_open ? undefined : 1,
            pointerEvents: is_side_right_open ? 'none' : undefined,
          }}
        >
          <div
            className={styles.sidebar__inner}
            style={{
              width: `${SLIDABLE_WIDTH}px`,
            }}
          >
            {props.slot_sidebar}
          </div>
        </div>

        <div
          className={cn(styles.main, {
            [styles['main--moved-to-left']]: is_side_right_open,
            [styles['main--moved-to-right']]: is_side_left_open,
            [styles['main--borders']]: is_side_left_open || is_side_right_open,
          })}
          ref={main}
          onClick={() => {
            is_side_left_open && toggle_left_side()
            is_side_right_open && toggle_right_side()
          }}
        >
          <div
            className={styles.main__inner}
            style={{
              pointerEvents:
                is_side_left_open || is_side_right_open ? 'none' : 'all',
            }}
          >
            <div>
              <div
                className={styles['main__inner__desktop-title-bar']}
                style={{
                  visibility: is_hydrated ? 'visible' : 'hidden',
                }}
              >
                <_DesktopTitleBar
                  text={props.title_bar ? props.title_bar : undefined}
                />
              </div>
              <div
                className={cn([
                  styles.main__inner__bookmarks,
                  {
                    [styles['main__inner__bookmarks--loading']]:
                      props.is_getting_first_bookmarks,
                  },
                ])}
                style={{
                  visibility: is_hydrated ? 'visible' : 'hidden',
                }}
              >
                {props.slot_bookmarks}
              </div>
              {props.show_bookmarks_skeleton && (
                <div className={styles['main__inner__skeleton']}>
                  {[...Array(30)].map((_, i) => (
                    <Skeleton key={i} />
                  ))}
                </div>
              )}
              <div
                className={styles['main__inner__info']}
                ref={end_of_bookmarks}
              >
                <span>
                  {props.is_getting_first_bookmarks || props.has_more_bookmarks
                    ? 'Loading...'
                    : props.no_results
                    ? 'No results'
                    : 'End of results'}
                </span>
                {props.clear_selected_tags &&
                  !props.is_getting_first_bookmarks && (
                    <button onClick={props.clear_selected_tags}>
                      Clear selected tags
                    </button>
                  )}
                {props.clear_date_range &&
                  !props.is_getting_first_bookmarks && (
                    <button onClick={props.clear_date_range}>
                      Clear date range
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(styles.aside, {
            [styles['aside--hidden']]: !(
              (is_side_right_open || is_side_right_moving) &&
              !is_side_left_open
            ),
          })}
          ref={aside}
          style={{
            width: `${SLIDABLE_WIDTH}px`,
          }}
        >
          <div className={styles.aside__inner}>
            <div className={styles.aside__inner__stickybox}>
              <StickyBox offsetTop={sharedValues.appHeaderDesktop}>
                {props.slot_aside}
              </StickyBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
