import { App } from '@web-ui/components/app/templates/app'
import { ClientComponentAppHeaderDesktop } from './client-component-app-header-desktop'
import { ClientComponentAppHeaderMobile } from './client-component-app-header-mobile'
import { ClientComponentBottomNavigationBar } from './client-component-bottom-navigation-bar'
import { OtherUserAvatarProvider } from './other-user-avatar-provider'

const Layout: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  return (
    <OtherUserAvatarProvider>
      <App
        slotAppHeaderDesktop={<ClientComponentAppHeaderDesktop />}
        slotAppHeaderMobile={<ClientComponentAppHeaderMobile />}
        slotBottomNavigationBar={<ClientComponentBottomNavigationBar />}
      >
        {children}
      </App>
    </OtherUserAvatarProvider>
  )
}

export default Layout
