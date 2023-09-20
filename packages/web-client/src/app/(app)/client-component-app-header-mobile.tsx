'use client'

import { NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { AppHeaderMobile } from '@web-ui/components/app/templates/app-header-mobile'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { useParams, usePathname } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { PublicUserAvatarContext } from './public-user-avatar-provider'

export const ClientComponentAppHeaderMobile: React.FC = () => {
  const pathname = usePathname()
  const params = useParams()
  const publicUserAvatar = useContext(PublicUserAvatarContext)
  const [isHydrated, setIsHydrated] = useState(false)

  let logoSlot: JSX.Element
  // TODO: backHref should be smarter :^)
  if (params.username) {
    logoSlot = (
      <UserForHeader
        user={{
          username: params.username as string,
          back_href: '/',
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
    ]
  }

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <AppHeaderMobile
      slot_logo={logoSlot}
      slot_navigation={<NavigationForHeader navigation={navigation} />}
    />
  )
}
