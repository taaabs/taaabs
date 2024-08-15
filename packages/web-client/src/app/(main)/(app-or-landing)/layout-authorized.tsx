'use client'

import { Landing as Ui_landing_templates_Landing } from '@web-ui/components/landing/templates/landing'
import { DesktopNavigation } from './_components/DesktopNavigation'
import { DesktopUserForHeader as UiLandingMolecule_DesktopUserForHeader } from '@web-ui/components/landing/molecules/desktop-user-for-header'
import { LogoForHeader as UiLogoForHeader } from '@web-ui/components/LogoForHeader'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useContext } from 'react'
import { Dictionary } from '@/dictionaries/dictionary'
import { PublicUserAvatarProvider } from '@/providers/PublicUserAvatarProvider'
import { HeaderDesktop } from './_components/HeaderDesktop'
import { HeaderMobile } from './_components/HeaderMobile'
import { BottomNavigationBar } from './_components/BottomNavigationBar'
import { App as Ui_app_templates_App } from '@web-ui/components/app/templates/App'
import { ModalProvider } from '@/providers/ModalProvider'
import { AuthContext } from '@/providers/AuthProvider'

const landing_pathnames = ['/about', '/pricing', '/help', '/updates']

const LayoutAuthorized: React.FC<{
  children?: ReactNode
  dictionary: Dictionary
  bookmarklet_script: string
}> = (props) => {
  const pathname = usePathname()
  const router = useRouter()
  const auth_context = useContext(AuthContext)

  return landing_pathnames.includes(pathname) ||
    (pathname == '/' && !auth_context.auth_data?.username) ? (
    <Ui_landing_templates_Landing
      slot_logo={<UiLogoForHeader is_large={true} href="/about" />}
      slot_desktop_user={
        <UiLandingMolecule_DesktopUserForHeader
          button_label={props.dictionary.landing.my_library}
          button_on_click={() => {
            router.push('/library')
          }}
        />
      }
      slot_desktop_navigation={
        <DesktopNavigation dictionary={props.dictionary} />
      }
      slot_mobile_navigation={<div>mobile nav</div>}
    >
      {props.children}
    </Ui_landing_templates_Landing>
  ) : (
    <PublicUserAvatarProvider>
      <ModalProvider>
        <Ui_app_templates_App
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
        </Ui_app_templates_App>
      </ModalProvider>
    </PublicUserAvatarProvider>
  )
}

export default LayoutAuthorized
