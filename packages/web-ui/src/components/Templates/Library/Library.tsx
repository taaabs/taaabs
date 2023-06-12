import Slideout from 'slideout'
import { useEffect, useRef, useState } from 'react'
import StickyBox from 'react-sticky-box'
import { sharedValues } from '@web-ui/constants'
import { _MobileTitleBar } from './components/_MobileTitleBar'
import cn from 'classnames'
import styles from './Library.module.scss'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useSwipe from 'beautiful-react-hooks/useSwipe'

export namespace LibraryTypes {
  export type Props = {
    slotSidebar: React.ReactNode
    slotAside: React.ReactNode
    titleBar: {
      primaryText: string
      secondaryText: string
    }
    children: React.ReactNode
  }
}

const SLIDABLE_WIDTH = 300

export const Library: React.FC<LibraryTypes.Props> = (props) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const asideRef = useRef<HTMLDivElement>(null)

  const swipeState = useSwipe(mainRef, {
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

  const getSlideoutInstances = () => {
    if (!sidebarRef.current || !mainRef.current || !asideRef.current) return

    const slideoutLeftInstance = new Slideout({
      menu: sidebarRef.current,
      panel: mainRef.current,
      padding: SLIDABLE_WIDTH,
      tolerance: 50,
    })
    const slideoutRightInstance = new Slideout({
      menu: asideRef.current,
      panel: mainRef.current,
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

  useUpdateEffect(() => {
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
      isSlideoutLeftDefinetelyClosed &&
      isSlideoutRightDefinetelyClosed &&
      slideoutLeft == undefined &&
      slideoutRight == undefined
    ) {
      const slideoutInstances = getSlideoutInstances()
      setSlideoutLeft(slideoutInstances?.slideoutLeftInstance)
      setSlideoutRight(slideoutInstances?.slideoutRightInstance)
    }
  }, [swipeState])

  useEffect(() => {
    const slideoutInstances = getSlideoutInstances()
    setSlideoutLeft(slideoutInstances?.slideoutLeftInstance)
    setSlideoutRight(slideoutInstances?.slideoutRightInstance)
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
          ref={sidebarRef}
          style={{
            zIndex: !isSlideoutLeftDefinetelyClosed ? 1 : 0,
            width: `${SLIDABLE_WIDTH}px`,
          }}
        >
          <div className={styles.sidebar__inner}>{props.slotSidebar}</div>
        </div>

        <div
          className={cn(styles.main, {
            [styles['main--borders']]:
              !isSlideoutLeftDefinetelyClosed ||
              !isSlideoutRightDefinetelyClosed,
          })}
          ref={mainRef}
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
            <div>{props.children}</div>
          </div>
        </div>

        <div
          className={styles.aside}
          ref={asideRef}
          style={{
            zIndex: !isSlideoutRightDefinetelyClosed ? 1 : 0,
            width: `${SLIDABLE_WIDTH}px`,
          }}
        >
          <div className={styles.aside__inner}>
            <div className={styles.aside__inner__desktop}>
              <>
                <StickyBox offsetTop={sharedValues.headerDesktop}>
                  {props.slotAside}
                </StickyBox>
              </>
            </div>
            <div className={styles.aside__inner__mobile}>{props.slotAside}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
