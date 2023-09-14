'use client'

import { configure_library_store } from '@repositories/stores/user-public/library/library.store'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'

export const LibraryStoreProvider: React.FC<{
  children: ReactNode
}> = ({ children }) => {
  const store = configure_library_store()

  return <Provider store={store}>{children}</Provider>
}
