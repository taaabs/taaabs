import useWindowResize from 'beautiful-react-hooks/useWindowResize'
import useSwipe from 'beautiful-react-hooks/useSwipe'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import StickyBox from 'react-sticky-box'
import { MobileTitleBar as Subcomponent_MobileTitleBar } from './components/mobile-title-bar'
import styles from './library.module.scss'
import { use_is_hydrated } from '@shared/hooks'
import { useSwipeable } from 'react-swipeable'
import { shared_values } from '@web-ui/constants'
import { use_is_scrolled } from '@web-ui/hooks/use-is-scrolled'

export namespace Library {
  export type Props = {
    slot_sidebar: React.ReactNode
    slot_aside: React.ReactNode
    slot_toolbar: React.ReactNode
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
    show_bookmarks_skeleton: boolean
    info_text?: React.ReactNode
    close_aside_count?: number
  }
}

export const Library: React.FC<Library.Props> = (props) => {
  const [slidable_width, set_slidable_width] = useState(0)
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
  const is_scrolled = use_is_scrolled()

  const get_slidable_width = () => {
    return window.innerWidth < 370 ? window.innerWidth * 0.82 : 300
  }

  on_window_resize(() => {
    set_slidable_width(get_slidable_width())
  })

  useEffect(() => {
    set_slidable_width(get_slidable_width())
  }, [])

  const swipe_state_main = useSwipe(main, {
    preventDefault: false,
  })

  const swipeable_handlers = useSwipeable({
    onSwipeStart: ({ dir, event }) => {
      // Check if user is not dragging over "custom range" handlers.
      if (
        (event.target as any)?.nodeName == 'rect' ||
        (event.target as any)?.nodeName == 'line' ||
        window.innerWidth >= 992
      )
        return

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
    onSwiping: ({ deltaX, dir, event }) => {
      if (
        (event.target as any)?.nodeName == 'rect' ||
        (event.target as any)?.nodeName == 'line' ||
        window.innerWidth >= 992
      )
        return

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
    onSwiped: ({ dir, velocity, event }) => {
      if (
        (event.target as any)?.nodeName == 'rect' ||
        (event.target as any)?.nodeName == 'line' ||
        window.innerWidth >= 992
      )
        return

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
      }, 250)
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
      }, 250)
    }

    setTimeout(() => {
      set_is_right_side_moving(false)
    }, 250)
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
      }, 250)
    }

    setTimeout(() => {
      set_is_left_side_moving(false)
    }, 250)
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

  useUpdateEffect(() => {
    if (is_left_side_open) {
      toggle_left_side()
    } else if (is_right_side_open) {
      toggle_right_side()
    }
  }, [props.close_aside_count])

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
      <div className={styles.toolbar}>
        <div>{props.slot_toolbar}</div>
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
            style={{ width: `${slidable_width}px` }}
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
            className={cn(styles.main__inner, {
              [styles['main__inner--dimmed']]:
                (is_right_side_open || is_left_side_open) && !drag_distance,
            })}
            style={{
              pointerEvents:
                is_left_side_open || is_right_side_open ? 'none' : 'all',
            }}
          >
            <div>
              <div
                className={cn(styles.main__inner__sticky, {
                  [styles['main__inner__sticky--scrolled']]: is_scrolled,
                })}
              >
                <div
                  className={styles['main__inner__sticky__mobile-title-bar']}
                >
                  <Subcomponent_MobileTitleBar
                    swipe_left_on_click={
                      !is_left_side_open ? toggle_left_side : undefined
                    }
                    swipe_right_on_click={
                      !is_right_side_open ? toggle_right_side : undefined
                    }
                    text={
                      props.mobile_title_bar
                        ? props.mobile_title_bar
                        : undefined
                    }
                  />
                </div>
                <div className={styles.main__inner__sticky__search}>
                  {props.slot_search}
                </div>
              </div>
              <div
                className={cn({
                  [styles['main__inner__bookmarks--loading']]:
                    props.is_fetching_first_bookmarks ||
                    props.is_updating_bookmarks,
                })}
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
                {props.clear_date_range && (
                  <button onClick={props.clear_date_range}>
                    Clear custom range
                  </button>
                )}
                {props.clear_selected_tags && (
                  <button onClick={props.clear_selected_tags}>
                    Clear selected tags
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
              <StickyBox offsetTop={shared_values.appHeaderDesktop}>
                {props.slot_aside}
              </StickyBox>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
