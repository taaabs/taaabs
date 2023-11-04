import { useEffect, useState } from 'react'

export const use_is_hydrated = (): boolean => {
  const [is_hydrated, set_is_hydrated] = useState(false)

  useEffect(() => {
    // Fixes snap on Firefox
    setTimeout(() => {
      set_is_hydrated(true)
    }, 0)
  }, [])

  return is_hydrated
}
