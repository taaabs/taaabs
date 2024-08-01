'use client'

import { Landing as UiLandingTemplate_Landing } from '@web-ui/components/landing/templates/landing'
import { DesktopNavigation } from './_components/DesktopNavigation'
import { DesktopUserForHeader as UiLandingMolecule_DesktopUserForHeader } from '@web-ui/components/landing/molecules/desktop-user-for-header'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { Dictionary } from '@/dictionaries/dictionary'
import { PublicUserAvatarProvider } from '@/providers/PublicUserAvatarProvider'
import { HeaderDesktop } from './_components/HeaderDesktop'
import { HeaderMobile } from './_components/HeaderMobile'
import { BottomNavigationBar } from './_components/BottomNavigationBar'
import { App as UiAppTemplate_App } from '@web-ui/components/app/templates/App'
import { ModalProvider } from '@/providers/ModalProvider'

const landing_pathnames = ['/about', '/pricing', '/help', '/updates']

const LayoutAuthorized: React.FC<{
  children?: ReactNode
  dictionary: Dictionary
  bookmarklet_script: string
}> = (props) => {
  const pathname = usePathname()

  return landing_pathnames.includes(pathname) ? (
    <UiLandingTemplate_Landing
      slot_logo={<LogoForHeader is_large={true} href="/about" />}
      slot_desktop_user={
        <UiLandingMolecule_DesktopUserForHeader
          button_label={props.dictionary.landing.open_app}
          button_href={'/library'}
        />
      }
      slot_desktop_navigation={
        <DesktopNavigation dictionary={props.dictionary} />
      }
      slot_mobile_navigation={<div>mobile nav</div>}
    >
      {props.children}
    </UiLandingTemplate_Landing>
  ) : (
    <PublicUserAvatarProvider>
      <ModalProvider>
        <UiAppTemplate_App
          slot_header_desktop={
            <HeaderDesktop
              dictionary={props.dictionary}
              bookmarklet_script={props.bookmarklet_script}
            />
          }
          slot_header_mobile={<HeaderMobile />}
          slot_bottom_navigation_bar={
            <BottomNavigationBar dictionary={props.dictionary} />
          }
        >
          {props.children}
        </UiAppTemplate_App>
      </ModalProvider>
    </PublicUserAvatarProvider>
  )
}

export default LayoutAuthorized
