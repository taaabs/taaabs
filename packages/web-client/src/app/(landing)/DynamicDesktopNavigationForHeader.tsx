'use client'

import { DesktopNavigationForHeader } from '@web-ui/components/landing/atoms/desktop-navigation-for-header'
import { usePathname } from 'next/navigation'

export const DynamicDesktopNavigationForHeader: React.FC = () => {
  const pathname = usePathname()

  return (
    <DesktopNavigationForHeader
      navigation_items={[
        { label: 'Home', href: '/', is_active: pathname == '/' },
        { label: 'Docs', href: '/docs', is_active: pathname == '/docs' },
        { label: 'Blog', href: '/blog', is_active: pathname == '/blog' },
        {
          label: 'Pricing',
          href: '/pricing',
          is_active: pathname == '/pricing',
        },
      ]}
    />
  )
}
