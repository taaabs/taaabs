'use client'

import { useParams, usePathname } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { PublicUserAvatarContext } from './public-user-avatar-provider'
import { UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { AppHeaderMobile } from '@web-ui/components/app/templates/app-header-mobile'

export const ClientComponentAppHeaderMobile: React.FC = () => {
  const pathname = usePathname()
  const params = useParams()
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
        label: 'Bookmarks',
        href: `/${params.username}/bookmarks`,
        is_active: pathname == `/${params.username}/bookmarks`,
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
        label: 'Bookmarks',
        href: '/bookmarks',
        is_active: pathname == '/bookmarks',
      },
    ]
  }

  useEffect(() => {
    set_is_hydrated(true)
  }, [])

  return (
    <AppHeaderMobile
      slot_logo={logo_slot}
      slot_navigation={<NavigationForHeader navigation={navigation} />}
    />
  )
}
