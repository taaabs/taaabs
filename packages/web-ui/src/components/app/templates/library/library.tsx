import { sharedValues } from '@web-ui/constants'
import useSwipe from 'beautiful-react-hooks/useSwipe'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useViewportSpy from 'beautiful-react-hooks/useViewportSpy'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import StickyBox from 'react-sticky-box'
import Slideout from 'slideout'
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
  }
}

const SLIDABLE_WIDTH = 300

export const Library: React.FC<Library.Props> = (props) => {
  const sidebar = useRef<HTMLDivElement>(null)
  const main = useRef<HTMLDivElement>(null)
  const main_inner = useRef<HTMLDivElement>(null)
  const aside = useRef<HTMLDivElement>(null)
  const end_of_bookmarks = useRef<HTMLDivElement>(null)
  const is_hydrated = use_is_hydrated()
  use_scroll_restore(main_inner)
  const is_end_of_bookmarks_visible = useViewportSpy(end_of_bookmarks)

  const swipeState = useSwipe(main, {
    preventDefault: false,
    threshold: 20,
  })

  const [slideout_left, set_slideout_left] = useState<Slideout>()
  const [slideout_right, set_slideout_right] = useState<Slideout>()
  const [is_slideout_opening, set_is_slideout_opening] = useState(false)
  const [is_slideout_left_open, set_is_slideout_left_open] = useState(false)
  const [is_slideout_right_open, set_is_slideout_right_open] = useState(false)
  const [
    is_slideout_left_definetely_closed,
    set_is_slideout_left_definetely_closed,
  ] = useState(true)
  const [
    is_slideout_right_definetely_closed,
    set_is_slideout_right_definetely_closed,
  ] = useState(true)
  const [
    is_slideout_left_definetely_opened,
    set_is_slideout_left_definetely_opened,
  ] = useState(false)
  const [
    is_slideout_right_definetely_opened,
    set_is_slideout_right_definetely_opened,
  ] = useState(false)

  useUpdateEffect(() => {
    if (swipeState.direction == 'left') {
      if (
        is_slideout_left_definetely_closed &&
        is_slideout_right_definetely_closed
      ) {
        toggle_right_slideout()
      } else if (is_slideout_left_definetely_opened) {
        toggle_left_slideout()
      }
    }

    if (swipeState.direction == 'right') {
      if (
        is_slideout_left_definetely_closed &&
        is_slideout_right_definetely_closed
      ) {
        toggle_left_slideout()
      } else if (is_slideout_right_definetely_opened) {
        toggle_right_slideout()
      }
    }
  }, [swipeState])

  const toggle_right_slideout = () => {
    if (is_slideout_opening) return

    if (!is_slideout_right_open) {
      set_is_slideout_right_definetely_closed(false)
    } else {
      set_is_slideout_right_definetely_opened(false)
    }

    slideout_right?.toggle()
    set_is_slideout_opening(true)
    setTimeout(() => {
      set_is_slideout_opening(false)
    }, 500)
  }
  const toggle_left_slideout = () => {
    if (is_slideout_opening) return

    if (!is_slideout_left_open) {
      set_is_slideout_left_definetely_closed(false)
    } else {
      set_is_slideout_left_definetely_opened(false)
    }

    slideout_left?.toggle()
    set_is_slideout_opening(true)
    setTimeout(() => {
      set_is_slideout_opening(false)
    }, 500)
  }

  const set_slideout_instances = async () => {
    const Slideout = (await import('slideout')).default

    const slideout_left_instance = new Slideout({
      menu: sidebar.current!,
      panel: main.current!,
      padding: SLIDABLE_WIDTH,
      tolerance: -1,
    })
    const slideout_right_instance = new Slideout({
      menu: aside.current!,
      panel: main.current!,
      padding: SLIDABLE_WIDTH,
      side: 'right',
      tolerance: -1,
    })
    slideout_left_instance.on('beforeopen', () => {
      set_is_slideout_left_open(true)
      set_is_slideout_left_definetely_opened(true)
    })
    slideout_left_instance.on('beforeclose', () => {
      set_is_slideout_left_open(false)
    })
    slideout_left_instance.on('close', () => {
      set_is_slideout_left_open(false)
      set_is_slideout_left_definetely_closed(true)
      set_is_slideout_left_definetely_opened(false)
    })
    slideout_left_instance.on('translatestart', () => {
      set_is_slideout_left_open(true)
      set_is_slideout_left_definetely_closed(false)
      set_is_slideout_left_definetely_opened(false)
    })
    slideout_right_instance.on('beforeopen', () => {
      set_is_slideout_right_open(true)
      set_is_slideout_right_definetely_opened(true)
    })
    slideout_right_instance.on('beforeclose', () => {
      set_is_slideout_right_open(false)
    })
    slideout_right_instance.on('close', () => {
      set_is_slideout_right_open(false)
      set_is_slideout_right_definetely_closed(true)
      set_is_slideout_right_definetely_opened(false)
    })
    slideout_right_instance.on('translatestart', () => {
      set_is_slideout_right_open(true)
      set_is_slideout_right_definetely_closed(false)
      set_is_slideout_right_definetely_opened(false)
    })

    set_slideout_left(slideout_left_instance)
    set_slideout_right(slideout_right_instance)
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
      main_inner.current?.scrollTo(0, 0)
    }
  }, [props.is_getting_first_bookmarks])

  useEffect(() => {
    set_slideout_instances()

    return () => {
      slideout_left?.destroy()
      slideout_right?.destroy()
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div
          className={styles.sidebar}
          ref={sidebar}
          style={{
            width: `${SLIDABLE_WIDTH}px`,
            zIndex: !is_slideout_right_definetely_closed ? undefined : 1,
            visibility: !is_slideout_right_definetely_closed
              ? 'hidden'
              : undefined,
            pointerEvents: !is_slideout_right_definetely_closed
              ? 'none'
              : undefined,
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
            [styles['main--borders']]:
              !is_slideout_left_definetely_closed ||
              !is_slideout_right_definetely_closed,
          })}
          ref={main}
          onClick={() => {
            is_slideout_left_definetely_opened && toggle_left_slideout()
            is_slideout_right_definetely_opened && toggle_right_slideout()
          }}
        >
          <div
            className={styles.main__inner}
            style={{
              pointerEvents:
                !is_slideout_left_definetely_closed ||
                !is_slideout_right_definetely_closed
                  ? 'none'
                  : 'all',
            }}
            ref={main_inner}
          >
            {/* <div
              className={cn(styles['main__inner__mobile-alpha-overlay'], {
                [styles['main__inner__mobile-alpha-overlay--enabled']]:
                  is_slideout_left_definetely_opened ||
                  is_slideout_right_definetely_opened,
              })}
            /> */}
            <div className={styles['main__inner__mobile-title-bar']}>
              <_MobileTitleBar
                swipe_left_on_click={
                  !is_slideout_left_open ? toggle_left_slideout : undefined
                }
                swipe_right_on_click={
                  !is_slideout_right_open ? toggle_right_slideout : undefined
                }
                text={props.title_bar ? props.title_bar : undefined}
              />
            </div>
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
          className={styles.aside}
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
