'use client'

import { Landing as Ui_landing_templates_Landing } from '@web-ui/components/landing/templates/Landing'
import { DesktopNavigation } from './_components/DesktopNavigation'
import { DesktopActions as Ui_landing_templates_Landing_DesktopActions } from '@web-ui/components/landing/templates/Landing/DesktopActions'
import { LogoForHeader as UiLogoForHeader } from '@web-ui/components/LogoForHeader'
import { usePathname } from 'next/navigation'
import { Dictionary } from '@/dictionaries/dictionary'
import { PublicUserAvatarProvider } from '@/providers/PublicUserAvatarProvider'
import { HeaderDesktop } from './_components/HeaderDesktop'
import { HeaderMobile } from './_components/HeaderMobile'
import { App as Ui_app_templates_App } from '@web-ui/components/app/templates/App'

const landing_pathnames = ['/', '/pricing', '/help', '/updates']

const LayoutVisitor: React.FC<{
  children?: React.ReactNode
  dictionary: Dictionary
}> = (props) => {
  const pathname = usePathname()

  return landing_pathnames.includes(pathname) ? (
    <Ui_landing_templates_Landing
      slot_logo={<UiLogoForHeader is_large={true} href={'/'} />}
      slot_desktop_user={
        <Ui_landing_templates_Landing_DesktopActions
          library_button_label={props.dictionary.landing.my_library}
          library_button_href="/welcome"
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
      <Ui_app_templates_App
        slot_header_desktop={<HeaderDesktop dictionary={props.dictionary} />}
        slot_header_mobile={<HeaderMobile />}
      >
        {props.children}
      </Ui_app_templates_App>
    </PublicUserAvatarProvider>
  )
}

export default LayoutVisitor
