'use client'

import { Ui } from '@web-ui'
import { ClientComponentAppHeaderDesktop } from './client-component-app-header-desktop'
import { ClientComponentAppHeaderMobile } from './client-component-app-header-mobile'
import { ClientComponentBottomNavigationBar } from './client-component-bottom-navigation-bar'
import { PublicUserAvatarProvider } from './public-user-avatar-provider'
import { ModalProvider } from './modal-provider'
import { ReactNode } from 'react'

const Layout: React.FC<{
  children?: ReactNode
}> = (props) => {
  return (
    <PublicUserAvatarProvider>
      <ModalProvider>
        <Ui.App.Templates.App
          slot_header_desktop={<ClientComponentAppHeaderDesktop />}
          slot_header_mobile={<ClientComponentAppHeaderMobile />}
          slot_bottom_navigation_bar={<ClientComponentBottomNavigationBar />}
        >
          {props.children}
        </Ui.App.Templates.App>
      </ModalProvider>
    </PublicUserAvatarProvider>
  )
}

export default Layout
