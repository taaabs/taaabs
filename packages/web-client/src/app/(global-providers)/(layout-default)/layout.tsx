'use client'
import { LayoutDefault } from '@web-ui/components/Layouts/LayoutDefault'
import { BottomNavigationBar } from '@web-ui/components/Molecules/BottomNavigationBar'
import { HeaderDesktop } from '@web-ui/components/Organisms/HeaderDesktop'
import { HeaderMobile } from '@web-ui/components/Organisms/HeaderMobile'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutDefault
      slotHeaderDesktop={
        <HeaderDesktop
          currentTheme="LIGHT"
          navigation={[
            { label: 'Test', href: '', isActive: false },
            { label: 'Test2', href: '', isActive: true },
          ]}
          onClickAdd={() => {}}
          onClickSearch={() => {}}
          onClickSignIn={() => {}}
          onClickTheme={() => {}}
        />
      }
      slotHeaderMobile={
        <HeaderMobile
          navigation={[{ label: 'Test', href: '', isActive: false }]}
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
