import { Landing } from '@web-ui/components/landing/templates/Landing'
import { DynamicDesktopNavigationForHeader } from './DynamicDesktopNavigationForHeader'
import { LogoForHeader } from '@web-ui/components/common/molecules/LogoForHeader'
import { DynamicDesktopUserForHeader } from './DynamicDesktopUserForHeader'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Landing
      slotLogo={<LogoForHeader isLarge={true} href="/" />}
      slotDesktopUser={<DynamicDesktopUserForHeader />}
      slotDesktopNavigation={<DynamicDesktopNavigationForHeader />}
      slotMobileNavigation={<div>mobile nav</div>}
      slotFooter={
        <div>
          footer
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      }
    >
      {children}
    </Landing>
  )
}

export default Layout
