import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useWindowScroll from 'beautiful-react-hooks/useWindowScroll'
import { RefObject, useEffect, useState } from 'react'

export const useElementVisibleHeight = (ref: RefObject<HTMLDivElement>) => {
  const [footerVisibleHeight, setFooterVisibleHeight] = useState(0)
  const onWindowScroll = useWindowScroll()

  const onWindowScrollHander = useDebouncedCallback(
    () => {
      if (!ref.current) return
      const offset =
        ref.current.getBoundingClientRect().top - window.innerHeight
      if (offset < 0) {
        setFooterVisibleHeight(offset * -1)
      } else {
        setFooterVisibleHeight(0)
      }
    },
    [],
    50,
  )

  onWindowScroll(onWindowScrollHander)

  useEffect(() => {
    return () => onWindowScrollHander.cancel()
  })

  return footerVisibleHeight
}
