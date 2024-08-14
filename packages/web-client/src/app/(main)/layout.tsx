import { AuthProvider } from '@/providers/AuthProvider'
import { LocalDbProvider } from '@/providers/LocalDbProvider'

const Layout: React.FC<{
  children?: React.ReactNode
}> = async (props) => {
  return (
    <AuthProvider>
      <LocalDbProvider>{props.children}</LocalDbProvider>
    </AuthProvider>
  )
}

export default Layout
