import { sharedValues } from '@web-ui'
import useWindowResize from 'beautiful-react-hooks/useWindowResize'
import useSwipe from 'beautiful-react-hooks/useSwipe'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import cn from 'classnames'
import { useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import StickyBox from 'react-sticky-box'
import { _MobileTitleBar } from './components/_mobile-title-bar'
import styles from './library.module.scss'
import { use_is_hydrated } from '@shared/hooks'
import { useSwipeable } from 'react-swipeable'

export namespace Library {
  export type Props = {
    slot_sidebar: React.ReactNode
    slot_aside: React.ReactNode
    mobile_title_bar?: string
    slot_search: React.ReactNode
    slot_bookmarks: React.ReactNode
    is_updating_bookmarks?: boolean
    is_fetching_first_bookmarks: boolean
    is_fetching_more_bookmarks: boolean
    has_more_bookmarks: boolean
    get_more_bookmarks: () => void
    refresh_results?: () => void
    clear_selected_tags?: () => void
    clear_date_range?: () => void
    clear_unread?: () => void
    clear_selected_stars?: () => void
    show_bookmarks_skeleton: boolean
    info_text?: React.ReactNode
  }
}

const SLIDABLE_WIDTH = 300

export const Library: React.FC<Library.Props> = (props) => {
  const [slidable_width, set_slidable_width] = useState(
    window.innerWidth < 370
      ? window.innerWidth * 0.82
      : window.innerWidth >= 992 && window.innerWidth < 1100
      ? window.innerWidth * 0.27
      : SLIDABLE_WIDTH,
  )
  const on_window_resize = useWindowResize()
  const sidebar = useRef<HTMLDivElement>(null)
  const main = useRef<HTMLDivElement>(null)
  const aside = useRef<HTMLDivElement>(null)
  const end_of_bookmarks = useRef<HTMLDivElement>(null)
  const is_hydrated = use_is_hydrated()
  const is_end_of_bookmarks_visible = useViewportSpy(end_of_bookmarks)
  const [drag_distance, set_drag_distance] = useState<number>(0)
  const [initial_swipe_direction, set_initial_swipe_direction] = useState<
    'Left' | 'Right' | undefined
  >(undefined)

  on_window_resize(() => {
    if (window === undefined) return
    set_slidable_width(
      window.innerWidth < 370
        ? window.innerWidth * 0.82
        : window.innerWidth >= 992 && window.innerWidth < 1100
        ? window.innerWidth * 0.27
        : SLIDABLE_WIDTH,
    )
  })

  const swipe_state_main = useSwipe(main, {
    preventDefault: false,
  })

  const swipeable_handlers = useSwipeable({
    onSwipeStart: ({ dir }) => {
      if (dir == 'Left' || dir == 'Right') {
        document.body.style.overflow = 'hidden'
        set_initial_swipe_direction(dir)
      }
      if (dir == 'Right' && is_right_side_open) {
        set_is_right_side_moving(true)
      } else if (dir == 'Right' && !is_left_side_open) {
        set_is_left_side_moving(true)
      } else if (dir == 'Left' && is_left_side_open) {
        set_is_left_side_moving(true)
      } else if (dir == 'Left' && !is_right_side_open) {
        set_is_right_side_moving(true)
      }
    },
    onSwiping: ({ deltaX, dir }) => {
      if (
        (initial_swipe_direction == 'Left' &&
          dir == 'Left' &&
          deltaX < 0 &&
          deltaX >= -slidable_width &&
          !is_right_side_open) ||
        (initial_swipe_direction == 'Right' &&
          dir == 'Right' &&
          deltaX > 0 &&
          deltaX <= slidable_width &&
          !is_left_side_open)
      ) {
        set_drag_distance(deltaX)
      }
    },
    onSwiped: ({ dir, velocity }) => {
      if (dir == 'Left' || dir == 'Right') {
        if (velocity > 0.2) {
          if (dir == 'Right') {
            if (!is_left_side_open && !is_right_side_open) {
              toggle_left_side()
            } else if (is_right_side_open) {
              toggle_right_side()
            }
          }
          if (dir == 'Left') {
            if (!is_right_side_open && !is_left_side_open) {
              toggle_right_side()
            } else if (is_left_side_open) {
              toggle_left_side()
            }
          }
        } else if (!is_left_side_open && !is_right_side_open) {
          document.body.style.overflow = ''
        }

        setTimeout(() => {
          set_is_right_side_moving(false)
          set_is_left_side_moving(false)
        }, 300)
      }
      set_drag_distance(0)
    },
  })

  const [is_left_side_moving, set_is_left_side_moving] = useState(false)
  const [is_right_side_moving, set_is_right_side_moving] = useState(false)
  const [is_left_side_open, set_is_left_side_open] = useState(false)
  const [is_right_side_open, set_is_right_side_open] = useState(false)

  useUpdateEffect(() => {
    if (is_left_side_moving || is_right_side_moving) return

    if (
      swipe_state_main.direction == 'down' ||
      swipe_state_main.direction == 'up'
    ) {
      if (is_left_side_open) {
        toggle_left_side()
      } else if (is_right_side_open) {
        toggle_right_side()
      }
    }
  }, [swipe_state_main])

  const toggle_right_side = () => {
    document.body.style.overflow = 'hidden'
    set_is_right_side_moving(true)

    if (!is_right_side_open) {
      set_is_right_side_open(true)
    } else {
      set_is_right_side_open(false)
      setTimeout(() => {
        document.body.style.overflow = ''
      }, 300)
    }

    setTimeout(() => {
      set_is_right_side_moving(false)
    }, 300)
  }

  const toggle_left_side = () => {
    document.body.style.overflow = 'hidden'
    set_is_left_side_moving(true)

    if (!is_left_side_open) {
      set_is_left_side_open(true)
    } else {
      set_is_left_side_open(false)
      setTimeout(() => {
        document.body.style.overflow = ''
      }, 300)
    }

    setTimeout(() => {
      set_is_left_side_moving(false)
    }, 300)
  }

  useUpdateEffect(() => {
    if (
      is_end_of_bookmarks_visible &&
      props.has_more_bookmarks &&
      !props.is_fetching_more_bookmarks &&
      !props.is_fetching_first_bookmarks
    ) {
      props.get_more_bookmarks()
    }
  }, [is_end_of_bookmarks_visible])

  useUpdateEffect(() => {
    if (!props.is_fetching_first_bookmarks) {
      window.scrollTo(0, 0)
    }
  }, [props.is_fetching_first_bookmarks])

  let translate_x = 0

  if (is_left_side_open && !drag_distance) {
    translate_x = slidable_width
  } else if (is_right_side_open && !drag_distance) {
    translate_x = -slidable_width
  } else if (!is_left_side_open && !is_right_side_open && drag_distance) {
    translate_x = drag_distance
  } else if (is_left_side_open && drag_distance) {
    translate_x = slidable_width + drag_distance
  } else if (is_right_side_open && drag_distance) {
    translate_x = -slidable_width + drag_distance
  }

  return (
    <div className={styles.container} {...swipeable_handlers}>
      <div
        className={cn(styles['mobile-title-bar'], {
          [styles['free-fall']]: !drag_distance,
        })}
        style={{
          pointerEvents:
            is_right_side_open || is_left_side_open ? 'none' : undefined,
          transform: `translateX(${translate_x}px)`,
        }}
      >
        <_MobileTitleBar
          swipe_left_on_click={
            !is_left_side_open ? toggle_left_side : undefined
          }
          swipe_right_on_click={
            !is_right_side_open ? toggle_right_side : undefined
          }
          text={props.mobile_title_bar ? props.mobile_title_bar : undefined}
        />
      </div>
      <div className={styles.content}>
        <aside
          className={cn(styles.sidebar, {
            [styles['aside--hidden']]:
              (is_right_side_open || is_right_side_moving) &&
              !is_left_side_moving,
          })}
          ref={sidebar}
          style={{
            width: `${slidable_width}px`,
            zIndex: !is_right_side_open ? undefined : 1,
            pointerEvents: is_right_side_open ? 'none' : undefined,
          }}
        >
          <div
            className={styles.sidebar__inner}
            style={{
              width: `${slidable_width}px`,
            }}
          >
            {props.slot_sidebar}
          </div>
        </aside>

        <main
          className={cn(styles.main, {
            [styles['free-fall']]: !drag_distance,
          })}
          ref={main}
          onClick={() => {
            is_left_side_open && toggle_left_side()
            is_right_side_open && toggle_right_side()
          }}
          style={{
            transform: `translateX(${translate_x}px)`,
          }}
        >
          <div
            className={styles.main__inner}
            style={{
              pointerEvents:
                is_left_side_open || is_right_side_open ? 'none' : 'all',
            }}
          >
            <div>
              <div className={styles.main__inner__search}>
                {props.slot_search}
              </div>
              <div
                className={cn([
                  styles.main__inner__bookmarks,
                  {
                    [styles['main__inner__bookmarks--loading']]:
                      props.is_fetching_first_bookmarks ||
                      props.is_updating_bookmarks,
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
                  {[...Array(20)].map((_, i) => (
                    <Skeleton key={i} />
                  ))}
                </div>
              )}
              <div
                className={styles['main__inner__info']}
                ref={end_of_bookmarks}
              >
                {props.info_text && <span>{props.info_text}</span>}
                {props.refresh_results && (
                  <button onClick={props.refresh_results}>
                    Refresh results
                  </button>
                )}
                {props.clear_unread && (
                  <button onClick={props.clear_unread}>Clear unread</button>
                )}
                {props.clear_selected_stars && (
                  <button onClick={props.clear_selected_stars}>
                    Clear stars
                  </button>
                )}
                {props.clear_date_range && (
                  <button onClick={props.clear_date_range}>
                    Clear custom range
                  </button>
                )}
                {props.clear_selected_tags && (
                  <button onClick={props.clear_selected_tags}>
                    Clear tags
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        <aside
          className={styles.aside}
          ref={aside}
          style={{
            width: `${slidable_width}px`,
          }}
        >
          <div className={styles.aside__inner}>
            <div className={styles.aside__inner__stickybox}>
              <StickyBox offsetTop={sharedValues.appHeaderDesktop}>
                {props.slot_aside}
              </StickyBox>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
