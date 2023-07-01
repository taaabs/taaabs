'use client'
import otherUserStore from '@repositories/stores/other-user/other-user.store'
import { Provider } from 'react-redux'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Provider store={otherUserStore}>{children}</Provider>
}

export default Layout
