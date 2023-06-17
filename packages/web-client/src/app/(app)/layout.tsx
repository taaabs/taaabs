'use client'
import { BottomNavigationBar } from '@web-ui/components/app/molecules/BottomNavigationBar'
import { NavigationForAppHeader } from '@web-ui/components/app/molecules/NavigationForAppHeader'
import { UserForAppHeader } from '@web-ui/components/app/molecules/UserForAppHeader'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/DesktopUserAreaForAppHeader'
import { App } from '@web-ui/components/app/templates/App'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/AppHeaderDesktop'
import { AppHeaderMobile } from '@web-ui/components/app/templates/AppHeaderMobile'
import { LogoForHeader } from '@web-ui/components/common/molecules/LogoForHeader'
import { useParams, usePathname } from 'next/navigation'

export const dynamic = 'force-static'

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const params = useParams()
  const pathname = usePathname()

  let logoSlot: JSX.Element
  if (params.username) {
    logoSlot = (
      <UserForAppHeader user={{ username: params.username, backHref: '/' }} />
    )
  } else {
    logoSlot = <LogoForHeader href="/app" />
  }

  return (
    <App
      slotAppHeaderDesktop={
        <AppHeaderDesktop
          logoSlot={logoSlot}
          navigationSlot={
            <NavigationForAppHeader
              navigation={[
                {
                  label: 'Profile',
                  href: `/${params.username}`,
                  isActive: false,
                },
                {
                  label: 'Library',
                  href: `/${params.username}/library`,
                  isActive: false,
                },
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
