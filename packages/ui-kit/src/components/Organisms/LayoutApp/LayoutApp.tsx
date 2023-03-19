import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'
import Slideout from 'slideout'
import { useEffect, useRef, useLayoutEffect, useState } from 'react'
import { ASIDE_AVATARS_WIDTH } from '@/styles/constants'
import { css } from '@emotion/react'

export namespace LayoutApp {
  export type Props = {
    slotAside: React.ReactNode
    slotMain: React.ReactNode
    slotTabs: React.ReactNode
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
  const asideRef = useRef<HTMLElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const mobileTabsPanelRef = useRef<HTMLDivElement>(null)

  let asideWidth: number
  // 64 (avatarbar) + 8 (gap) + 300 (sidebar) + 8 + 64 (for symmetry with avatarbar) = *444* - 64 = *380*
  if (windowWidth == null) {
    asideWidth = 0
  } else if (windowWidth >= 444) {
    asideWidth = 380
  } else {
    asideWidth = windowWidth - ASIDE_AVATARS_WIDTH
  }

  const mobileTabsPanelWidth = 220

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
      padding: asideWidth,
    })
    const slideoutRightInstance = new Slideout({
      menu: mobileTabsPanelRef.current,
      panel: mainRef.current,
      padding: mobileTabsPanelWidth,
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
    slideoutRightInstance.on('translatestart', () => {
      setIsSlideoutRightOpen(false)
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
      <S.asideLeft ref={asideRef} width={asideWidth}>
        <S.AsideLeft.inner isVisible={true}>
          {props.slotAside}
        </S.AsideLeft.inner>
      </S.asideLeft>
      <S.mobileTabsPanel ref={mobileTabsPanelRef} width={mobileTabsPanelWidth}>
        <S.MobileTabsPanel.inner isVisible={isSlideoutLeftDefinetelyClosed}>
          {props.slotTabs}
        </S.MobileTabsPanel.inner>
      </S.mobileTabsPanel>
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
    </S.container>
  )
}

namespace S {
  export const container = styled.div`
    min-height: 100vh;
    ${mq.at992} {
      display: flex;
    }
  `
  export const asideLeft = styled.aside<{ width: number }>`
    ${mq.to992} {
      position: fixed;
      top: 0;
      bottom: 0;
      width: ${({ width }) => width}px;
      min-height: 100vh;
      z-index: 0;
      display: none;
    }
    ${mq.at992} {
      width: 380px;
    }
  `
  export namespace AsideLeft {
    export const inner = styled.div<{ isVisible: boolean }>`
      height: 100%;
      visibility: hidden;
      pointer-events: none;
      ${({ isVisible }) =>
        isVisible &&
        css`
          visibility: visible;
          pointer-events: all;
        `}
    `
  }
  export const mobileTabsPanel = styled.div<{ width: number }>`
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: ${({ width }) => width}px;
    min-height: 100vh;
    z-index: 1;
    display: none;
  `
  export namespace MobileTabsPanel {
    export const inner = styled.div<{ isVisible: boolean }>`
      height: 100%;
      visibility: hidden;
      pointer-events: none;
      ${({ isVisible }) =>
        isVisible &&
        css`
          visibility: visible;
          pointer-events: all;
        `}
    `
  }
  export const main = styled.main`
    ${mq.to992} {
      position: relative;
      z-index: 2;
      will-change: transform;
      background-color: var(${Theme.COLOR_50});
      min-height: 100vh;
      border-left: 1px solid var(${Theme.COLOR_50});
      border-right: 1px solid var(${Theme.COLOR_50});
      transition: border-color var(${Theme.ANIMATION_DURATION_300})
        var(${Theme.TRANSITION_TIMING_FUNCTION}); // Other color is defined in the global styles
    }
    ${mq.at992} {
      transform: translateX(0px) !important;
    }
  `
  export namespace Main {
    export const inner = styled.div<{ isDimmed: boolean }>`
      height: 100%;
      width: 100%;
      opacity: ${({ isDimmed }) => (isDimmed ? 0.4 : 1)};
      transition: opacity var(${Theme.ANIMATION_DURATION_300})
        var(${Theme.TRANSITION_TIMING_FUNCTION});
    `
  }
}
