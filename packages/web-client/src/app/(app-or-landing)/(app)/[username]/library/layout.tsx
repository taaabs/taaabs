import { Metadata } from 'next'
import { LibraryStoreProvider } from '@/providers/library-store-provider'

const Layout: React.FC<{
  children: React.ReactNode
}> = async (props) => {
  return <LibraryStoreProvider>{props.children}</LibraryStoreProvider>
}

export default Layout

export const metadata: Metadata = {
  title: 'Bookmarks',
}