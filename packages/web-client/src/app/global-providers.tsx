'use client'
import rootStore from '@repositories/stores/root/root.store'
import { Provider } from 'react-redux'

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={rootStore}>{children}</Provider>
}
