import { Settings } from '@web-ui/components/app/templates/settings'
import { DynamicDesktopNavigation } from './DynamicDesktopNavigation'
import { SimpleBackArrowHeader as UiAppAtom_SimpleBackArrowHeader } from '@web-ui/components/app/atoms/simple-back-arrow-header'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Settings
      slot_header={
        <UiAppAtom_SimpleBackArrowHeader
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
