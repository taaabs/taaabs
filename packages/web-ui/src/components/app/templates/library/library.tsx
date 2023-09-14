import { use_is_hydrated } from '@shared/hooks/use-is-hydrated'
import { sharedValues } from '@web-ui/constants'
import useSwipe from 'beautiful-react-hooks/useSwipe'
import useSwipeEvents from 'beautiful-react-hooks/useSwipeEvents'
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
  const isEndOfBookmarksVisible = useViewportSpy(end_of_bookmarks)

  const { onSwipeStart } = useSwipeEvents(undefined, {
    preventDefault: false,
  })
  const swipeState = useSwipe(main, {
    preventDefault: false,
  })

  const [slideoutLeft, setSlideoutLeft] = useState<Slideout>()
  const [slideoutRight, setSlideoutRight] = useState<Slideout>()
  const [isSlideoutLeftOpen, setIsSlideoutLeftOpen] = useState(false)
  const [isSlideoutRightOpen, setIsSlideoutRightOpen] = useState(false)
  const [isSlideoutLeftDefinetelyClosed, setIsSlideoutLeftDefinetelyClosed] =
    useState(true)
  const [isSlideoutRightDefinetelyClosed, setIsSlideoutRightDefinetelyClosed] =
    useState(true)
  const [isSlideoutLeftDefinetelyOpened, setIsSlideoutLeftDefinetelyOpened] =
    useState(false)
  const [isSlideoutRightDefinetelyOpened, setIsSlideoutRightDefinetelyOpened] =
    useState(false)

  useUpdateEffect(() => {
    if (swipeState.direction == 'left' || swipeState.direction == 'right') {
      main.current?.dispatchEvent(
        new CustomEvent('touchmoveSlideout', {
          detail: {
            touches: [{ clientX: swipeState.alphaX * -1 }], // Mimics default touchmove event.
          },
        }),
      )
    }
    if (!swipeState.swiping) {
      main.current?.dispatchEvent(new Event('touchendSlideout'))
    }
  }, [swipeState])

  onSwipeStart(() => {
    main.current?.dispatchEvent(new CustomEvent('touchstartSlideout'))
  })

  const toggleRightSlideout = () => {
    if (!isSlideoutRightOpen) {
      setIsSlideoutRightDefinetelyClosed(false)
    } else {
      setIsSlideoutRightDefinetelyOpened(false)
    }
    slideoutRight?.toggle()
  }
  const toggleLeftSlideout = () => {
    if (!isSlideoutLeftOpen) {
      setIsSlideoutLeftDefinetelyClosed(false)
    } else {
      setIsSlideoutLeftDefinetelyOpened(false)
    }
    slideoutLeft?.toggle()
  }

  const setSlideoutInstances = async () => {
    const Slideout = (await import('slideout')).default

    const slideoutLeftInstance = new Slideout({
      menu: sidebar.current!,
      panel: main.current!,
      padding: SLIDABLE_WIDTH,
      tolerance: -1,
    })
    const slideoutRightInstance = new Slideout({
      menu: aside.current!,
      panel: main.current!,
      padding: SLIDABLE_WIDTH,
      side: 'right',
      tolerance: -1,
    })
    slideoutLeftInstance.on('beforeopen', () => {
      setIsSlideoutLeftOpen(true)
      setIsSlideoutLeftDefinetelyOpened(true)
    })
    slideoutLeftInstance.on('beforeclose', () => {
      setIsSlideoutLeftOpen(false)
    })
    slideoutLeftInstance.on('close', () => {
      setIsSlideoutLeftOpen(false)
      setIsSlideoutLeftDefinetelyClosed(true)
      setIsSlideoutLeftDefinetelyOpened(false)
    })
    slideoutLeftInstance.on('translatestart', () => {
      setIsSlideoutLeftOpen(true)
      setIsSlideoutLeftDefinetelyClosed(false)
      setIsSlideoutLeftDefinetelyOpened(false)
    })
    slideoutRightInstance.on('beforeopen', () => {
      setIsSlideoutRightOpen(true)
      setIsSlideoutRightDefinetelyOpened(true)
    })
    slideoutRightInstance.on('beforeclose', () => {
      setIsSlideoutRightOpen(false)
    })
    slideoutRightInstance.on('close', () => {
      setIsSlideoutRightOpen(false)
      setIsSlideoutRightDefinetelyClosed(true)
      setIsSlideoutRightDefinetelyOpened(false)
    })
    slideoutRightInstance.on('translatestart', () => {
      setIsSlideoutRightOpen(true)
      setIsSlideoutRightDefinetelyClosed(false)
      setIsSlideoutRightDefinetelyOpened(false)
    })

    setSlideoutLeft(slideoutLeftInstance)
    setSlideoutRight(slideoutRightInstance)
  }

  useUpdateEffect(() => {
    if (
      isEndOfBookmarksVisible &&
      props.has_more_bookmarks &&
      !props.is_getting_more_bookmarks &&
      !props.is_getting_first_bookmarks
    ) {
      props.get_more_bookmarks()
    }
  }, [isEndOfBookmarksVisible])

  useUpdateEffect(() => {
    if (!props.is_getting_first_bookmarks) {
      window.scrollTo(0, 0)
      main_inner.current?.scrollTo(0, 0)
    }
  }, [props.is_getting_first_bookmarks])

  useEffect(() => {
    setSlideoutInstances()

    return () => {
      slideoutLeft?.destroy()
      slideoutRight?.destroy()
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
            zIndex: !isSlideoutRightDefinetelyClosed ? undefined : 1,
            visibility: !isSlideoutRightDefinetelyClosed ? 'hidden' : undefined,
            pointerEvents: !isSlideoutRightDefinetelyClosed
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
              !isSlideoutLeftDefinetelyClosed ||
              !isSlideoutRightDefinetelyClosed,
          })}
          ref={main}
          onClick={() => {
            isSlideoutLeftDefinetelyOpened && toggleLeftSlideout()
            isSlideoutRightDefinetelyOpened && toggleRightSlideout()
          }}
        >
          <div
            className={styles.main__inner}
            style={{
              pointerEvents:
                !isSlideoutLeftDefinetelyClosed ||
                !isSlideoutRightDefinetelyClosed
                  ? 'none'
                  : 'all',
            }}
            ref={main_inner}
          >
            <div
              className={cn(styles['main__inner__mobile-alpha-overlay'], {
                [styles['main__inner__mobile-alpha-overlay--enabled']]:
                  isSlideoutLeftDefinetelyOpened ||
                  isSlideoutRightDefinetelyOpened,
              })}
            />
            <div className={styles['main__inner__mobile-title-bar']}>
              <_MobileTitleBar
                swipe_left_on_click={
                  !isSlideoutLeftOpen ? toggleLeftSlideout : undefined
                }
                swipe_right_on_click={
                  !isSlideoutRightOpen ? toggleRightSlideout : undefined
                }
                text={props.title_bar ? props.title_bar : undefined}
              />
            </div>
            <div>
              <div className={styles['main__inner__desktop-title-bar']}>
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
                {props.is_getting_first_bookmarks || props.has_more_bookmarks
                  ? 'Loading...'
                  : props.no_results
                  ? 'No results'
                  : 'End of results'}
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
