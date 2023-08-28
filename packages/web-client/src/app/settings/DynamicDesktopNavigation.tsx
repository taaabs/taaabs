'use client'

import { DesktopMenuItem } from '@web-ui/components/settings/atoms/desktop-menu-item'
import { usePathname } from 'next/navigation'

export const DynamicDesktopNavigation: React.FC = () => {
  const pathname = usePathname()

  return (
    <>
      <DesktopMenuItem
        href="/settings/account"
        isActive={pathname == '/settings/account'}
        label="Account"
      />
      <DesktopMenuItem
        href="/settings/preferences"
        isActive={pathname == '/settings/preferences'}
        label="Preferences"
      />
      <DesktopMenuItem
        href="/settings/subscription"
        isActive={pathname == '/settings/subscription'}
        label="Subscription"
      />
      <DesktopMenuItem
        href="/settings/import-bookmarks"
        isActive={pathname == '/settings/import-bookmarks'}
        label="Import bookmarks"
      />
      <DesktopMenuItem
        href="/settings/backups"
        isActive={pathname == '/settings/backups'}
        label="Backups"
      />
    </>
  )
}
