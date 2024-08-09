'use client'

import { Landing as UiLandingTemplate_Landing } from '@web-ui/components/landing/templates/landing'
import { DesktopNavigation } from './_components/DesktopNavigation'
import { DesktopUserForHeader as UiLandingMolecule_DesktopUserForHeader } from '@web-ui/components/landing/molecules/desktop-user-for-header'
import { LogoForHeader as UiLogoForHeader } from '@web-ui/components/LogoForHeader'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Dictionary } from '@/dictionaries/dictionary'
import { PublicUserAvatarProvider } from '@/providers/PublicUserAvatarProvider'
import { HeaderDesktop } from './_components/HeaderDesktop'
import { HeaderMobile } from './_components/HeaderMobile'
import { BottomNavigationBar } from './_components/BottomNavigationBar'
import { App as Ui_app_templates_App } from '@web-ui/components/app/templates/App'

const landing_pathnames = ['/', '/pricing', '/help', '/updates']

const LayoutGuest: React.FC<{
  children?: ReactNode
  dictionary: Dictionary
}> = (props) => {
  const pathname = usePathname()

  return landing_pathnames.includes(pathname) ? (
    <UiLandingTemplate_Landing
      slot_logo={<UiLogoForHeader is_large={true} href={'/'} />}
      slot_desktop_user={
        <UiLandingMolecule_DesktopUserForHeader
          button_label={props.dictionary.landing.log_in}
          button_href={'/login'}
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
      <Ui_app_templates_App
        slot_header_desktop={
          <HeaderDesktop dictionary={props.dictionary} bookmarklet_script="" />
        }
        slot_header_mobile={<HeaderMobile />}
        slot_bottom_navigation_bar={
          <BottomNavigationBar dictionary={props.dictionary} />
        }
      >
        {props.children}
      </Ui_app_templates_App>
    </PublicUserAvatarProvider>
  )
}

export default LayoutGuest
