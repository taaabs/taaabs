import { Landing } from '@web-ui/components/landing/templates/landing'
import { DynamicDesktopNavigationForHeader } from './DynamicDesktopNavigationForHeader'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { DynamicDesktopUserForHeader } from './DynamicDesktopUserForHeader'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Landing
      slot_logo={<LogoForHeader is_large={true} href="/" />}
      slot_desktop_user={<DynamicDesktopUserForHeader />}
      slot_desktop_navigation={<DynamicDesktopNavigationForHeader />}
      slot_mobile_navigation={<div>mobile nav</div>}
    >
      <>{children}</>
    </Landing>
  )
}

export default Layout
