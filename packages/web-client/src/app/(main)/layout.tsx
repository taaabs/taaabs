import { AuthProvider } from '@/providers/AuthProvider'
import { LocalDbProvider } from '@/providers/LocalDbProvider'

const Layout: React.FC<{
  children?: React.ReactNode
}> = (props) => {
  return (
    <AuthProvider>
      <LocalDbProvider>{props.children as any}</LocalDbProvider>
    </AuthProvider>
  )
}

export default Layout
