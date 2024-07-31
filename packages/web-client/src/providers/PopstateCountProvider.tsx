'use client'

import { ReactNode, createContext, useEffect, useState } from 'react'

type PopstateCountContext = {
  popstate_count: number
}

export const PopstateCountContext = createContext<PopstateCountContext>(
  {} as PopstateCountContext,
)

export const PopstateCountProvider: React.FC<{ children: ReactNode }> = (
  props,
) => {
  const [popstate_count, set_popstate_count] = useState(0)

  useEffect(() => {
    const handle_popstate = () => {
      set_popstate_count(Date.now())
    }
    window.addEventListener('popstate', handle_popstate)
    return () => window.removeEventListener('popstate', handle_popstate)
  }, [])

  return (
    <PopstateCountContext.Provider
      value={{
        popstate_count,
      }}
    >
      {props.children}
    </PopstateCountContext.Provider>
  )
}
