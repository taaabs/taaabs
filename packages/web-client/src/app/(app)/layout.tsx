import { App } from '@web-ui/components/app/templates/app'
import { ClientComponentAppHeaderDesktop } from './client-component-app-header-desktop'
import { ClientComponentAppHeaderMobile } from './client-component-app-header-mobile'
import { ClientComponentBottomNavigationBar } from './client-component-bottom-navigation-bar'
import { PublicUserAvatarProvider } from './public-user-avatar-provider'
import { ModalProvider } from './modal-provider'

const Layout: React.FC<{
  children?: React.ReactNode
}> = (props) => {
  return (
    <PublicUserAvatarProvider>
      <ModalProvider>
        <App
          slot_header_desktop={<ClientComponentAppHeaderDesktop />}
          slot_header_mobile={<ClientComponentAppHeaderMobile />}
          slot_bottom_navigation_bar={<ClientComponentBottomNavigationBar />}
        >
          {props.children}
        </App>
      </ModalProvider>
    </PublicUserAvatarProvider>
  )
}

export default Layout
