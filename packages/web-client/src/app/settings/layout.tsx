import { SimpleBackArrowHeader } from '@web-ui/components/app/atoms/simple-back-arrow-header'
import { Settings } from '@web-ui/components/app/templates/settings'
import { DynamicDesktopNavigation } from './DynamicDesktopNavigation'
import { Metadata } from 'next'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Settings
      slot_header={
        <SimpleBackArrowHeader
          back_href="/"
          title="Settings"
          is_transparent_on_desktop={true}
        />
      }
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
