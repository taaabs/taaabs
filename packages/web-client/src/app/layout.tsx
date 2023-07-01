import { GlobalProviders } from '@/providers/global-providers'
import { ReduxInitializer } from './redux-initializer'

import 'react-loading-skeleton/dist/skeleton.css'
import '@web-ui/styles/style.scss'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <GlobalProviders>
          <ReduxInitializer>{children}</ReduxInitializer>
        </GlobalProviders>
      </body>
    </html>
  )
}

export default Layout
