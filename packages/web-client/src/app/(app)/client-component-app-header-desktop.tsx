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
  const public_user_avatar = useContext(PublicUserAvatarContext)
  const [is_hydrated, set_is_hydrated] = useState(false)

  let logo_slot: JSX.Element
  // TODO: backHref should be smarter :^)
  if (params.username) {
    logo_slot = (
      <UserForHeader
        user={{
          username: params.username as string,
          back_href: '/',
          avatar: public_user_avatar?.avatar
            ? {
                url: public_user_avatar.avatar.url,
                blurhash: public_user_avatar.avatar.blurhash,
              }
            : undefined,
        }}
        is_loading_avatar={!is_hydrated}
      />
    )
  } else {
    logo_slot = <LogoForHeader href="/" />
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
    set_is_hydrated(true)
  }, [])

  return (
    <AppHeaderDesktop
      slot_left_side_logo={logo_slot}
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
