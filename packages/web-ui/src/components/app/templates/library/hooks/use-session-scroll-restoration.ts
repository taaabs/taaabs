import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { RefObject, useEffect, useState } from 'react'

export const useSessionScrollRestoration = (
  mainInnerRef: RefObject<HTMLDivElement>,
): { isRestoringScrollPosition: boolean } => {
  const [scrollTo, setScrollTo] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const onWindowScroll = useWindowScroll()

  const onScrollY = useDebouncedCallback(
    (scrollY: number) => {
      sessionStorage.setItem('scrollY', scrollY.toString())
    },
    [],
    100,
  )

  useUpdateEffect(() => {
    onScrollY(scrollY)
  }, [scrollY])

  onWindowScroll(() => {
    setScrollY(window.scrollY)
  })

  useEffect(() => {
    const listener = () => {
      const scrollTop = mainInnerRef.current?.scrollTop
      if (scrollTop != undefined) {
        setScrollY(scrollTop)
      }
    }
    mainInnerRef.current?.addEventListener('scroll', listener)

    const scrollY = sessionStorage.getItem('scrollY')
    if (scrollY) {
      setScrollTo(parseInt(scrollY))
    }

    return () => {
      sessionStorage.removeItem('scrollY')
      mainInnerRef.current?.removeEventListener('scroll', listener)
    }
  }, [])

  useEffect(() => {
    if (scrollTo) {
      window.scrollTo(0, scrollTo)
      mainInnerRef.current?.scrollTo(0, scrollTo)
      setScrollTo(null)
    }
  }, [scrollTo])

  return { isRestoringScrollPosition: scrollTo != null && scrollTo != 0 }
}
