'use client'
import { BottomNavigationBar } from '@web-ui/components/app/molecules/BottomNavigationBar'
import { NavigationForHeader } from '@web-ui/components/app/molecules/NavigationForHeader'
import { UserForHeader } from '@web-ui/components/app/molecules/UserForHeader'
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
      <UserForHeader user={{ username: params.username, backHref: '/' }} />
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
            <NavigationForHeader
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
            <NavigationForHeader
              navigation={[
                {
                  label: 'Library',
                  href: '/app/library',
                  isActive: pathname == '/app/library' ? true : false,
                },
                {
                  label: 'Feed',
                  href: '/app/feed',
                  isActive: pathname == '/app/feed' ? true : false,
                },
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
