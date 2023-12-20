import { useEffect, useState } from 'react'

export const use_popstate = () => {
  const [pop_count, set_pop_count] = useState(0)

  const handleEvent = () => {
    set_pop_count(pop_count + 1)
  }

  useEffect(() => {
    window.addEventListener('popstate', handleEvent)
    return () => window.removeEventListener('popstate', handleEvent)
  }, [pop_count])

  return { pop_count, set_pop_count }
}
