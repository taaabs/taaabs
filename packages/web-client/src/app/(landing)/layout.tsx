import { Landing } from '@web-ui/components/landing/templates/landing'
import { DynamicDesktopNavigationForHeader } from './DynamicDesktopNavigationForHeader'
import { LogoForHeader } from '@web-ui/components/common/molecules/logo-for-header'
import { DynamicDesktopUserForHeader } from './DynamicDesktopUserForHeader'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Landing
      slotLogo={<LogoForHeader isLarge={true} href="/" />}
      slotDesktopUser={<DynamicDesktopUserForHeader />}
      slotDesktopNavigation={<DynamicDesktopNavigationForHeader />}
      slotMobileNavigation={<div>mobile nav</div>}
    >
      <>{children}</>
    </Landing>
  )
}

export default Layout
