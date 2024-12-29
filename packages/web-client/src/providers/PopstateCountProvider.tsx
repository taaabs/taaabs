'use client'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type PopstateCountContext = {
  popstate_count: number
  popstate_count_commited: number
  set_popstate_count_commited: (popstate_count: number) => void
}

export const PopstateCountContext = createContext<PopstateCountContext>(
  {} as PopstateCountContext,
)

export const use_popstate_count = () => useContext(PopstateCountContext)

export const PopstateCountProvider: React.FC<{ children: ReactNode }> = (
  props,
) => {
  const [popstate_count, set_popstate_count] = useState(0)
  const [popstate_count_commited, set_popstate_count_commited] = useState(0)

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
        popstate_count_commited,
        set_popstate_count_commited,
      }}
    >
      {props.children}
    </PopstateCountContext.Provider>
  )
}
