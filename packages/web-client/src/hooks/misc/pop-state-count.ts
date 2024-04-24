import { useEffect, useState } from 'react'

export const use_popstate_count = (): number => {
  const [pop_state_count, set_pop_state_count] = useState(0)

  const handle_pop_state = () => {
    setTimeout(() => {
      // After all hooks have run, we commit the pop event in the next frame.
      set_pop_state_count((count) => count + 1)
    }, 0)
  }

  useEffect(() => {
    window.addEventListener('popstate', handle_pop_state)

    return () => window.removeEventListener('popstate', handle_pop_state)
  }, [])

  return pop_state_count
}
