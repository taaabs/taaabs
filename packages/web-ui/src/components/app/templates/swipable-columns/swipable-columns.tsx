import useWindowResize from 'beautiful-react-hooks/useWindowResize'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { MobileTitleBar as Subcomponent_MobileTitleBar } from './components/mobile-title-bar'
import styles from './swipable-columns.module.scss'
import { useSwipeable } from 'react-swipeable'
import { use_is_scrolled } from '@web-ui/hooks/use-is-scrolled'
import { Button } from '@web-ui/components/common/particles/button'
import SimpleBar from 'simplebar-react'

export namespace SwipableColumns {
  export type Props = {
    slot_pinned_: React.ReactNode
    slot_tag_hierarchies_: React.ReactNode
    slot_aside_: React.ReactNode
    slot_toolbar_: React.ReactNode
    slot_search_: React.ReactNode
    slot_bookmarks_: React.ReactNode
    are_bookmarks_dimmed_: boolean
    on_page_bottom_reached_: () => void
    clear_selected_tags_?: () => void
    clear_date_range_?: () => void
    show_skeletons_: boolean
    info_text_: React.ReactNode
    welcome_text_?: string
    on_follow_click_?: () => void
    is_following_?: boolean
    pinned_count_?: number
    translations_: {
      mobile_title_bar_: string
      collapse_alt_: string
      follow_: string
      unfollow_: string
      folders_: string
      pinned_: string
      clear_selected_tags_: string
    }
  }
}

export const SwipableColumns: React.FC<SwipableColumns.Props> = (props) => {
  const [slidable_width, set_slidable_width] = useState(0)
  const on_window_resize = useWindowResize()
  const sidebar = useRef<HTMLDivElement>(null)
  const main = useRef<HTMLDivElement>(null)
  const aside = useRef<HTMLDivElement>(null)
  const end_of_bookmarks = useRef<HTMLDivElement>(null)
  const is_end_of_bookmarks_visible = useViewportSpy(end_of_bookmarks)
  const initial_swipe_direction = useRef<'Left' | 'Right' | undefined>(
    undefined,
  )
  const is_scrolled = use_is_scrolled()
  const [is_sidebar_collapsed, set_is_sidebar_collapsed] = useState<boolean>()
  const [are_tag_hierarchies_hovered, set_is_sidebar_hovered] =
    useState<boolean>()
  const [is_dragging, set_is_dragging] = useState<boolean>()
  const [is_left_side_moving, set_is_left_side_moving] = useState<boolean>()
  const [is_right_side_moving, set_is_right_side_moving] = useState<boolean>()
  const [is_left_side_open, set_is_left_side_open] = useState<boolean>()
  const [is_right_side_open, set_is_right_side_open] = useState<boolean>()
  const [is_pinned_active, set_is_pinned_active] = useState<boolean>()
  const simplebar_tag_hierarchies = useRef<any>(null)
  const simplebar_pinned = useRef<any>(null)
  const [
    is_simplebar_tag_hierarchies_scrolled_to_top,
    set_is_simplebar_tag_hierarchies_scrolled_to_top,
  ] = useState(true)
  const [
    is_simplebar_pinned_scrolled_to_top,
    set_is_simplebar_pinned_scrolled_to_top,
  ] = useState(true)

  useEffect(() => {
    const handle_scroll = (e: any) => {
      if (e.target.scrollTop == 0) {
        set_is_simplebar_tag_hierarchies_scrolled_to_top(true)
      } else {
        set_is_simplebar_tag_hierarchies_scrolled_to_top(false)
      }
    }
    const element = simplebar_tag_hierarchies.current.getScrollElement()
    element!.addEventListener('scroll', handle_scroll, { passive: true })
    return () => {
      element!.removeEventListener('scroll', handle_scroll)
    }
  }, [])

  useEffect(() => {
    const handle_scroll = (e: any) => {
      if (e.target.scrollTop == 0) {
        set_is_simplebar_pinned_scrolled_to_top(true)
      } else {
        set_is_simplebar_pinned_scrolled_to_top(false)
      }
    }
    const element = simplebar_pinned.current.getScrollElement()
    element!.addEventListener('scroll', handle_scroll, { passive: true })
    return () => {
      element!.removeEventListener('scroll', handle_scroll)
    }
  }, [])

  const get_slidable_width = () => {
    return window.innerWidth < 370 ? window.innerWidth * 0.82 : 300
  }

  on_window_resize(() => {
    set_slidable_width(get_slidable_width())
  })

  useEffect(() => {
    set_slidable_width(get_slidable_width())
  }, [])

  const swipeable_handlers = useSwipeable({
    onSwipeStart: ({ dir, event }) => {
      // Check if user is not dragging over "custom range" handlers or pinned in a draggable state.
      if (
        window.innerWidth >= 992 ||
        (event.target as any)?.nodeName == 'rect' ||
        (event.target as any)?.nodeName == 'line' ||
        (event.target instanceof HTMLElement &&
          (event as any).target.className.includes('sortable-ghost'))
      )
        return

      if (dir == 'Left' || dir == 'Right') {
        set_is_dragging(true)
        document.body.style.overflow = 'hidden'
        initial_swipe_direction.current = dir
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

      main.current!.style.transition = 'none'
    },
    onSwiping: ({ deltaX, dir, event }) => {
      if (
        window.innerWidth >= 992 ||
        (event.target as any)?.nodeName == 'rect' ||
        (event.target as any)?.nodeName == 'line' ||
        (event.target instanceof HTMLElement &&
          (event as any).target.className.includes('sortable-ghost'))
      )
        return

      main.current!.style.transition = `transform 30ms linear`

      if (
        (initial_swipe_direction.current == 'Left' &&
          dir == 'Left' &&
          deltaX < 0 &&
          deltaX >= -slidable_width &&
          !is_right_side_open) ||
        (initial_swipe_direction.current == 'Right' &&
          dir == 'Right' &&
          deltaX > 0 &&
          deltaX <= slidable_width &&
          !is_left_side_open)
      ) {
        if (!is_left_side_open && !is_right_side_open) {
          main.current!.style.transform = `translateX(${
            deltaX > 0 ? deltaX - 10 : deltaX + 10
          }px)`
        } else if (is_left_side_open) {
          main.current!.style.transform = `translateX(${
            slidable_width + deltaX + 10
          }px)`
        } else if (is_right_side_open) {
          main.current!.style.transform = `translateX(${
            -slidable_width + deltaX - 10
          }px)`
        }
      }
    },
    onSwiped: ({ dir, velocity, event }) => {
      if (
        window.innerWidth >= 992 ||
        (event.target as any)?.nodeName == 'rect' ||
        (event.target as any)?.nodeName == 'line' ||
        (event.target instanceof HTMLElement &&
          (event as any).target.className.includes('sortable-ghost'))
      )
        return

      set_is_dragging(false)

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
      } else if (is_right_side_open) {
        main.current!.style.transform = `translateX(${-slidable_width}px)`
      } else if (is_left_side_open) {
        main.current!.style.transform = `translateX(${slidable_width}px)`
      } else if (!is_left_side_open && !is_right_side_open) {
        document.body.style.overflow = ''
        main.current!.style.transform = ''
      }

      main.current!.style.transition = ''

      setTimeout(() => {
        set_is_right_side_moving(false)
        set_is_left_side_moving(false)
      }, 250)
    },
  })

  const toggle_right_side = () => {
    document.body.style.overflow = 'hidden'
    set_is_right_side_moving(true)

    if (!is_right_side_open) {
      set_is_right_side_open(true)
      main.current!.style.transform = `translateX(${-slidable_width}px)`
    } else {
      set_is_right_side_open(false)
      setTimeout(() => {
        document.body.style.overflow = ''
      }, 250)
      main.current!.style.transform = ''
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
      main.current!.style.transform = `translateX(${slidable_width}px)`
    } else {
      set_is_left_side_open(false)
      setTimeout(() => {
        document.body.style.overflow = ''
      }, 250)
      main.current!.style.transform = ''
    }

    setTimeout(() => {
      set_is_left_side_moving(false)
    }, 250)
  }

  useUpdateEffect(() => {
    if (!is_end_of_bookmarks_visible) return
    props.on_page_bottom_reached_()
  }, [is_end_of_bookmarks_visible])

  return (
    <div className={styles.container} {...swipeable_handlers}>
      {/* id on toolbar used by modal scrollbar padding setting */}
      <div className={styles.toolbar} id="toolbar">
        <div>{props.slot_toolbar_}</div>
      </div>
      <div className={styles.content}>
        <aside
          className={cn(styles.sidebar, {
            [styles['sidebar--hidden']]:
              (is_right_side_open || is_right_side_moving) &&
              !is_left_side_moving,
            [styles['sidebar--collapsed']]: is_sidebar_collapsed,
          })}
          ref={sidebar}
          style={{
            zIndex: !is_right_side_open ? undefined : 1,
          }}
          onMouseEnter={() => {
            set_is_sidebar_hovered(true)
          }}
          onMouseLeave={() => {
            set_is_sidebar_hovered(false)
          }}
        >
          <div
            className={cn(styles.sidebar__inner, {
              [styles['sidebar__inner--collapsed']]: is_sidebar_collapsed,
              [styles['sidebar__inner--collapsed-hovered']]:
                is_sidebar_collapsed && are_tag_hierarchies_hovered,
            })}
            style={{ width: `${slidable_width}px` }}
            onClick={() => {
              is_sidebar_collapsed && set_is_sidebar_collapsed(false)
            }}
          >
            <div className={styles['sidebar__inner__desktop-actions']}>
              <button
                className={cn(
                  styles['sidebar__inner__desktop-actions__collapse-button'],
                  {
                    [styles[
                      'sidebar__inner__desktop-actions__collapse-button--collapsed'
                    ]]: is_sidebar_collapsed,
                  },
                )}
                onClick={() => {
                  set_is_sidebar_collapsed(!is_sidebar_collapsed)
                }}
                title={props.translations_.collapse_alt_}
              >
                <svg
                  viewBox="0 0 5 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.35714 0C3.65895 0 4.71429 1.07453 4.71429 2.4V27.6C4.71429 28.9255 3.65897 30 2.35714 30C1.05534 30 0 28.9255 0 27.6V2.4C0 1.07453 1.05534 0 2.35714 0Z" />
                </svg>
                <svg viewBox="0 0 27 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.1667 1.10294C11.2462 0.16569 9.75379 0.16569 8.83325 1.10294L0.0950623 10L8.83325 18.897C9.75379 19.8342 11.2462 19.8342 12.1667 18.897C13.0873 17.9598 13.0873 16.4402 12.1667 15.503L9.11922 12.4H24.6429C25.9447 12.4 27 11.3255 27 10C27 8.67453 25.9447 7.6 24.6429 7.6H9.11922L12.1667 4.49707C13.0873 3.55979 13.0873 2.04021 12.1667 1.10294Z" />
                </svg>
              </button>
              {props.welcome_text_ && (
                <div
                  className={
                    styles['sidebar__inner__desktop-actions__welcome-text']
                  }
                >
                  {props.welcome_text_}
                </div>
              )}
              {props.on_follow_click_ && (
                <Button on_click={props.on_follow_click_}>
                  {!props.is_following_
                    ? props.translations_.follow_
                    : props.translations_.unfollow_}
                </Button>
              )}
            </div>
            <div className={styles['sidebar__inner__pane-selector']}>
              <button
                className={cn(styles['sidebar__inner__pane-selector__button'], {
                  [styles['sidebar__inner__pane-selector__button--active']]:
                    !is_pinned_active,
                })}
                onClick={() => {
                  set_is_pinned_active(false)
                }}
              >
                {props.translations_.folders_}
              </button>
              <button
                className={cn(styles['sidebar__inner__pane-selector__button'], {
                  [styles['sidebar__inner__pane-selector__button--active']]:
                    is_pinned_active,
                })}
                onClick={() => {
                  set_is_pinned_active(true)
                }}
              >
                {props.translations_.pinned_}{' '}
                {props.pinned_count_ ? `(${props.pinned_count_})` : ''}
              </button>
            </div>
            <SimpleBar
              className={cn(styles['sidebar__inner__simplebar'])}
              style={{
                display: is_pinned_active ? 'none' : undefined,
              }}
              ref={simplebar_tag_hierarchies}
            >
              {!props.show_skeletons_ ? (
                <div
                  className={cn({
                    [styles[
                      'sidebar__inner__simplebar__tag-hierarchies--scrolled'
                    ]]: !is_simplebar_tag_hierarchies_scrolled_to_top,
                  })}
                >
                  {props.slot_tag_hierarchies_}
                </div>
              ) : (
                <div className={styles['sidebar__inner__simplebar__skeleton']}>
                  {[200, 180, 140, 160, 120].map((width, i) => (
                    <Skeleton width={width} key={i} />
                  ))}
                </div>
              )}
            </SimpleBar>
            <SimpleBar
              className={cn(styles['sidebar__inner__simplebar'])}
              ref={simplebar_pinned}
              style={{
                display: !is_pinned_active ? 'none' : undefined,
              }}
            >
              <div
                className={cn({
                  [styles['sidebar__inner__simplebar__pinned--scrolled']]:
                    !is_simplebar_pinned_scrolled_to_top,
                })}
              >
                {props.slot_pinned_}
              </div>
            </SimpleBar>
          </div>
        </aside>

        <main
          className={styles.main}
          ref={main}
          onClick={() => {
            is_left_side_open && toggle_left_side()
            is_right_side_open && toggle_right_side()
          }}
        >
          <div
            className={cn(styles.main__inner, {
              [styles['main__inner--dimmed']]:
                (is_right_side_open || is_left_side_open) && !is_dragging,
              [styles['main__inner--collapsed-sidebar-hovered']]:
                is_sidebar_collapsed && are_tag_hierarchies_hovered,
            })}
            style={{
              pointerEvents:
                is_left_side_open || is_right_side_open ? 'none' : undefined,
            }}
          >
            <div
              className={cn(styles.main__inner__sticky, {
                [styles['main__inner__sticky--scrolled']]: is_scrolled,
              })}
            >
              <div className={styles['main__inner__sticky__mobile-title-bar']}>
                <Subcomponent_MobileTitleBar
                  swipe_left_on_click={
                    !is_left_side_open ? toggle_left_side : undefined
                  }
                  swipe_right_on_click={
                    !is_right_side_open ? toggle_right_side : undefined
                  }
                  text={
                    props.translations_.mobile_title_bar_
                      ? props.translations_.mobile_title_bar_
                      : undefined
                  }
                />
              </div>
              <div className={styles.main__inner__sticky__search}>
                {props.slot_search_}
              </div>
            </div>

            {props.show_skeletons_ && (
              <div className={styles['main__inner__skeleton']}>
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </div>
            )}

            <div
              className={cn({
                [styles.dimmed]: props.are_bookmarks_dimmed_,
              })}
            >
              {props.slot_bookmarks_}
            </div>

            <div className={styles['main__inner__info']} ref={end_of_bookmarks}>
              {props.info_text_ && <span>{props.info_text_}</span>}
              {props.clear_date_range_ && (
                <button onClick={props.clear_date_range_}>
                  Clear custom range
                </button>
              )}
              {props.clear_selected_tags_ && (
                <button onClick={props.clear_selected_tags_}>
                  {props.translations_.clear_selected_tags_}
                </button>
              )}
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
          <div className={styles.aside__inner}>{props.slot_aside_}</div>
        </aside>
      </div>
    </div>
  )
}
