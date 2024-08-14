import { ReactNode } from 'react'
import { AuthProvider } from '@/providers/AuthProvider'
import { LocalDbProvider } from '@/providers/LocalDbProvider'

const Layout: React.FC<{
  children?: ReactNode
}> = async (props) => {
  return (
    <AuthProvider>
      <LocalDbProvider>{props.children}</LocalDbProvider>
    </AuthProvider>
  )
}

export default Layout
