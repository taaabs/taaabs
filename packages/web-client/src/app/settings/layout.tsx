import { Header } from '@web-ui/components/settings/atoms/header'
import { Settings } from '@web-ui/components/settings/templates/settings'
import { DynamicDesktopNavigation } from './DynamicDesktopNavigation'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Settings
      headerSlot={<Header backHref="/" title="settings" />}
      desktopNavigationSlot={<DynamicDesktopNavigation />}
      mobileNavigationSlot={'nav'}
      mainSlot={children}
    />
  )
}

export default Layout
