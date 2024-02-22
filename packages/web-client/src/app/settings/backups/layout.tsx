import { Metadata } from 'next'
import { ReactNode } from 'react'
import { StoreProvider } from './store-provider'

const Layout: React.FC<{ children?: ReactNode }> = (props) => {
  return <StoreProvider>{props.children}</StoreProvider>
}

export default Layout

export const metadata: Metadata = {
  title: 'Backups',
}
