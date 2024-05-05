import { Landing as UiLandingTemplate_Landing } from '@web-ui/components/landing/templates/landing'
import { DynamicDesktopNavigationForHeader } from './dynamic-desktop-navigation-for-header'
import { DynamicDesktopUserForHeader } from './dynamic-desktop-user-for-header'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'

const LayoutGuest: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <UiLandingTemplate_Landing
      slot_logo={<LogoForHeader is_large={true} href="/" />}
      slot_desktop_user={<DynamicDesktopUserForHeader is_authorized={false} />}
      slot_desktop_navigation={<DynamicDesktopNavigationForHeader />}
      slot_mobile_navigation={<div>mobile nav</div>}
    >
      <>{children}</>
    </UiLandingTemplate_Landing>
  )
}

export default LayoutGuest
