import { cookies } from 'next/headers'
import LayoutGuest from './layout-guest'
import LayoutAuthorized from './layout-authorized'
import { get_dictionary } from '../../get_dictionary'
import fs from 'fs'
import path from 'path'

const bookmarklet_script = fs.readFileSync(
  path.resolve(`src/misc/bookmarklet.js`),
  'utf8',
)

const Layout: React.FC<{
  children?: React.ReactNode
}> = async (props) => {
  const user_id = cookies().get('user_id')
  const guest_user_id = cookies().get('guest_user_id')
  const dictionary = await get_dictionary()

  return user_id || guest_user_id ? (
    <LayoutAuthorized
      dictionary={dictionary}
      bookmarklet_script={`javascript:(async function () {${bookmarklet_script
        .replaceAll("'", '%27')
        .replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, '') // Removes comments
        .replace(/\s{2,}/g, '')}})()`}
    >
      {props.children}
    </LayoutAuthorized>
  ) : (
    <LayoutGuest dictionary={dictionary}>{props.children}</LayoutGuest>
  )
}

export default Layout
