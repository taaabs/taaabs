import { ReactNode } from 'react'
import { Metadata } from 'next'
import { SettingsAccountStoreProvider } from './settings-account-store-provider'

const Layout: React.FC<{ children?: ReactNode }> = (props) => {
  return (
    <SettingsAccountStoreProvider>
      {props.children}
    </SettingsAccountStoreProvider>
  )
}

export default Layout

export const metadata: Metadata = {
  title: 'Account',
}
