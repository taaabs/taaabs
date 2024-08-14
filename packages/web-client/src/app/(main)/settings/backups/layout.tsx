import { Metadata } from 'next'
import { StoreProvider } from './store-provider'

const Layout: React.FC<{ children?: React.ReactNode }> = (props) => {
  return <StoreProvider>{props.children}</StoreProvider>
}

export default Layout

export const metadata: Metadata = {
  title: 'Backups',
}
