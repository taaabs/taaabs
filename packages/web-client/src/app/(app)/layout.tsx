import { App } from '@web-ui/components/app/templates/app'
import { ClientComponentAppHeaderDesktop } from './client-component-app-header-desktop'
import { ClientComponentAppHeaderMobile } from './client-component-app-header-mobile'
import { ClientComponentBottomNavigationBar } from './client-component-bottom-navigation-bar'
import { PublicUserAvatarProvider } from './public-user-avatar-provider'

const Layout: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  return (
    <PublicUserAvatarProvider>
      <App
        slot_AppHeaderDesktop={<ClientComponentAppHeaderDesktop />}
        slot_AppHeaderMobile={<ClientComponentAppHeaderMobile />}
        slot_BottomNavigationBar={<ClientComponentBottomNavigationBar />}
      >
        {children}
      </App>
    </PublicUserAvatarProvider>
  )
}

export default Layout
