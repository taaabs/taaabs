'use client'

import { NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/desktop-user-area-for-app-header'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
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
          username: params.username as string,
          backHref: '/',
          avatar: publicUserAvatar?.avatar
            ? {
                url: publicUserAvatar.avatar.url,
                blurhash: publicUserAvatar.avatar.blurhash,
              }
            : undefined,
        }}
        is_loading_avatar={!isHydrated}
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
        is_active: pathname == `/${params.username}`,
      },
      {
        label: 'Library',
        href: `/${params.username}/library`,
        is_active: pathname == `/${params.username}/library`,
      },
    ]
  } else {
    navigation = [
      {
        label: 'Inbox',
        href: '/inbox',
        is_active: pathname == '/inbox',
      },
      {
        label: 'Library',
        href: '/library',
        is_active: pathname == '/library',
      },
      {
        label: 'Discover',
        href: '/discover',
        is_active: pathname == '/discover',
      },
    ]
  }

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <AppHeaderDesktop
      slot_left_side_logo={logoSlot}
      slot_left_side_navigation={
        <NavigationForHeader navigation={navigation} />
      }
      slot_right_side={
        <DesktopUserAreaForAppHeader
          add_on_click={() => {}}
          search_on_click={() => {}}
          notificatios_on_click={() => {}}
        />
      }
    />
  )
}
