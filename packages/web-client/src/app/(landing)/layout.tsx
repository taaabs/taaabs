import { Ui } from '@web-ui'
import { DynamicDesktopNavigationForHeader } from './DynamicDesktopNavigationForHeader'
import { DynamicDesktopUserForHeader } from './DynamicDesktopUserForHeader'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Ui.Landing.Templates.Landing
      slot_logo={<Ui.Common.Atoms.LogoForHeader is_large={true} href="/" />}
      slot_desktop_user={<DynamicDesktopUserForHeader />}
      slot_desktop_navigation={<DynamicDesktopNavigationForHeader />}
      slot_mobile_navigation={<div>mobile nav</div>}
    >
      <>{children}</>
    </Ui.Landing.Templates.Landing>
  )
}

export default Layout
