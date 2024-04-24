import { useEffect, useState } from 'react'

export const use_popstate_count = (): number => {
  const [pop_state_count, set_pop_state_count] = useState(0)

  const handle_pop_state = () => {
    set_pop_state_count((count) => count + 1)
  }

  useEffect(() => {
    window.addEventListener('popstate', handle_pop_state)

    return () => window.removeEventListener('popstate', handle_pop_state)
  }, [])

  return pop_state_count
}
