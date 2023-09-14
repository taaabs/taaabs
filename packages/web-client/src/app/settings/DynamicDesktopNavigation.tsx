'use client'

import { DesktopMenuItem } from '@web-ui/components/settings/atoms/desktop-menu-item'
import { usePathname } from 'next/navigation'

export const DynamicDesktopNavigation: React.FC = () => {
  const pathname = usePathname()

  return (
    <>
      <DesktopMenuItem
        href="/settings/account"
        is_active={pathname == '/settings/account'}
        label="Account"
      />
      <DesktopMenuItem
        href="/settings/preferences"
        is_active={pathname == '/settings/preferences'}
        label="Preferences"
      />
      <DesktopMenuItem
        href="/settings/subscription"
        is_active={pathname == '/settings/subscription'}
        label="Subscription"
      />
      <DesktopMenuItem
        href="/settings/import-bookmarks"
        is_active={pathname == '/settings/import-bookmarks'}
        label="Import bookmarks"
      />
      <DesktopMenuItem
        href="/settings/backups"
        is_active={pathname == '/settings/backups'}
        label="Backups"
      />
    </>
  )
}
