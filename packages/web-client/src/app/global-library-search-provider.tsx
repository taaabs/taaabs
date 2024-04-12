'use client'

import { use_search } from '@/hooks/library/use-search'
import { ReactNode, createContext } from 'react'

export const GlobalLibarySearchContext = createContext<{
  search_hook: ReturnType<typeof use_search>
} | null>(null)

export const GlobalLibrarySearchProvider: React.FC<{
  children: ReactNode
}> = (props) => {
  const search_hook = use_search()

  return (
    <GlobalLibarySearchContext.Provider
      value={{
        search_hook,
      }}
    >
      {props.children}
    </GlobalLibarySearchContext.Provider>
  )
}
