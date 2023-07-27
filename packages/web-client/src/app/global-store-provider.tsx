'use client'

import React from 'react'
import { globalStore } from '@repositories/stores/global/global.store'
import { Provider } from 'react-redux'

export const GlobalStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={globalStore}>{children}</Provider>
}
