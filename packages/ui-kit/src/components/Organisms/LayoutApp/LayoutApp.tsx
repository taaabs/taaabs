import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'
import Slideout from 'slideout'
import { useEffect, useRef, useLayoutEffect, useState } from 'react'
import { ASIDE_AVATARS_WIDTH } from '@/styles/constants'

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

  let asideWidth: number
  // 64 (avatarbar) + 8 (gap) + 300 (sidebar) + 8 + 64 (for symmetry with avatarbar) = *444* - 64 = *380*
  if (windowWidth == null) {
    asideWidth = 0
  } else if (windowWidth >= 444) {
    asideWidth = 380
  } else {
    asideWidth = windowWidth - ASIDE_AVATARS_WIDTH
  }

  useEffect(() => {
    if (!windowWidth || !asideRef.current || !mainRef.current) return

    const slideoutInstance = new Slideout({
      menu: asideRef.current,
      panel: mainRef.current,
      padding: asideWidth,
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
    <S.container.$>
      <S.aside.$ ref={asideRef} width={asideWidth}>
        {props.slotAside}
      </S.aside.$>
      <S.main.$
        ref={mainRef}
        onClick={() => isSlideoutOpen && slideout?.close()}
      >
        <S.main.inner.$
          isDimmed={
            (isSlideoutOpen && !isSlideoutDragged) ||
            (!isSlideoutOpen && isSlideoutDragged)
          }
        >
          <button onClick={() => slideout?.open()}>BURGER</button>
          {props.slotMain}
        </S.main.inner.$>
      </S.main.$>
    </S.container.$>
  )
}

namespace S {
  export const container = {
    $: styled.div`
      min-height: 100vh;
      ${mq.at992} {
        display: flex;
      }
    `,
  }
  export const aside = {
    $: styled.aside<{ width: number }>`
      ${mq.to992} {
        position: fixed;
        top: 0;
        bottom: 0;
        width: ${({ width }) => width}px;
        min-height: 100vh;
        -webkit-overflow-scrolling: touch;
        z-index: 0;
        display: none;
      }
      ${mq.at992} {
        width: 380px;
      }
    `,
  }
  export const main = {
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
    inner: {
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
