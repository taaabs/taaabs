import { useIsHydrated } from '@shared/hooks'
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
import { useMobileScrollRestore } from './hooks/use-mobile-scroll-restore'
import styles from './library.module.scss'

export namespace Library {
  export type Props = {
    slotSidebar: React.ReactNode
    slotAside: React.ReactNode
    titleBar?: string
    slotBookmarks: React.ReactNode
    isGettingFirstBookmarks: boolean
    isGettingMoreBookmarks: boolean
    hasMoreBookmarks: boolean
    noResults: boolean
    getMoreBookmarks: () => void
    showBookmarksSkeleton: boolean
  }
}

const SLIDABLE_WIDTH = 300

export const Library: React.FC<Library.Props> = (props) => {
  const sidebar = useRef<HTMLDivElement>(null)
  const main = useRef<HTMLDivElement>(null)
  const mainInner = useRef<HTMLDivElement>(null)
  const aside = useRef<HTMLDivElement>(null)
  const endOfBookmarks = useRef<HTMLDivElement>(null)
  const isHydrated = useIsHydrated()

  useMobileScrollRestore(mainInner)
  const isEndOfBookmarksVisible = useViewportSpy(endOfBookmarks)

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
      props.hasMoreBookmarks &&
      !props.isGettingMoreBookmarks &&
      !props.isGettingFirstBookmarks
    ) {
      props.getMoreBookmarks()
    }
  }, [isEndOfBookmarksVisible])

  useUpdateEffect(() => {
    if (!props.isGettingFirstBookmarks) {
      window.scrollTo(0, 0)
      mainInner.current?.scrollTo(0, 0)
    }
  }, [props.isGettingFirstBookmarks])

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
            {props.slotSidebar}
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
            ref={mainInner}
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
                swipeLeftOnClick={
                  !isSlideoutLeftOpen ? toggleLeftSlideout : undefined
                }
                swipeRightOnClick={
                  !isSlideoutRightOpen ? toggleRightSlideout : undefined
                }
                text={props.titleBar ? props.titleBar : undefined}
              />
            </div>
            <div>
              <div className={styles['main__inner__desktop-title-bar']}>
                <_DesktopTitleBar
                  text={props.titleBar ? props.titleBar : undefined}
                />
              </div>
              <div
                className={cn([
                  styles.main__inner__bookmarks,
                  {
                    [styles['main__inner__bookmarks--loading']]:
                      props.isGettingFirstBookmarks,
                  },
                ])}
                style={{
                  visibility: isHydrated ? 'visible' : 'hidden',
                }}
              >
                {props.slotBookmarks}
              </div>
              {props.showBookmarksSkeleton && (
                <div className={styles['main__inner__skeleton']}>
                  {[...Array(30)].map((_, i) => (
                    <Skeleton key={i} />
                  ))}
                </div>
              )}
              <div className={styles['main__inner__info']} ref={endOfBookmarks}>
                {props.isGettingFirstBookmarks || props.hasMoreBookmarks
                  ? 'Loading...'
                  : props.noResults
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
                {props.slotAside}
              </StickyBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
