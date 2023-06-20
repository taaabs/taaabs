import Slideout from 'slideout'
import { useEffect, useRef, useState } from 'react'
import StickyBox from 'react-sticky-box'
import { sharedValues } from '@web-ui/constants'
import { _MobileTitleBar } from './components/_MobileTitleBar'
import { _DesktopTitleBar } from './components/_DesktopTitleBar'
import cn from 'classnames'
import styles from './Library.module.scss'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useSwipe from 'beautiful-react-hooks/useSwipe'

/**
 * Notes:
 * "bottomOffset" is a footer visible height in the viewport
 */
export namespace LibraryTypes {
  export type Props = {
    slotSidebar: React.ReactNode
    slotAside: React.ReactNode
    titleBar: {
      primaryText: string
      secondaryText: string
    }
    children: React.ReactNode
    bottomOffset: number
  }
}

const SLIDABLE_WIDTH = 300

export const Library: React.FC<LibraryTypes.Props> = (props) => {
  const sidebar = useRef<HTMLDivElement>(null)
  const main = useRef<HTMLDivElement>(null)
  const aside = useRef<HTMLDivElement>(null)

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

  const getSlideoutInstances = async () => {
    if (!sidebar.current || !main.current || !aside.current) return

    const Slideout = (await import('slideout')).default

    const slideoutLeftInstance = new Slideout({
      menu: sidebar.current,
      panel: main.current,
      padding: SLIDABLE_WIDTH,
      tolerance: 50,
    })
    const slideoutRightInstance = new Slideout({
      menu: aside.current,
      panel: main.current,
      padding: SLIDABLE_WIDTH,
      side: 'right',
      tolerance: 50,
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
      setIsSlideoutRightDefinetelyClosed(false)
      setIsSlideoutRightDefinetelyOpened(false)
    })

    return {
      slideoutLeftInstance,
      slideoutRightInstance,
    }
  }

  const setSlideoutInstances = async () => {
    const slideoutInstances = await getSlideoutInstances()
    setSlideoutLeft(slideoutInstances?.slideoutLeftInstance)
    setSlideoutRight(slideoutInstances?.slideoutRightInstance)
  }

  useUpdateEffect(() => {
    if (!isSlideoutLeftDefinetelyClosed || !isSlideoutRightDefinetelyClosed)
      return

    if (
      swipeState.swiping &&
      (swipeState.direction == 'up' || swipeState.direction == 'down') &&
      slideoutLeft != undefined &&
      slideoutRight != undefined
    ) {
      slideoutLeft?.destroy()
      slideoutRight?.destroy()
      setSlideoutLeft(undefined)
      setSlideoutRight(undefined)
    } else if (
      !swipeState.swiping &&
      slideoutLeft == undefined &&
      slideoutRight == undefined
    ) {
      setSlideoutInstances()
    }
  }, [swipeState])

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
            zIndex: !isSlideoutLeftDefinetelyClosed ? 1 : 0,
            width: `${SLIDABLE_WIDTH}px`,
          }}
        >
          <div
            className={styles.sidebar__inner}
            style={{
              width: `${SLIDABLE_WIDTH}px`,
              height: `calc(100vh - var(--header-desktop-height)${
                props.bottomOffset ? ` - ${props.bottomOffset}px` : ``
              })`,
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
                  !isSlideoutLeftOpen ? toggleLeftSlideout : () => {}
                }
                swipeRightOnClick={
                  !isSlideoutRightOpen ? toggleRightSlideout : () => {}
                }
                primaryText={props.titleBar.primaryText}
                secondaryText={props.titleBar.secondaryText}
              />
            </div>
            <div className={styles['main__inner__desktop-title-bar']}>
              <_DesktopTitleBar
                primaryText={props.titleBar.primaryText}
                secondaryText={props.titleBar.secondaryText}
              />
            </div>
            <div className={styles.main__inner__content}>{props.children}</div>
          </div>
        </div>

        <div
          className={styles.aside}
          ref={aside}
          style={{
            zIndex: !isSlideoutRightDefinetelyClosed ? 1 : 0,
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
