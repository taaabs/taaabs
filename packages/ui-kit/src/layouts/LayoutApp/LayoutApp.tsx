import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'
import Slideout from 'slideout'
import { useEffect, useRef, useLayoutEffect, useState } from 'react'
import { css } from '@emotion/react'
import StickyBox from 'react-sticky-box'
import { sharedValues } from '@/constants'

export namespace LayoutApp {
  export type Props = {
    slotSidebar: React.ReactNode
    slotMain: React.ReactNode
    slotAside: React.ReactNode
    slotFooter: React.ReactNode
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

export const LayoutApp: React.FC<LayoutApp.Props> = (props) => {
  const windowWidth = useWindowWidth()
  const [slideoutLeft, setSlideoutLeft] = useState<Slideout>()
  const [slideoutRight, setSlideoutRight] = useState<Slideout>()
  const [isSlideoutLeftOpen, setIsSlideoutLeftOpen] = useState(false)
  const [isSlideoutRightOpen, setIsSlideoutRightOpen] = useState(false)
  const [isSlideoutLeftDefinetelyClosed, setIsSlideoutLeftDefinetelyClosed] =
    useState(true)
  const [isSlideoutRightDefinetelyClosed, setIsSlideoutRightDefinetelyClosed] =
    useState(true)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const mobileTabsPanelRef = useRef<HTMLDivElement>(null)

  const visibleWidth = 64

  let slidableWidth: number
  // 64 (visibleWidth) + 8 (gap) + 300 (sidebar) + 8 + 64 (for symmetry with visibleWidth) = *444* - 64 = *380*
  if (windowWidth == null) {
    slidableWidth = 0
  } else if (windowWidth >= 444) {
    slidableWidth = 380
  } else {
    slidableWidth = windowWidth - visibleWidth
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
    })
    slideoutLeftInstance.on('beforeclose', () => {
      setIsSlideoutLeftOpen(false)
    })
    slideoutLeftInstance.on('close', () => {
      setIsSlideoutLeftOpen(false)
      setIsSlideoutLeftDefinetelyClosed(true)
    })
    slideoutLeftInstance.on('translatestart', () => {
      setIsSlideoutLeftOpen(false)
      setIsSlideoutLeftDefinetelyClosed(false)
    })
    slideoutRightInstance.on('beforeopen', () => {
      setIsSlideoutRightOpen(true)
    })
    slideoutRightInstance.on('beforeclose', () => {
      setIsSlideoutRightOpen(false)
    })
    slideoutRightInstance.on('close', () => {
      setIsSlideoutRightOpen(false)
      setIsSlideoutRightDefinetelyClosed(true)
    })
    slideoutRightInstance.on('translatestart', () => {
      setIsSlideoutRightOpen(false)
      setIsSlideoutRightDefinetelyClosed(false)
    })
    setSlideoutLeft(slideoutLeftInstance)
    setSlideoutRight(slideoutRightInstance)
    return () => {
      slideoutLeftInstance.destroy()
      slideoutRightInstance.destroy()
    }
  }, [windowWidth])

  return (
    <S.container>
      <S.headerSpacer />

      <S.content>
        <S.sidebar ref={sidebarRef} width={slidableWidth}>
          <S.Sidebar.inner isVisible={isSlideoutRightDefinetelyClosed}>
            {props.slotSidebar}
          </S.Sidebar.inner>
        </S.sidebar>

        <S.main
          ref={mainRef}
          onClick={() => {
            isSlideoutLeftOpen && slideoutLeft?.close()
            isSlideoutRightOpen && slideoutRight?.close()
          }}
        >
          <S.Main.inner isDimmed={isSlideoutLeftOpen || isSlideoutRightOpen}>
            <button onClick={() => slideoutLeft?.open()}>BURGER</button>
            {props.slotMain}
          </S.Main.inner>
          <S.footer>{props.slotFooter}</S.footer>
        </S.main>

        <S.aside ref={mobileTabsPanelRef} width={slidableWidth}>
          <S.Aside.inner isVisible={isSlideoutLeftDefinetelyClosed}>
            {windowWidth && windowWidth >= 992 ? (
              <>
                <S.Aside.Inner.Desktop.topBarBlurBgFix />
                <StickyBox offsetTop={sharedValues.HEADER_DESKTOP_HEIGHT}>
                  {props.slotAside}
                </StickyBox>
              </>
            ) : (
              props.slotAside
            )}
          </S.Aside.inner>
        </S.aside>
      </S.content>
    </S.container>
  )
}

namespace S {
  export const container = styled.div`
    background: var(${Theme.COLOR_NEUTRAL_25});
  `
  export const headerSpacer = styled.header`
    position: sticky;
    top: 0;
    width: 100%;
    background-color: var(${Theme.COLOR_WHITE});
    height: ${sharedValues.HEADER_MOBILE_HEIGHT}px;
    ${mq.at992} {
      height: ${sharedValues.HEADER_DESKTOP_HEIGHT}px;
    }
  `
  export const sidebar = styled.div<{ width: number }>`
    ${mq.to992} {
      position: fixed;
      top: 0;
      bottom: 0;
      width: ${({ width }) => width}px;
      height: 100vh;
      z-index: 0;
      display: none;
    }
    ${mq.at992} {
      position: sticky;
      height: calc(100vh - ${sharedValues.HEADER_DESKTOP_HEIGHT}px);
      width: 100%;
      top: ${sharedValues.HEADER_DESKTOP_HEIGHT}px;
      overflow: auto;
      border-right: var(${Theme.BORDER_PRIMARY});
    }
  `
  export namespace Sidebar {
    export const inner = styled.div<{ isVisible: boolean }>`
      ${mq.to992} {
        height: 100%;
        visibility: hidden;
        pointer-events: none;
        ${({ isVisible }) =>
          isVisible &&
          css`
            visibility: visible;
            pointer-events: all;
          `}
      }
      ${mq.at992} {
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
      z-index: 1;
      display: none;
    }
    ${mq.at992} {
      border-left: var(${Theme.BORDER_PRIMARY});
    }
  `
  export namespace Aside {
    export const inner = styled.div<{ isVisible: boolean }>`
      height: 100%;
      ${mq.to992} {
        height: 100%;
        visibility: hidden;
        pointer-events: none;
        ${({ isVisible }) =>
          isVisible &&
          css`
            visibility: visible;
            pointer-events: all;
          `}
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
      export namespace Desktop {
        export const topBarBlurBgFix = styled.div`
          width: 100vw;
          height: ${sharedValues.HEADER_DESKTOP_HEIGHT}px;
          background-color: var(${Theme.COLOR_WHITE});
          top: 0;
          position: fixed;
          z-index: 1;
        `
      }
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
      will-change: transform;
      background-color: var(${Theme.COLOR_WHITE});
      min-height: 100vh;
      border-left-width: 1px;
      border-left-style: solid;
      border-left-color: var(${Theme.COLOR_WHITE});
      border-right-width: 1px;
      border-right-style: solid;
      border-right-color: var(${Theme.COLOR_WHITE});
      transition: border-color var(${Theme.ANIMATION_DURATION_300})
        var(${Theme.TRANSITION_TIMING_FUNCTION}); // Other color is defined in the global styles
    }
    ${mq.at992} {
      flex: 1;
      transform: translateX(0px) !important;
      background: var(${Theme.COLOR_WHITE});
    }
  `
  export namespace Main {
    export const inner = styled.main<{ isDimmed: boolean }>`
      ${mq.to992} {
        opacity: ${({ isDimmed }) => (isDimmed ? 0.4 : 1)};
        min-height: calc(100vh - ${sharedValues.HEADER_MOBILE_HEIGHT}px);
        transition: opacity var(${Theme.ANIMATION_DURATION_300})
          var(${Theme.TRANSITION_TIMING_FUNCTION});
      }
      ${mq.at992} {
        min-height: calc(100vh - ${sharedValues.HEADER_DESKTOP_HEIGHT}px);
      }
    `
  }
  export const footer = styled.footer`
    border-top: var(${Theme.BORDER_PRIMARY});
  `
}