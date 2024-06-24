import { _Layout } from './_Layout'
import { get_dictionary } from '../get_dictionary'

const Layout: React.FC<{ children?: React.ReactNode }> = async ({
  children,
}) => {
  const dictionary = await get_dictionary()
  return <_Layout dictionary={dictionary}>{children}</_Layout>
}

export default Layout
