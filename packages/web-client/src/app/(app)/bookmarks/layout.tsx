import { LibraryStoreProvider } from '@/providers/library-store-provider'
import { Metadata } from 'next'

const Layout: React.FC<{
  children: React.ReactNode
  modal: React.ReactNode
}> = (props) => {
  return (
    <LibraryStoreProvider>
      <div>{props.children}</div>
      <div>{props.modal}</div>
    </LibraryStoreProvider>
  )
}

export default Layout

// export const metadata: Metadata = {
//   title: 'Bookmarks',
// }
