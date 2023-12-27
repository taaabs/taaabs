'use client'

import { Ui } from '@web-ui'
import { useParams, usePathname } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { PublicUserAvatarContext } from './public-user-avatar-provider'

export const ClientComponentAppHeaderMobile: React.FC = () => {
  const pathname = usePathname()
  const params = useParams()
  const public_user_avatar = useContext(PublicUserAvatarContext)
  const [is_hydrated, set_is_hydrated] = useState(false)

  let logo_slot: JSX.Element
  // TODO: backHref should be smarter :^)
  if (params.username) {
    logo_slot = (
      <Ui.App.Molecules.UserForHeader
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
    logo_slot = <Ui.Common.Atoms.LogoForHeader href="/" />
  }

  let navigation: Ui.App.Molecules.NavigationForHeader.Props['navigation']
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
    <Ui.App.Templates.AppHeaderMobile
      slot_logo={logo_slot}
      slot_navigation={
        <Ui.App.Molecules.NavigationForHeader navigation={navigation} />
      }
    />
  )
}
