import { GlobalStoreInitializer } from './global-store-initializer'
// import { GlobalStoreProvider } from './global-store-provider'
import { Metadata } from 'next'

import '@web-ui/styles/style.scss'
import 'react-loading-skeleton/dist/skeleton.css'

export const revalidate = 0

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  title: 'TODO',
  description: 'TODO',
  viewport:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
}
