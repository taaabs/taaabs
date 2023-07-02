'use client'

import {
  NavigationForHeader,
  NavigationForHeaderTypes,
} from '@web-ui/components/app/molecules/navigation-for-header'
import { UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/desktop-user-area-for-app-header'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { LogoForHeader } from '@web-ui/components/common/molecules/logo-for-header'
import { useParams, usePathname } from 'next/navigation'
import { OtherUserAvatarContext } from './other-user-avatar-provider'
import { useContext } from 'react'

export const DynamicAppHeaderDesktop: React.FC = () => {
  const params = useParams()
  const pathname = usePathname()
  const otherUserAvatar = useContext(OtherUserAvatarContext)

  let logoSlot: JSX.Element
  // TODO: backHref should be smarter :^)
  if (params.username) {
    logoSlot = (
      <UserForHeader
        user={{
          username: params.username,
          backHref: '/',
          avatar: otherUserAvatar?.avatar
            ? {
                url: otherUserAvatar.avatar.url,
                blurhash: otherUserAvatar.avatar.blurhash,
              }
            : undefined,
        }}
      />
    )
  } else {
    logoSlot = <LogoForHeader href="/" />
  }

  let navigation: NavigationForHeaderTypes.Props['navigation']
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
