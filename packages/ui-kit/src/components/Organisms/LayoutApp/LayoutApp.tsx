import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'
import Slideout from 'slideout'
import { useEffect, useRef, useLayoutEffect, useState } from 'react'
import { ASIDE_AVATARS_WIDTH } from '@/styles/constants'
import { css } from '@emotion/react'
import StickyBox from 'react-sticky-box'

export namespace LayoutApp {
  export type Props = {
    slotDesktopTopNavigationBar: React.ReactNode
    slotHeader: React.ReactNode
    slotMain: React.ReactNode
    slotAside: React.ReactNode
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
  const asideRef = useRef<HTMLElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const mobileTabsPanelRef = useRef<HTMLDivElement>(null)

  let slidableWidth: number
  // 64 (avatarbar) + 8 (gap) + 300 (sidebar) + 8 + 64 (for symmetry with avatarbar) = *444* - 64 = *380*
  if (windowWidth == null) {
    slidableWidth = 0
  } else if (windowWidth >= 444) {
    slidableWidth = 380
  } else {
    slidableWidth = windowWidth - ASIDE_AVATARS_WIDTH
  }

  useEffect(() => {
    if (
      !windowWidth ||
      !asideRef.current ||
      !mainRef.current ||
      !mobileTabsPanelRef.current
    )
      return
    const slideoutLeftInstance = new Slideout({
      menu: asideRef.current,
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
    <>
      <S.desktopTopNavigationBar>
        <S.wrapper>{props.slotDesktopTopNavigationBar}</S.wrapper>
      </S.desktopTopNavigationBar>

      <S.wrapper>
        <S.content>
          <S.header ref={asideRef} width={slidableWidth}>
            <S.Header.inner isVisible={isSlideoutRightDefinetelyClosed}>
              {props.slotHeader}
            </S.Header.inner>
          </S.header>

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
          </S.main>

          <S.aside ref={mobileTabsPanelRef} width={slidableWidth}>
            <S.Aside.inner isVisible={isSlideoutLeftDefinetelyClosed}>
              {windowWidth && windowWidth >= 992 ? (
                <>
                  <S.Aside.Inner.Desktop.topBarBlurBgFix />
                  <StickyBox offsetTop={S.DESKTOP_TOP_NAVIGATION_BAR_HEIGHT}>
                    {props.slotAside}
                  </StickyBox>
                </>
              ) : (
                props.slotAside
              )}
            </S.Aside.inner>
          </S.aside>
        </S.content>
      </S.wrapper>
    </>
  )
}

namespace S {
  const SITE_WIDTH = 1380
  export const DESKTOP_TOP_NAVIGATION_BAR_HEIGHT = 60

  export const wrapper = styled.div`
    ${mq.at992} {
      max-width: ${SITE_WIDTH}px;
      width: 100%;
      margin: 0 auto;
      padding: 0 40px;
    }
  `
  export const desktopTopNavigationBar = styled.div`
    ${mq.to992} {
      display: none;
    }
    border-bottom: var(${Theme.BORDER_PRIMARY});
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: saturate(180%) blur(5px);
    height: ${DESKTOP_TOP_NAVIGATION_BAR_HEIGHT}px;
    display: flex;
    align-items: center;
  `
  export const content = styled.div`
    ${mq.at992} {
      display: flex;
      width: 100%;
      min-height: 100vh;
      & > aside,
      & > header {
        width: 23vw;
        ${mq.at1200} {
          width: 22vw;
        }
        ${mq.at1380} {
          width: 300px;
        }
      }
    }
  `
  export const header = styled.header<{ width: number }>`
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
      height: calc(100vh - ${DESKTOP_TOP_NAVIGATION_BAR_HEIGHT}px);
      width: 100%;
      top: ${DESKTOP_TOP_NAVIGATION_BAR_HEIGHT}px;
      overflow: auto;
      border-right: var(${Theme.BORDER_PRIMARY});
    }
  `
  export namespace Header {
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
      padding-top: ${DESKTOP_TOP_NAVIGATION_BAR_HEIGHT}px;
      border-left: var(${Theme.BORDER_PRIMARY});
      z-index: -1;
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
          height: ${DESKTOP_TOP_NAVIGATION_BAR_HEIGHT}px;
          background-color: var(${Theme.COLOR_WHITE});
          top: 0;
          position: fixed;
          z-index: 1;
        `
      }
    }
  }
  export const main = styled.main`
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
    export const inner = styled.div<{ isDimmed: boolean }>`
      ${mq.to992} {
        opacity: ${({ isDimmed }) => (isDimmed ? 0.4 : 1)};
        transition: opacity var(${Theme.ANIMATION_DURATION_300})
          var(${Theme.TRANSITION_TIMING_FUNCTION});
      }
      ${mq.at992} {
        padding-top: ${DESKTOP_TOP_NAVIGATION_BAR_HEIGHT}px;
      }
    `
  }
}
