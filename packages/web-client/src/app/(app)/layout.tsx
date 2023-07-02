import { App } from '@web-ui/components/app/templates/app'
import { DynamicAppHeaderDesktop } from './dynamic-app-header-desktop'
import { DynamicAppHeaderMobile } from './dynamic-app-header-mobile'
import { DynamicBottomNavigationBar } from './dynamic-bottom-navigation-bar'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <App
      slotAppHeaderDesktop={<DynamicAppHeaderDesktop />}
      slotAppHeaderMobile={<DynamicAppHeaderMobile />}
      slotBottomNavigationBar={<DynamicBottomNavigationBar />}
    >
      {children}
    </App>
  )
}

export default Layout
