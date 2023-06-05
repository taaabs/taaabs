'use client'
import { LayoutDefault } from '@web-ui/components/Layouts/LayoutDefault'
import { BottomNavigationBar } from '@web-ui/components/Molecules/BottomNavigationBar'
import { LogoForHeader } from '@web-ui/components/Molecules/LogoForHeader'
import { NavigationForHeader } from '@web-ui/components/Molecules/NavigationForHeader/NavigationForHeader'
import { HeaderDesktop } from '@web-ui/components/Templates/HeaderDesktop'
import { HeaderMobile } from '@web-ui/components/Templates/HeaderMobile'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutDefault
      slotHeaderDesktop={
        <HeaderDesktop
          logoSlot={<LogoForHeader />}
          navigationSlot={
            <NavigationForHeader
              navigation={[{ label: 'Lorem', href: '/lorem', isActive: true }]}
            />
          }
        />
      }
      slotHeaderMobile={
        <HeaderMobile
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
