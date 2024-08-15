import { LibraryStoreProvider } from '@/providers/LibraryStoreProvider'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Layout: React.FC<{
  children: React.ReactNode
  modal: React.ReactNode
}> = (props) => {
  const user_id = cookies().get('user_id')
  const guest_user_id = cookies().get('guest_user_id')
  if (!user_id && !guest_user_id) {
    redirect('/welcome')
  }

  return <LibraryStoreProvider>{props.children}</LibraryStoreProvider>
}

export default Layout

export const metadata: Metadata = {
  title: 'Library',
}
