'use client'

import { configureLibraryStore } from '@repositories/stores/other-user/library/library.store'
import { Provider } from 'react-redux'

export const LibraryStoreProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const store = configureLibraryStore()
  return <Provider store={store}>{children}</Provider>
}
