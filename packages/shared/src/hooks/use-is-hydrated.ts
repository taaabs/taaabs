import { useEffect, useState } from 'react'

export const use_is_hydrated = (): boolean => {
  const [is_hydrated, set_is_hydrated] = useState(false)

  useEffect(() => {
    set_is_hydrated(true)
  }, [])

  return is_hydrated
}
