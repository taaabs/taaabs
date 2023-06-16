'use client'
import { useAppSelector } from '@/hooks/store'
import { HeaderDesktopNavigation } from '@web-ui/components/landing/molecules/HeaderDesktopNavigation'
import { HeaderDesktopUser } from '@web-ui/components/landing/molecules/HeaderDesktopUser'
import { HeaderDesktopNavigationAndUser } from '@web-ui/components/landing/templates/HeaderDesktopNavigationAndUser'
import { usePathname } from 'next/navigation'

export const DynamicDesktopNavigationForLanding: React.FC = () => {
  const { isLoading, userData } = useAppSelector((state) => state.userData)
  const pathname = usePathname()
  const isUserLoggedIn = false
  // access store and see if user is signed in

  return (
    <HeaderDesktopNavigationAndUser
      navigationSlot={
        <HeaderDesktopNavigation
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
      }
      userSlot={
        <HeaderDesktopUser
          buttonLabel={userData ? 'Open app' : 'Sign in'}
          buttonOnClick={() => {}}
          isLoading={isLoading}
        />
      }
    />
  )
}
