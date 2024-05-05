'use client'

import { use_search } from '@/hooks/library/use-search'
import { ReactNode, createContext } from 'react'

export const PublicUserLibarySearchContext = createContext<{
  search_hook: ReturnType<typeof use_search>
} | null>(null)

export const PublicUserLibrarySearchProvider: React.FC<{
  children: ReactNode
}> = (props) => {
  const search_hook = use_search()

  return (
    <PublicUserLibarySearchContext.Provider
      value={{
        search_hook,
      }}
    >
      {props.children}
    </PublicUserLibarySearchContext.Provider>
  )
}
