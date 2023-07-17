'use client'

import { NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/desktop-user-area-for-app-header'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { LogoForHeader } from '@web-ui/components/common/molecules/logo-for-header'
import { useParams, usePathname } from 'next/navigation'
import { PublicUserAvatarContext } from './public-user-avatar-provider'
import { useContext, useEffect, useState } from 'react'

export const ClientComponentAppHeaderDesktop: React.FC = () => {
  const params = useParams()
  const pathname = usePathname()
  const publicUserAvatar = useContext(PublicUserAvatarContext)
  const [isHydrated, setIsHydrated] = useState(false)

  let logoSlot: JSX.Element
  // TODO: backHref should be smarter :^)
  if (params.username) {
    logoSlot = (
      <UserForHeader
        user={{
          username: params.username,
          backHref: '/',
          avatar: publicUserAvatar?.avatar
            ? {
                url: publicUserAvatar.avatar.url,
                blurhash: publicUserAvatar.avatar.blurhash,
              }
            : undefined,
        }}
        isLoadingAvatar={!isHydrated}
      />
    )
  } else {
    logoSlot = <LogoForHeader href="/" />
  }

  let navigation: NavigationForHeader.Props['navigation']
  if (params.username) {
    navigation = [
      {
        label: 'Profile',
        href: `/${params.username}`,
        isActive: pathname == `/${params.username}`,
      },
      {
        label: 'Library',
        href: `/${params.username}/library`,
        isActive: pathname == `/${params.username}/library`,
      },
      {
        label: 'About',
        href: `/${params.username}/about`,
        isActive: pathname == `/${params.username}/about`,
      },
    ]
  } else {
    navigation = [
      {
        label: 'Inbox',
        href: '/inbox',
        isActive: pathname == '/inbox',
      },
      {
        label: 'Library',
        href: '/library',
        isActive: pathname == '/library',
      },
      {
        label: 'Discover',
        href: '/discover',
        isActive: pathname == '/discover',
      },
    ]
  }

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <AppHeaderDesktop
      logoSlot={logoSlot}
      navigationSlot={<NavigationForHeader navigation={navigation} />}
      rightSideSlot={
        <DesktopUserAreaForAppHeader
          onClickAdd={() => {}}
          onClickSearch={() => {}}
          onClickNotifications={() => {}}
        />
      }
    />
  )
}
