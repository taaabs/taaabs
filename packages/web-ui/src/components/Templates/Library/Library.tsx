import Slideout from 'slideout'
import { useEffect, useRef, useState, LegacyRef } from 'react'
import StickyBox from 'react-sticky-box'
import { sharedValues } from '@web-ui/constants'
import { _MobileTitleBar } from './components/_MobileTitleBar'
import { useScrollDirection } from 'react-use-scroll-direction'
import cn from 'classnames'
import styles from './Library.module.scss'

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
  const {
    isScrolling,
    scrollTargetRef,
  }: { isScrolling: boolean; scrollTargetRef: LegacyRef<HTMLDivElement> } =
    useScrollDirection() as any // Fixes ref type error
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
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const mobileTabsPanelRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const initializeSlideout = () => {
      if (
        !sidebarRef.current ||
        !mainRef.current ||
        !mobileTabsPanelRef.current
      )
        return

      const slideoutLeftInstance = new Slideout({
        menu: sidebarRef.current,
        panel: mainRef.current,
        padding: SLIDABLE_WIDTH,
      })
      const slideoutRightInstance = new Slideout({
        menu: mobileTabsPanelRef.current,
        panel: mainRef.current,
        padding: SLIDABLE_WIDTH,
        side: 'right',
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

    if (isScrolling) {
      slideoutLeft?.destroy()
      slideoutRight?.destroy()
    } else {
      const slideoutInstances = initializeSlideout()
      setSlideoutLeft(slideoutInstances?.slideoutLeftInstance)
      setSlideoutRight(slideoutInstances?.slideoutRightInstance)
      return () => {
        slideoutInstances?.slideoutLeftInstance.destroy()
        slideoutInstances?.slideoutRightInstance.destroy()
      }
    }
  }, [isScrolling])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div
          className={styles.sidebar}
          ref={sidebarRef}
          style={{
            zIndex: !isSlideoutLeftDefinetelyClosed ? 1 : 0,
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
            ref={scrollTargetRef}
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
          ref={mobileTabsPanelRef}
          className={styles.aside}
          style={{
            zIndex: !isSlideoutRightDefinetelyClosed ? 1 : 0,
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
