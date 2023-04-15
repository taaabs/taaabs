import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'
import Slideout from 'slideout'
import { useEffect, useRef, useLayoutEffect, useState } from 'react'
import StickyBox from 'react-sticky-box'
import { sharedValues } from '@/constants'
import { _AppBar } from './components/_AppBar'

export namespace Layout2ndApp {
  export type Props = {
    slotSidebar: React.ReactNode
    slotMain: React.ReactNode
    slotAside: React.ReactNode
    slotAppBar: React.ReactNode
  }
}

const useWindowWidth = () => {
  const [width, setWidth] = useState<number | null>(null)
  useLayoutEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', updateWidth)
    updateWidth()
    return () => window.removeEventListener('resize', updateWidth)
  })
  return width
}

export const Layout2ndApp: React.FC<Layout2ndApp.Props> = (props) => {
  const windowWidth = useWindowWidth()
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

  let slidableWidth: number
  if (windowWidth == null) {
    slidableWidth = 0
  } else if (windowWidth >= 432) {
    slidableWidth = 300
  } else {
    slidableWidth = windowWidth / 1.5
  }

  const openRightSlideout = () => {
    setIsSlideoutRightDefinetelyClosed(false)
    slideoutRight?.open()
  }
  const openLeftSlideout = () => {
    setIsSlideoutLeftDefinetelyClosed(false)
    slideoutLeft?.open()
  }

  useEffect(() => {
    if (
      !windowWidth ||
      !sidebarRef.current ||
      !mainRef.current ||
      !mobileTabsPanelRef.current
    )
      return
    const slideoutLeftInstance = new Slideout({
      menu: sidebarRef.current,
      panel: mainRef.current,
      padding: slidableWidth,
    })
    const slideoutRightInstance = new Slideout({
      menu: mobileTabsPanelRef.current,
      panel: mainRef.current,
      padding: slidableWidth,
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
    setSlideoutLeft(slideoutLeftInstance)
    setSlideoutRight(slideoutRightInstance)
    return () => {
      slideoutLeftInstance.destroy()
      slideoutRightInstance.destroy()
    }
  }, [windowWidth])

  return (
    <$.container>
      <$.headerSpacer />

      <$.content>
        <$.sidebar
          ref={sidebarRef}
          width={slidableWidth}
          style={{ zIndex: !isSlideoutLeftDefinetelyClosed ? 1 : 0 }}
        >
          <$.Sidebar.inner>{props.slotSidebar}</$.Sidebar.inner>
        </$.sidebar>

        <$.main
          ref={mainRef}
          onClick={() => {
            isSlideoutLeftOpen && slideoutLeft?.close()
            isSlideoutRightOpen && slideoutRight?.close()
          }}
        >
          <$.Main.appBar>
            <_AppBar
              swipeLeftOnClick={openLeftSlideout}
              swipeRightOnClick={openRightSlideout}
              isLeftOpen={isSlideoutLeftOpen}
              isRightOpen={isSlideoutRightOpen}
            >
              <$.Main.AppBar.slot
                isDimmed={
                  isSlideoutLeftDefinetelyOpened ||
                  isSlideoutRightDefinetelyOpened
                }
              >
                {props.slotAppBar}
              </$.Main.AppBar.slot>
            </_AppBar>
          </$.Main.appBar>
          <$.Main.inner
            isDimmed={
              isSlideoutLeftDefinetelyOpened || isSlideoutRightDefinetelyOpened
            }
            style={{
              pointerEvents:
                !isSlideoutLeftDefinetelyClosed ||
                !isSlideoutRightDefinetelyClosed
                  ? 'none'
                  : 'all',
            }}
          >
            {props.slotMain}
          </$.Main.inner>
        </$.main>

        <$.aside
          ref={mobileTabsPanelRef}
          width={slidableWidth}
          style={{ zIndex: !isSlideoutRightDefinetelyClosed ? 1 : 0 }}
        >
          <$.Aside.inner>
            {windowWidth && windowWidth >= 992 ? (
              <>
                <StickyBox offsetTop={sharedValues.heights.HEADER_DESKTOP}>
                  {props.slotAside}
                </StickyBox>
              </>
            ) : (
              props.slotAside
            )}
          </$.Aside.inner>
        </$.aside>
      </$.content>
    </$.container>
  )
}

namespace $ {
  export const container = styled.div`
    background: var(${Theme.COLOR_NEUTRAL_25});
  `
  export const headerSpacer = styled.header`
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    background-color: var(${Theme.COLOR_WHITE});
    height: ${sharedValues.heights.HEADER_MOBILE}px;
    ${mq.at992} {
      height: ${sharedValues.heights.HEADER_DESKTOP}px;
    }
  `
  export const sidebar = styled.div<{ width: number }>`
    ${mq.to992} {
      position: fixed;
      top: 0;
      bottom: 0;
      width: ${({ width }) => width}px;
      z-index: 0;
      display: none;
      padding-top: ${sharedValues.heights.HEADER_MOBILE}px;
      padding-bottom: ${sharedValues.heights.BOTTOM_NAVIGATION_BAR}px;
    }
    ${mq.at992} {
      position: sticky;
      height: calc(100vh - ${sharedValues.heights.HEADER_DESKTOP}px);
      width: 100%;
      top: ${sharedValues.heights.HEADER_DESKTOP}px;
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
      padding-top: ${sharedValues.heights.HEADER_MOBILE}px;
      padding-bottom: ${sharedValues.heights.BOTTOM_NAVIGATION_BAR}px;
    }
    ${mq.at992} {
      margin-top: ${sharedValues.heights.HEADER_DESKTOP}px;
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
      max-width: ${sharedValues.SITE_MAX_WIDTH}px;
      margin: 0 auto;
      padding: 0 var(${Theme.SPACER_16});
      ${mq.at1200} {
        padding: 0 var(${Theme.SPACER_40});
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
  export const main = styled.div`
    ${mq.to992} {
      position: relative;
      z-index: 2;
      border-left-width: 1px;
      border-left-style: solid;
      border-left-color: transparent;
      border-right-width: 1px;
      border-right-style: solid;
      border-right-color: transparent;
      transition: border-color var(${Theme.ANIMATION_DURATION_300})
        var(${Theme.TRANSITION_TIMING_FUNCTION}); // Active color is defined in the global styles
      margin-top: ${sharedValues.heights.HEADER_MOBILE}px;
      padding-top: ${sharedValues.heights.APP_BAR}px;
      padding-bottom: ${sharedValues.heights.BOTTOM_NAVIGATION_BAR}px;
      height: calc(100vh - ${sharedValues.heights.HEADER_MOBILE}px);
      overflow: hidden;
      background-color: var(${Theme.COLOR_NEUTRAL_25});
    }
    ${mq.at992} {
      flex: 1;
      transform: translateX(0px) !important;
      z-index: 2;
      margin-top: ${sharedValues.heights.HEADER_DESKTOP}px;
    }
  `
  export namespace Main {
    const dimmedOpacity = 0.4
    export const appBar = styled.div`
      position: absolute;
      top: 0;
      width: 100%;
      ${mq.at992} {
        display: none;
      }
    `
    export namespace AppBar {
      export const slot = styled.div<{ isDimmed: boolean }>`
        opacity: ${({ isDimmed }) => (isDimmed ? dimmedOpacity : 1)};
        transition: opacity var(${Theme.ANIMATION_DURATION_300})
          var(${Theme.TRANSITION_TIMING_FUNCTION});
      `
    }
    export const inner = styled.div<{ isDimmed: boolean }>`
      ${mq.to992} {
        opacity: ${({ isDimmed }) => (isDimmed ? dimmedOpacity : 1)};
        transition: opacity var(${Theme.ANIMATION_DURATION_300})
          var(${Theme.TRANSITION_TIMING_FUNCTION});
        overflow: auto;
        height: 100%;
      }
      ${mq.at992} {
        min-height: calc(100vh - ${sharedValues.heights.HEADER_DESKTOP}px);
      }
    `
  }
}
