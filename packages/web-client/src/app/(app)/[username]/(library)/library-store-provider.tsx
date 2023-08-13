'use client'

import { configureLibraryStore } from '@repositories/stores/user-public/library/library.store'
import React from 'react'
import { Provider } from 'react-redux'

export const LibraryStoreProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const store = configureLibraryStore()

  return <Provider store={store}>{children}</Provider>
}
