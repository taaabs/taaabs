'use client'

import { DesktopNavigationForHeader as UiLandingAtom_DesktopNavigationForHeader } from '@web-ui/components/landing/atoms/desktop-navigation-for-header'
import { usePathname } from 'next/navigation'

export const DynamicDesktopNavigationForHeader: React.FC = () => {
  const pathname = usePathname()

  return (
    <UiLandingAtom_DesktopNavigationForHeader
      navigation_items={[
        { label: 'Home', href: '/', is_active: pathname == '/' },
        {
          label: 'Updates',
          href: '/updates',
          is_active: pathname == '/updates',
        },
        {
          label: 'Help center',
          href: '/help',
          is_active: pathname == '/help',
        },
        {
          label: 'Pricing',
          href: '/pricing',
          is_active: pathname == '/pricing',
        },
      ]}
    />
  )
}
