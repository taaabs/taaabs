import { cookies } from 'next/headers'
import LayoutGuest from './layout-guest'
import LayoutAuthorized from './layout-authorized'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user_id = cookies().get('user_id')

  return user_id ? (
    <LayoutAuthorized>{children}</LayoutAuthorized>
  ) : (
    <LayoutGuest>{children}</LayoutGuest>
  )
}

export default Layout
