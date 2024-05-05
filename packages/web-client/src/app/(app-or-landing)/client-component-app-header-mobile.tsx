'use client'

import {
  useParams,
  // usePathname
} from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { PublicUserAvatarContext } from '../../providers/public-user-avatar-provider'
import { UserForHeader as UiAppMolecule_UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { LogoForHeader as UiCommonAtom_LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { NavigationForHeader as UiAppMolecule_NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { AppHeaderMobile as UiAppTemplate_AppHeaderMobile } from '@web-ui/components/app/templates/app-header-mobile'

export const ClientComponentAppHeaderMobile: React.FC = () => {
  // const pathname = usePathname()
  const params = useParams()
  const public_user_avatar = useContext(PublicUserAvatarContext)
  const [is_hydrated, set_is_hydrated] = useState(false)

  let logo_slot: JSX.Element
  // TODO: backHref should be smarter :^)
  if (params.username) {
    logo_slot = (
      <UiAppMolecule_UserForHeader
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
    logo_slot = <UiCommonAtom_LogoForHeader href="/" />
  }

  useEffect(() => {
    set_is_hydrated(true)
  }, [])

  return (
    <UiAppTemplate_AppHeaderMobile
      slot_logo={logo_slot}
      slot_navigation={<UiAppMolecule_NavigationForHeader navigation={[]} />}
    />
  )
}
