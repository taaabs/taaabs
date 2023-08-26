import { DesktopMenuItem } from '@web-ui/components/settings/atoms/desktop-menu-item'
import { Header } from '@web-ui/components/settings/atoms/header'
import { Settings } from '@web-ui/components/settings/templates/settings/settings'

export default {
  title: 'page-previews/settings',
}

export const Primary = () => {
  return (
    <Settings
      headerSlot={<Header title="settings" backHref="" />}
      desktopNavigationSlot={
        <>
          <DesktopMenuItem href="" isActive={true} label="Account" />
          <DesktopMenuItem href="" isActive={false} label="Billing & plans" />
          <DesktopMenuItem href="" isActive={false} label="Import bookmarks" />
        </>
      }
      mobileNavigationSlot={'nav'}
      mainSlot={'main'}
    />
  )
}
