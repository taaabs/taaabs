import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { RefObject, useEffect, useState } from 'react'

export const useMobileScrollRestore = (
  mainInnerRef: RefObject<HTMLDivElement>,
) => {
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
      // It's important to scroll in the next frame, as bookmarks from
      // session storage have to be fetched first.
      setTimeout(() => {
        mainInnerRef.current?.scrollTo(0, parseInt(scrollY))
      }, 0)
    }

    return () => {
      sessionStorage.removeItem('scrollY')
      mainInnerRef.current?.removeEventListener('scroll', listener)
    }
  }, [])
}
