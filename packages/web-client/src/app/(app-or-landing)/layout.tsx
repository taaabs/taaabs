import { cookies } from 'next/headers'
import LayoutGuest from './layout-guest'
import LayoutAuthorized from './layout-authorized'
import { ReactNode } from 'react'
import { get_dictionary } from '../get_dictionary'
import fs from 'fs'
import path from 'path'

const bookmarklet_script = fs.readFileSync(
  path.resolve(`src/misc/bookmarklet.js`),
  'utf8',
)

const Layout: React.FC<{
  children?: ReactNode
}> = async (props) => {
  const user_id = cookies().get('user_id')
  const dictionary = await get_dictionary()

  return user_id ? (
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
