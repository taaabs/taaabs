import { useIsHydrated } from '@shared/hooks'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { RefObject, useEffect, useState } from 'react'

export const useScrollRestore = (mainInnerRef: RefObject<HTMLDivElement>) => {
  const [scrollY, setScrollY] = useState(0)
  const onWindowScroll = useWindowScroll()
  const queryParams = use_shallow_search_params()
  const isHydrated = useIsHydrated()

  const onScrollY = useDebouncedCallback(
    (scrollY: number, queryParams: URLSearchParams) => {
      sessionStorage.setItem(
        `scrollY_${queryParams.toString()}`,
        scrollY.toString(),
      )
    },
    [],
    100,
  )

  useUpdateEffect(() => {
    onScrollY(scrollY, queryParams)
  }, [scrollY, queryParams])

  onWindowScroll(() => {
    setScrollY(window.scrollY)
  })

  useEffect(() => {
    const scrollY = sessionStorage.getItem(`scrollY_${queryParams.toString()}`)
    if (scrollY) {
      const y = parseInt(scrollY)
      mainInnerRef.current?.scrollTo(0, y)
      window.scrollTo(0, y)
    }
  }, [isHydrated])

  useEffect(() => {
    const listener = () => {
      const scrollTop = mainInnerRef.current?.scrollTop
      if (scrollTop != undefined) {
        setScrollY(scrollTop)
      }
    }
    mainInnerRef.current?.addEventListener('scroll', listener)

    return () => {
      for (const key in sessionStorage) {
        if (key.substring(0, 7) == 'scrollY') {
          sessionStorage.removeItem(key)
        }
      }
      mainInnerRef.current?.removeEventListener('scroll', listener)
    }
  }, [])
}
