import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { useState } from 'react'

export const useSessionScrollY = () => {
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
}
