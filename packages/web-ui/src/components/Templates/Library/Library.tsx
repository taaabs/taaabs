import styled from '@emotion/styled'
import Slideout from 'slideout'
import { useEffect, useRef, useState, LegacyRef } from 'react'
import StickyBox from 'react-sticky-box'
import { sharedValues } from '@web-ui/constants'
import { _MobileTitleBar } from './components/_MobileTitleBar'
import { css } from '@emotion/react'
import { mq, styles } from '@web-ui/styles/constants'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { useScrollDirection } from 'react-use-scroll-direction'

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

  const initializeSlideout = () => {
    if (!sidebarRef.current || !mainRef.current || !mobileTabsPanelRef.current)
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

  useEffect(() => {
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
    <_.container>
      <_.content>
        <_.sidebar
          ref={sidebarRef}
          width={SLIDABLE_WIDTH}
          style={{ zIndex: !isSlideoutLeftDefinetelyClosed ? 1 : 0 }}
        >
          <_.Sidebar.inner>{props.slotSidebar}</_.Sidebar.inner>
        </_.sidebar>

        <_.main
          ref={mainRef}
          onClick={() => {
            isSlideoutLeftDefinetelyOpened && toggleLeftSlideout()
            isSlideoutRightDefinetelyOpened && toggleRightSlideout()
          }}
          withBorders={
            !isSlideoutLeftDefinetelyClosed || !isSlideoutRightDefinetelyClosed
          }
        >
          <_.Main.inner
            style={{
              pointerEvents:
                !isSlideoutLeftDefinetelyClosed ||
                !isSlideoutRightDefinetelyClosed
                  ? 'none'
                  : 'all',
            }}
            ref={scrollTargetRef}
          >
            <_.Main.Inner.mobileAlphaOverlay
              isEnabled={
                isSlideoutLeftDefinetelyOpened ||
                isSlideoutRightDefinetelyOpened
              }
            />
            <_.Main.Inner.mobileTitleBar>
              <_MobileTitleBar
                swipeLeftOnClick={
                  !isSlideoutLeftOpen ? toggleLeftSlideout : () => {}
                }
                swipeRightOnClick={
                  !isSlideoutRightOpen ? toggleRightSlideout : () => {}
                }
                topLineText={props.titleBar.primaryText}
                bottomLineText={props.titleBar.secondaryText}
              />
            </_.Main.Inner.mobileTitleBar>
            <div>{props.children}</div>
          </_.Main.inner>
        </_.main>

        <_.aside
          ref={mobileTabsPanelRef}
          width={SLIDABLE_WIDTH}
          style={{ zIndex: !isSlideoutRightDefinetelyClosed ? 1 : 0 }}
        >
          <_.Aside.inner>
            <_.Aside.Inner.desktop>
              <>
                <StickyBox offsetTop={sharedValues.headerDesktop}>
                  {props.slotAside}
                </StickyBox>
              </>
            </_.Aside.Inner.desktop>
            <_.Aside.Inner.mobile>{props.slotAside}</_.Aside.Inner.mobile>
          </_.Aside.inner>
        </_.aside>
      </_.content>
    </_.container>
  )
}

namespace _ {
  export const container = styled.div`
    background: var(${Theme.COLOR_NEUTRAL_25});
  `
  export const sidebar = styled.div<{ width: number }>`
    ${mq.to992} {
      position: fixed;
      top: 0;
      bottom: 0;
      width: ${({ width }) => width}px;
      z-index: 0;
      display: none;
      padding-top: ${sharedValues.headerMobile}px;
      padding-bottom: ${sharedValues.bottomNavigationBar}px;
    }
    ${mq.at992} {
      position: sticky;
      height: calc(100vh - ${sharedValues.headerDesktop}px);
      width: 100%;
      top: ${sharedValues.headerDesktop}px;
      overflow: auto;
    }
  `
  export namespace Sidebar {
    export const inner = styled.div`
      ${mq.to992} {
        height: 100%;
        overflow: auto;
        background-color: var(${Theme.COLOR_NEUTRAL_25});
      }
    `
  }
  export const aside = styled.aside<{ width: number }>`
    ${mq.to992} {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      width: ${({ width }) => width}px;
      height: 100vh;
      display: none;
      padding-top: ${sharedValues.headerMobile}px;
      padding-bottom: ${sharedValues.bottomNavigationBar}px;
    }
    ${mq.at992} {
      margin-top: ${sharedValues.headerDesktop}px;
    }
  `
  export namespace Aside {
    export const inner = styled.div`
      ${mq.to992} {
        height: 100%;
        overflow: auto;
        background-color: var(${Theme.COLOR_NEUTRAL_25});
      }
      ${mq.at992} {
        height: 100%;
      }
    `
    export namespace Inner {
      export const mobile = styled.div`
        ${mq.at992} {
          display: none;
        }
      `
      export const desktop = styled.div`
        ${mq.to992} {
          display: none;
        }
        height: 100%;
      `
    }
  }
  export const content = styled.div`
    ${mq.at992} {
      display: flex;
      width: 100%;
      max-width: ${sharedValues.siteMaxWidth}px;
      margin: 0 auto;
      padding: 0 ${sharedValues.distance[16]}px;
      ${mq.at1200} {
        padding: 0 ${sharedValues.distance[40]}px;
      }
      ::before {
        top: 0;
        left: 0;
        width: 100vw;
        content: '';
        height: ${sharedValues.headerDesktop}px;
        background: var(${Theme.HEADER_BACKGROUND});
        position: fixed;
      }
      > ${aside}, > ${sidebar} {
        width: 25vw;
        ${mq.at1200} {
          width: 21.7vw;
        }
        ${mq.at1380} {
          width: 300px;
        }
      }
    }
  `
  export const main = styled.div<{
    withBorders: boolean
  }>`
    ${mq.to992} {
      position: relative;
      z-index: 2;
      margin-top: ${sharedValues.headerMobile}px;
      height: calc(
        100svh -
          ${sharedValues.headerMobile + sharedValues.bottomNavigationBar}px
      );
      background-color: var(${Theme.COLOR_NEUTRAL_25});
      ${({ withBorders }) =>
        withBorders &&
        css`
          ::before {
            content: '';
            width: 1px;
            height: 100%;
            background-color: var(${Theme.BORDER_COLOR_PRIMARY});
            top: 0;
            left: 0;
            position: absolute;
            z-index: 3;
          }
          ::after {
            content: '';
            width: 1px;
            height: 100%;
            background-color: var(${Theme.BORDER_COLOR_PRIMARY});
            top: 0;
            right: 0;
            position: absolute;
            z-index: 2;
          }
        `}
    }
    ${mq.at992} {
      flex: 1;
      transform: translateX(0px) !important;
      margin-top: ${sharedValues.headerDesktop}px;
    }
  `
  export namespace Main {
    export const inner = styled.div`
      ${mq.to992} {
        overflow: auto;
        height: 100%;
        touch-action: manipulation; // https://github.com/Mango/slideout/issues/205#issuecomment-823927561
        ::before {
          position: absolute;
          content: '';
          height: ${sharedValues.appBar}px;
          width: 100%;
          top: 0;
          left: 0;
          z-index: -1;
          background-color: var(${Theme.HEADER_BACKGROUND});
        }
      }
      ${mq.at992} {
        min-height: calc(100vh - ${sharedValues.headerDesktop}px);
      }
    `
    export namespace Inner {
      export const mobileAlphaOverlay = styled.div<{ isEnabled: boolean }>`
        ${mq.to992} {
          pointer-events: none;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          background: var(${Theme.HEADER_BACKGROUND});
          opacity: 0;
          visibility: hidden;
          z-index: 2;
          ${styles.transition[300]('opacity')};
          ${({ isEnabled }) =>
            isEnabled &&
            css`
              opacity: 0.6;
              visibility: visible;
            `}
        }
      `
      export const mobileTitleBar = styled.div`
        ${mq.to992} {
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 1;
        }
        ${mq.at992} {
          display: none;
        }
      `
    }
  }
}
