'use client'
import { otherUserStore } from '@repositories/stores/other-user/other-user.store'
import { Provider } from 'react-redux'

export const OtherUserStoreProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <Provider store={otherUserStore}>{children}</Provider>
}
