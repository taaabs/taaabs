import { LibraryStoreProvider } from './library-store-provider'

const Layout: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  return <LibraryStoreProvider>{children}</LibraryStoreProvider>
}

export default Layout
