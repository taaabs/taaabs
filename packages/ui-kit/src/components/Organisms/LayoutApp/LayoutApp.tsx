import { Atoms } from '@/components'
import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Slideout from 'slideout'
import { useEffect, useRef, useLayoutEffect, useState } from 'react'
import { avatarPinBarWidth } from '@/styles/constants'
import { AsideAvatars } from './subcomponents/AsideAvatars/AsideAvatars'

export namespace LayoutApp {
  export type Props = {
    slotAside: React.ReactNode
    slotMain: React.ReactNode
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
  const [slideout, setSlideout] = useState<Slideout>()
  const [isSlideoutOpen, setIsSlideoutOpen] = useState(false)
  const [isSlideoutDragged, setIsSlideoutDragged] = useState(false)
  const asideRef = useRef<HTMLElement>(null)
  const mainRef = useRef<HTMLElement>(null)

  let padding: number
  // 64 (avatarbar) + 8 (gap) + 300 (sidebar) + 8 + 64 (for symmetry with avatarbar) = *444* - 64 = *380*
  if (windowWidth == null) {
    padding = 0
  } else if (windowWidth >= 444) {
    padding = 380
  } else {
    padding = windowWidth - avatarPinBarWidth
  }

  useEffect(() => {
    if (!windowWidth) return

    const slideoutInstance = new Slideout({
      menu: asideRef.current!,
      panel: mainRef.current!,
      padding: padding,
    })
    slideoutInstance.on('beforeclose', () => {
      setIsSlideoutOpen(false)
    })
    slideoutInstance.on('beforeopen', () => {
      setIsSlideoutOpen(true)
    })
    slideoutInstance.on('translatestart', () => {
      setIsSlideoutDragged(true)
    })
    slideoutInstance.on('translateend', () => {
      setIsSlideoutDragged(false)
    })
    setSlideout(slideoutInstance)
    return () => {
      slideoutInstance.destroy()
    }
  }, [windowWidth])

  return (
    <Styled.Container.$>
      <Styled.Aside.$ ref={asideRef} width={padding}>
        <Styled.Aside.Inner.$>
          <AsideAvatars pinnedAvatars={[]} isLogoActive={false} />
          <Styled.Aside.Inner.Sidebar.$>
            <div>xx</div>
          </Styled.Aside.Inner.Sidebar.$>
        </Styled.Aside.Inner.$>
      </Styled.Aside.$>
      <Styled.Main.$
        ref={mainRef}
        onClick={() => isSlideoutOpen && slideout?.close()}
      >
        <Styled.Main.Inner.$
          isDimmed={
            (isSlideoutOpen && !isSlideoutDragged) ||
            (!isSlideoutOpen && isSlideoutDragged)
          }
        >
          <button onClick={() => slideout?.open()}>BURGER</button>
        </Styled.Main.Inner.$>
      </Styled.Main.$>
    </Styled.Container.$>
  )
}

namespace Styled {
  export const Container = {
    $: styled.div`
      min-height: 100vh;
      ${mq.at992} {
        display: flex;
      }
    `,
  }
  export const Aside = {
    $: styled.aside<{ width: number }>`
      ${mq.to992} {
        position: fixed;
        top: 0;
        bottom: 0;
        width: ${({ width }) => width}px;
        min-height: 100vh;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        z-index: 0;
        display: none;
      }
      ${mq.at992} {
        width: 380px;
      }
    `,
    Inner: {
      $: styled.div`
        display: flex;
      `,
      Sidebar: {
        $: styled.div`
          flex: 1;
        `,
      },
    },
  }
  export const Main = {
    $: styled.main`
      ${mq.to992} {
        position: relative;
        z-index: 1;
        will-change: transform;
        background-color: var(${Theme.COLOR_50});
        min-height: 100vh;
        border-left: 1px solid var(${Theme.COLOR_50});
        transition: border-color var(${Theme.ANIMATION_DURATION_300})
          var(${Theme.TRANSITION_TIMING_FUNCTION}); // Other color is defined in the global styles
      }
      ${mq.at992} {
        transform: translateX(0px) !important;
      }
    `,
    Inner: {
      $: styled.div<{ isDimmed: boolean }>`
        height: 100%;
        width: 100%;
        opacity: ${({ isDimmed }) => (isDimmed ? 0.4 : 1)};
        transition: opacity var(${Theme.ANIMATION_DURATION_300})
          var(${Theme.TRANSITION_TIMING_FUNCTION});
      `,
    },
  }
}
