import { ClientComponentAppHeaderDesktop } from './client-component-app-header-desktop'
import { ClientComponentAppHeaderMobile } from './client-component-app-header-mobile'
import { ClientComponentBottomNavigationBar } from './client-component-bottom-navigation-bar'
import { ReactNode } from 'react'
import { App as UiAppTemplate_App } from '@web-ui/components/app/templates/app'
import { PublicUserAvatarProvider } from '@/providers/public-user-avatar-provider'
import { ModalProvider } from '@/providers/modal-provider'
import { GlobalLibrarySearchProvider } from './global-library-search-provider'

const Layout: React.FC<{
  children?: ReactNode
}> = (props) => {
  return (
    <GlobalLibrarySearchProvider>
      <PublicUserAvatarProvider>
        <ModalProvider>
          <UiAppTemplate_App
            slot_header_desktop={<ClientComponentAppHeaderDesktop />}
            slot_header_mobile={<ClientComponentAppHeaderMobile />}
            slot_bottom_navigation_bar={<ClientComponentBottomNavigationBar />}
          >
            {props.children}
          </UiAppTemplate_App>
        </ModalProvider>
      </PublicUserAvatarProvider>
    </GlobalLibrarySearchProvider>
  )
}

export default Layout
