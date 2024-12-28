'use client'

import { Landing as Ui_landing_templates_Landing } from '@web-ui/components/landing/templates/Landing'
import { DesktopNavigation } from './_components/DesktopNavigation'
import { DesktopActions as Ui_landing_templates_Landing_DesktopActions } from '@web-ui/components/landing/templates/Landing/DesktopActions'
import { LogoForHeader as UiLogoForHeader } from '@web-ui/components/LogoForHeader'
import { usePathname, useRouter } from 'next/navigation'
import { useContext } from 'react'
import { Dictionary } from '@/dictionaries/dictionary'
import { PublicUserAvatarProvider } from '@/providers/PublicUserAvatarProvider'
import { HeaderDesktop } from './_components/HeaderDesktop'
import { HeaderMobile } from './_components/HeaderMobile'
import { App as Ui_app_templates_App } from '@web-ui/components/app/templates/App'
import { ModalProvider } from '@/providers/ModalProvider'
import { AuthContext } from '@/providers/AuthProvider'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'

const landing_pathnames = ['/about', '/pricing', '/help', '/updates']

const LayoutAuthorized: React.FC<{
  children?: React.ReactNode
  dictionary: Dictionary
  bookmarklet_script: string
}> = (props) => {
  const router = useRouter()
  const pathname = usePathname()
  const auth_context = useContext(AuthContext)

  return landing_pathnames.includes(pathname) ||
    (pathname == '/' && !auth_context.auth_data?.username) ? (
    <Ui_landing_templates_Landing
      slot_logo={<UiLogoForHeader is_large={true} href="/about" />}
      slot_desktop_user={
        <Ui_landing_templates_Landing_DesktopActions
          library_button_label={props.dictionary.landing.my_library}
          library_button_href="/library"
          library_button_on_click={(e: any) => {
            e.preventDefault()
            clear_library_session_storage({})
            router.push('/library')
          }}
          github_url="https://github.com/taaabs/taaabs"
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
        >
          {props.children}
        </Ui_app_templates_App>
      </ModalProvider>
    </PublicUserAvatarProvider>
  )
}

export default LayoutAuthorized
