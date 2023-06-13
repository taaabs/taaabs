'use client'
import { LayoutDefault } from '@web-ui/components/Layouts/LayoutDefault'
import { BottomNavigationBar } from '@web-ui/components/Molecules/BottomNavigationBar'
import { LogoForHeader } from '@web-ui/components/Molecules/LogoForHeader'
import { NavigationForHeader } from '@web-ui/components/Molecules/NavigationForHeader/NavigationForHeader'
import { UserForHeader } from '@web-ui/components/Molecules/UserForHeader'
import { AppHeaderDesktop } from '@web-ui/components/Templates/AppHeaderDesktop'
import { AppHeaderMobile } from '@web-ui/components/Templates/AppHeaderMobile'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutDefault
      slotAppHeaderDesktop={
        <AppHeaderDesktop
          logoSlot={
            <UserForHeader user={{ username: 'lorem_ipsum', backHref: '/' }} />
          }
          navigationSlot={
            <NavigationForHeader
              navigation={[{ label: 'Lorem', href: '/lorem', isActive: true }]}
            />
          }
        />
      }
      slotAppHeaderMobile={
        <AppHeaderMobile
          logoSlot={<LogoForHeader />}
          navigationSlot={
            <NavigationForHeader
              navigation={[{ label: 'Lorem', href: '/lorem', isActive: true }]}
            />
          }
        />
      }
      slotBottomNavigationBar={
        <BottomNavigationBar
          onClickAdd={() => {}}
          onClickMyLibrary={() => {}}
          onClickNotifications={() => {}}
          onClickSearch={() => {}}
          onClickUser={() => {}}
        />
      }
      slotFooterDesktop={<div style={{ height: 1000 }}>footer</div>}
    >
      {children}
    </LayoutDefault>
  )
}
