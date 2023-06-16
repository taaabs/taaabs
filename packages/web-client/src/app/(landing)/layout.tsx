import { Landing } from '@web-ui/components/landing/templates/Landing'
import { DynamicDesktopNavigationForLanding } from './DynamicDesktopNavigationForLanding'
import { LogoForHeader } from '@web-ui/components/common/molecules/LogoForHeader'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Landing
      slotLogo={<LogoForHeader isLarge={true} href="/" />}
      slotDesktopNavigation={<DynamicDesktopNavigationForLanding />}
      slotMobileNavigation={<div>mobile nav</div>}
      slotFooter={<div>footer</div>}
    >
      {children}
    </Landing>
  )
}

export default Layout
