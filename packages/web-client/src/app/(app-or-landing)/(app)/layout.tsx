import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LocalDbProvider } from '../../local-db-provider'
import { ReactNode } from 'react'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user_id = cookies().get('user_id')

  if (!user_id) {
    redirect('/login')
  }

  return children
}

export default Layout
