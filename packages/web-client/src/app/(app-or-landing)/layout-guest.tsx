'use client'

import { Landing as UiLandingTemplate_Landing } from '@web-ui/components/landing/templates/landing'
import { DynamicDesktopNavigationForHeader } from './dynamic-desktop-navigation-for-header'
import { DynamicDesktopUserForHeader } from './dynamic-desktop-user-for-header'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Dictionary } from '@/dictionaries/dictionary'
import { PublicUserAvatarProvider } from '@/providers/public-user-avatar-provider'
import { ClientComponentAppHeaderDesktop } from './client-component-app-header-desktop'
import { ClientComponentAppHeaderMobile } from './client-component-app-header-mobile'
import { ClientComponentBottomNavigationBar } from './client-component-bottom-navigation-bar'
import { App as UiAppTemplate_App } from '@web-ui/components/app/templates/app'

const landing_pathnames = ['/', '/pricing', '/help', '/updates']

const LayoutGuest: React.FC<{
  children?: ReactNode
  dictionary: Dictionary
}> = (props) => {
  const pathname = usePathname()

  return landing_pathnames.includes(pathname) ? (
    <UiLandingTemplate_Landing
      slot_logo={<LogoForHeader is_large={true} href={'/'} />}
      slot_desktop_user={
        <DynamicDesktopUserForHeader
          is_authorized={false}
          dictionary={props.dictionary}
        />
      }
      slot_desktop_navigation={
        <DynamicDesktopNavigationForHeader dictionary={props.dictionary} />
      }
      slot_mobile_navigation={<div>mobile nav</div>}
    >
      {props.children}
    </UiLandingTemplate_Landing>
  ) : (
    <PublicUserAvatarProvider>
      <UiAppTemplate_App
        slot_header_desktop={
          <ClientComponentAppHeaderDesktop dictionary={props.dictionary} />
        }
        slot_header_mobile={<ClientComponentAppHeaderMobile />}
        slot_bottom_navigation_bar={
          <ClientComponentBottomNavigationBar dictionary={props.dictionary} />
        }
      >
        {props.children}
      </UiAppTemplate_App>
    </PublicUserAvatarProvider>
  )
}

export default LayoutGuest
