import { GlobalStoreInitializer } from './global-store-initializer'
import { GlobalStoreProvider } from './global-store-provider'
import 'react-loading-skeleton/dist/skeleton.css'
import '@web-ui/styles/style.scss'
import axios from 'axios'
import { Metadata } from 'next'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

  return (
    <html lang="en">
      <body>
        {/* <GlobalStoreProvider> */}
        <GlobalStoreInitializer>{children}</GlobalStoreInitializer>
        {/* </GlobalStoreProvider> */}
      </body>
    </html>
  )
}

export default Layout

export const metadata: Metadata = {
  title: '...1',
  description: '...1',
}
