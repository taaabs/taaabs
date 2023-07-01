import { GlobalStoreInitializer } from './global-store-initializer'
import { GlobalStoreProvider } from './global-store-provider'
import 'react-loading-skeleton/dist/skeleton.css'
import '@web-ui/styles/style.scss'


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <GlobalStoreProvider>
          <GlobalStoreInitializer>{children}</GlobalStoreInitializer>
        </GlobalStoreProvider>
      </body>
    </html>
  )
}

export default Layout
