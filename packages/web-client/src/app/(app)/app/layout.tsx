'use client'
import { BottomNavigationBar } from '@web-ui/components/Molecules/BottomNavigationBar'
import { LogoForHeader } from '@web-ui/components/Molecules/LogoForHeader'
import { NavigationForAppHeader } from '@web-ui/components/Molecules/NavigationForAppHeader'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/Organisms/DesktopUserAreaForAppHeader'
import { App } from '@web-ui/components/Templates/App'
import { AppHeaderDesktop } from '@web-ui/components/Templates/AppHeaderDesktop'
import { AppHeaderMobile } from '@web-ui/components/Templates/AppHeaderMobile'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <App
      slotAppHeaderDesktop={
        <AppHeaderDesktop
          logoSlot={<LogoForHeader href="" />}
          navigationSlot={
            <NavigationForAppHeader
              navigation={[
                { label: 'Library', href: '/app/library', isActive: false },
                { label: 'Feed', href: '/app/Feed', isActive: false },
                { label: 'Discover', href: '/app/discover', isActive: false },
              ]}
            />
          }
          rightSideSlot={
            <DesktopUserAreaForAppHeader
              onClickAdd={() => {}}
              onClickSearch={() => {}}
              onClickNotifications={() => {}}
            />
          }
        />
      }
      slotAppHeaderMobile={
        <AppHeaderMobile
          logoSlot={<LogoForHeader href="" />}
          navigationSlot={
            <NavigationForAppHeader
              navigation={[
                { label: 'Library', href: '/app/library', isActive: false },
                { label: 'Feed', href: '/app/Feed', isActive: false },
              ]}
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
      slotFooterDesktop={<div>slotFooterDesktop</div>}
    >
      {children}
    </App>
  )
}

export default Layout
