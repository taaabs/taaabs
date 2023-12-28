'use client'

import { DesktopMenuItem as UiAppAtom_DesktopMenuItem } from '@web-ui/components/app/atoms/desktop-menu-item'
import { usePathname } from 'next/navigation'

export const DynamicDesktopNavigation: React.FC = () => {
  const pathname = usePathname()

  return (
    <>
      <UiAppAtom_DesktopMenuItem
        href="/settings/account"
        is_active={pathname == '/settings/account'}
        label="Account"
      />
      <UiAppAtom_DesktopMenuItem
        href="/settings/preferences"
        is_active={pathname == '/settings/preferences'}
        label="Preferences"
      />
      <UiAppAtom_DesktopMenuItem
        href="/settings/subscription"
        is_active={pathname == '/settings/subscription'}
        label="Subscription"
      />
      <UiAppAtom_DesktopMenuItem
        href="/settings/import-bookmarks"
        is_active={pathname == '/settings/import-bookmarks'}
        label="Import bookmarks"
      />
      <UiAppAtom_DesktopMenuItem
        href="/settings/backups"
        is_active={pathname == '/settings/backups'}
        label="Backups"
      />
    </>
  )
}
