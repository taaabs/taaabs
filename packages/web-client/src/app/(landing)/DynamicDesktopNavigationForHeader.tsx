'use client'
import { DesktopNavigationForHeader } from '@web-ui/components/landing/molecules/DesktopNavigationForHeader'
import { usePathname } from 'next/navigation'

export const DynamicDesktopNavigationForHeader: React.FC = () => {
  const pathname = usePathname()

  return (
    <DesktopNavigationForHeader
      navigationItems={[
        { label: 'Blog', href: '/blog', isActive: pathname == '/blog' },
        {
          label: 'Pricing',
          href: '/pricing',
          isActive: pathname == '/pricing',
        },
        { label: 'Help', href: '/help', isActive: pathname == '/help' },
      ]}
    />
  )
}
