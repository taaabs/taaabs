import { Header } from '@web-ui/components/settings/atoms/header'
import { Settings } from '@web-ui/components/settings/templates/settings'
import { DynamicDesktopNavigation } from './DynamicDesktopNavigation'
import { Metadata } from 'next'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Settings
      slot_header={<Header back_href="/" title="Settings" />}
      slot_desktop_navigation={<DynamicDesktopNavigation />}
      slot_mobile_navigation={'nav'}
      slot_main={children}
    />
  )
}

export default Layout

export const metadata: Metadata = {
  title: {
    default: `Settings`,
    template: `%s - Settings | Taaabs`,
  },
}
