import { GlobalProviders } from '@/providers/GlobalProviders'
import '@web-ui/styles/style.scss'
import { ReduxInitializer } from './ReduxInitializer'

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
