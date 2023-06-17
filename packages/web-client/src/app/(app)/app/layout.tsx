'use client'

import { BottomNavigationBar } from '@web-ui/components/app/molecules/BottomNavigationBar'
import { NavigationForAppHeader } from '@web-ui/components/app/molecules/NavigationForAppHeader'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/DesktopUserAreaForAppHeader'
import { App } from '@web-ui/components/app/templates/App'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/AppHeaderDesktop'
import { AppHeaderMobile } from '@web-ui/components/app/templates/AppHeaderMobile'
import { LogoForHeader } from '@web-ui/components/common/molecules/LogoForHeader'

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
