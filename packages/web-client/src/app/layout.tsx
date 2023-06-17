import { GlobalProviders } from '@/providers/GlobalProviders'
import { ReduxInitializer } from './ReduxInitializer'

import '@web-ui/styles/style.scss'
import 'react-loading-skeleton/dist/skeleton.css'

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
