import { LayoutSettings } from './layout-settings'
import { get_dictionary } from '../get_dictionary'

const Layout: React.FC<{ children?: React.ReactNode }> = async ({
  children,
}) => {
  const dictionary = await get_dictionary()
  return <LayoutSettings dictionary={dictionary}>{children}</LayoutSettings>
}

export default Layout
