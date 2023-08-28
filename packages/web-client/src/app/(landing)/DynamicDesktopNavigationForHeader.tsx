'use client'

import { DesktopNavigationForHeader } from '@web-ui/components/landing/atoms/desktop-navigation-for-header'
import { usePathname } from 'next/navigation'

export const DynamicDesktopNavigationForHeader: React.FC = () => {
  const pathname = usePathname()

  return (
    <DesktopNavigationForHeader
      navigationItems={[
        { label: 'Home', href: '/', isActive: pathname == '/' },
        { label: 'Docs', href: '/docs', isActive: pathname == '/docs' },
        { label: 'Blog', href: '/blog', isActive: pathname == '/blog' },
        {
          label: 'Pricing',
          href: '/pricing',
          isActive: pathname == '/pricing',
        },
      ]}
    />
  )
}
