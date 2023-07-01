'use client'
import { BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'
import { NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/desktop-user-area-for-app-header'
import { App } from '@web-ui/components/app/templates/app'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { AppHeaderMobile } from '@web-ui/components/app/templates/app-header-mobile'
import { LogoForHeader } from '@web-ui/components/common/molecules/logo-for-header'
import { useElementVisibleHeight } from '@web-ui/hooks/use-element-visible-height'
import { useParams, usePathname } from 'next/navigation'
import { createContext, useRef } from 'react'

export const FooterVisibleHeightContext = createContext(0)

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const footer = useRef<HTMLDivElement>(null)
  const footerVisibleHeight = useElementVisibleHeight(footer)
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
      slotFooterDesktop={<div ref={footer}>slotFooterDesktop</div>}
    >
      <FooterVisibleHeightContext.Provider value={footerVisibleHeight}>
        {children}
      </FooterVisibleHeightContext.Provider>
    </App>
  )
}

export default Layout
