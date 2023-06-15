import { DesktopNavigationForLanding } from '@web-ui/components/Atoms/DesktopNavigationForLanding/DesktopNavigationForLanding'
import { LogoForHeader } from '@web-ui/components/Molecules/LogoForHeader'
import { Landing } from '@web-ui/components/Templates/Landing'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Landing
      slotLogo={<LogoForHeader isLarge={true} href="/" />}
      slotDesktopNavigation={
        <DesktopNavigationForLanding
          navigationItems={[
            { label: 'Blog', href: '/blog', isActive: false },
            { label: 'Pricing', href: '/pricing', isActive: false },
            { label: 'Help', href: '/help', isActive: false },
          ]}
        />
      }
      slotFooter={<div>footer</div>}
      slotMobileNavigation={<div>mobile nav</div>}
    >
      {children}
    </Landing>
  )
}

export default Layout
