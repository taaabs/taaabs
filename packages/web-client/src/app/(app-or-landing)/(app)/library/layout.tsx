import { LibraryStoreProvider } from '@/providers/LibraryStoreProvider'
import { Metadata } from 'next'

const Layout: React.FC<{
  children: React.ReactNode
  modal: React.ReactNode
}> = (props) => {
  return <LibraryStoreProvider>{props.children}</LibraryStoreProvider>
}

export default Layout

export const metadata: Metadata = {
  title: 'Bookmarks',
}
