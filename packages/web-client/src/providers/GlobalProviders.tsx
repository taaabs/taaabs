'use client'

import store from '@repositories/stores/root/root.store'
import { Provider } from 'react-redux'

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>
}
