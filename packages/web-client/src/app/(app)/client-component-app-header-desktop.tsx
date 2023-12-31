'use client'

import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { PublicUserAvatarContext } from './public-user-avatar-provider'
import { useContext } from 'react'
import { ModalContext } from './modal-provider'
import { use_is_hydrated } from '@shared/hooks'
import { UserForHeader as UiAppMolecule_UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { LogoForHeader as UiCommonAtom_LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { NavigationForHeader as UiAppMolecule_NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { AppHeaderDesktop as UiAppTemplate_AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { DesktopUserAreaForAppHeader as UiAppOrganism_DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/desktop-user-area-for-app-header'
import { UpsertBookmark as Form_UpsertBookmarkForm } from '@/forms/upsert-bookmark'
import { update_query_params } from '@/utils/update-query-params'

export const ClientComponentAppHeaderDesktop: React.FC = () => {
  const query_params = useSearchParams()
  const params = useParams()
  const pathname = usePathname()
  const public_user_avatar = useContext(PublicUserAvatarContext)
  const modal = useContext(ModalContext)
  const is_hydrated = use_is_hydrated()

  let logo: JSX.Element
  // TODO: backHref should be smarter :^)
  if (params.username) {
    logo = (
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
    logo = <UiCommonAtom_LogoForHeader href="/" />
  }

  let navigation: UiAppMolecule_NavigationForHeader.Props['navigation']
  if (params.username) {
    navigation = [
      {
        label: 'Bookmarks',
        href: `/${params.username}`,
        is_active: pathname == `/${params.username}`,
      },
      {
        label: 'Activity',
        href: `/${params.username}/activity`,
        is_active: pathname == `/${params.username}/activity`,
      },
    ]
  } else {
    navigation = [
      {
        label: 'Home',
        href: '/home',
        is_active: pathname == '/home',
      },
      {
        label: 'Bookmarks',
        href: '/bookmarks',
        is_active: pathname == '/bookmarks',
      },
      {
        label: 'Notifications',
        href: '/notifications',
        is_active: pathname == '/notifications',
      },
    ]
  }

  return (
    <UiAppTemplate_AppHeaderDesktop
      slot_left_side_logo={logo}
      slot_left_side_navigation={
        <UiAppMolecule_NavigationForHeader navigation={navigation} />
      }
      slot_right_side={
        <UiAppOrganism_DesktopUserAreaForAppHeader
          on_click_add={() => {
            modal?.set_modal(
              <Form_UpsertBookmarkForm
                action="create"
                bookmark={undefined}
                auth_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg"
                on_close={modal?.set_modal}
                on_submit={(bookmark) => {
                  modal?.set_modal()
                  if (pathname == '/bookmarks') {
                    const updated_query_params = update_query_params(
                      query_params,
                      'r', // Bookmarks (r)efetch trigger.
                      bookmark.id.toString(),
                    )
                    window.history.pushState(
                      {},
                      '',
                      window.location.pathname + '?' + updated_query_params,
                    )
                  }
                }}
              />,
            )
          }}
          on_click_search={() => {}}
        />
      }
    />
  )
}
