import { cookies } from 'next/headers'
import LayoutGuest from './layout-guest'
import LayoutAuthorized from './layout-authorized'
import { ReactNode } from 'react'
import { get_dictionary } from '../get_dictionary'

const Layout: React.FC<{
  children?: ReactNode
}> = async (props) => {
  const user_id = cookies().get('user_id')
  const dictionary = await get_dictionary()

  return user_id ? (
    <LayoutAuthorized dictionary={dictionary}>
      {props.children}
    </LayoutAuthorized>
  ) : (
    <LayoutGuest dictionary={dictionary}>{props.children}</LayoutGuest>
  )
}

export default Layout
