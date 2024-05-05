'use client'

import { Landing as UiLandingTemplate_Landing } from '@web-ui/components/landing/templates/landing'
import { DynamicDesktopNavigationForHeader } from './dynamic-desktop-navigation-for-header'
import { DynamicDesktopUserForHeader } from './dynamic-desktop-user-for-header'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { ClientComponentAppHeaderDesktop } from './client-component-app-header-desktop'
import { ClientComponentAppHeaderMobile } from './client-component-app-header-mobile'
import { ClientComponentBottomNavigationBar } from './client-component-bottom-navigation-bar'
import { App as UiAppTemplate_App } from '@web-ui/components/app/templates/app'
import { PublicUserAvatarProvider } from '@/providers/public-user-avatar-provider'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'
import { AuthContext } from '../auth-provider'

const landing_pathnames = ['/about', '/pricing', '/help', '/updates']

const LayoutAuthorized: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname()
  const auth_context = useContext(AuthContext)!

  return landing_pathnames.includes(pathname) ? (
    <UiLandingTemplate_Landing
      slot_logo={
        <LogoForHeader
          is_large={true}
          href={auth_context.auth_data ? '/about' : '/'}
        />
      }
      slot_desktop_user={<DynamicDesktopUserForHeader is_authorized={true} />}
      slot_desktop_navigation={<DynamicDesktopNavigationForHeader />}
      slot_mobile_navigation={<div>mobile nav</div>}
    >
      <>{children}</>
    </UiLandingTemplate_Landing>
  ) : (
    <PublicUserAvatarProvider>
      <UiAppTemplate_App
        slot_header_desktop={<ClientComponentAppHeaderDesktop />}
        slot_header_mobile={<ClientComponentAppHeaderMobile />}
        slot_bottom_navigation_bar={<ClientComponentBottomNavigationBar />}
      >
        {children}
      </UiAppTemplate_App>
    </PublicUserAvatarProvider>
  )
}

export default LayoutAuthorized
