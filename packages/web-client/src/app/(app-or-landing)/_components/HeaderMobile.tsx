'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { PublicUserAvatarContext } from '../../../providers/PublicUserAvatarProvider'
import { UsernameWithBackArrow as UiAppMolecule_UserForHeader } from '@web-ui/components/app/templates/App/HeaderDesktop/UsernameWithBackArrow'
import { LogoForHeader as UiCommonAtom_LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { HeaderMobile as Ui_app_templates_HeaderMobile } from '@web-ui/components/app/templates/App/HeaderMobile'

export const HeaderMobile: React.FC = () => {
  const params = useParams()
  const search_params = useSearchParams()
  const public_user_avatar = useContext(PublicUserAvatarContext)
  const [is_hydrated, set_is_hydrated] = useState(false)

  const back = search_params.get('back')

  let logo_slot: JSX.Element
  // TODO: backHref should be smarter :^)
  if (params.username) {
    logo_slot = (
      <UiAppMolecule_UserForHeader
        user={{
          username: params.username as string,
          back_href: back || '/',
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
    <Ui_app_templates_HeaderMobile
      slot_logo={logo_slot}
      slot_navigation={<>nav</>}
    />
  )
}
