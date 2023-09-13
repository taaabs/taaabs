import { Metadata } from 'next'
import { LibraryStoreProvider } from './library-store-provider'
import { ReactNode } from 'react'

const Layout: React.FC<{
  children: ReactNode
}> = async ({ children }) => {
  return <LibraryStoreProvider>{children}</LibraryStoreProvider>
}

export default Layout

export const metadata: Metadata = {
  title: 'Library',
}
