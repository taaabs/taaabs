'use client'

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
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
import { update_search_params } from '@/utils/update-query-params'
import { BookmarkHash } from '@/utils/bookmark-hash'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import ky from 'ky'

export const ClientComponentAppHeaderDesktop: React.FC = () => {
  const search_params = useSearchParams()
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const public_user_avatar = useContext(PublicUserAvatarContext)
  const modal = useContext(ModalContext)
  const is_hydrated = use_is_hydrated()

  const ky_instance = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY`,
      'Content-Type': 'application/json',
    },
  })

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
  if (!params.username) {
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
        on_click: () => {
          clear_library_session_storage({})
          router.push('/bookmarks')
        },
      },
      {
        label: 'Notifications',
        href: '/notifications',
        is_active: pathname == '/notifications',
      },
    ]
  } else {
    navigation = [
      {
        label: 'Bookmarks',
        href: `/${params.username}`,
        is_active: pathname == `/${params.username}`,
        on_click: () => {
          clear_library_session_storage({
            username: params.username as string,
          })
          router.push(`/${params.username}`)
        },
      },
      {
        label: 'Overview',
        href: `/${params.username}/overview`,
        is_active: pathname == `/${params.username}/overview`,
      },
    ]
  }

  const open_new_bookmark_modal = (params: { with_autofill?: boolean }) => {
    const bookmark = BookmarkHash.from({ hash: window.location.hash.slice(1) })

    modal?.set_modal(
      <Form_UpsertBookmarkForm
        action="create"
        bookmark_autofill={
          params.with_autofill
            ? {
                title: bookmark.title,
                links: bookmark.links,
                tags: bookmark.tags,
                note: bookmark.note,
              }
            : undefined
        }
        ky={ky_instance}
        on_close={modal?.set_modal}
        on_submit={(bookmark) => {
          modal?.set_modal()
          if (pathname == '/bookmarks') {
            const updated_search_params = update_search_params(
              search_params,
              'r', // Bookmarks (r)efetch trigger.
              bookmark.id.toString(),
            )
            window.history.pushState(
              {},
              '',
              window.location.pathname + '?' + updated_search_params,
            )
          }
        }}
      />,
    )
  }

  useUpdateEffect(() => {
    if (window.location.hash.slice(1).length) {
      open_new_bookmark_modal({ with_autofill: true })
    }
  }, [is_hydrated])

  return (
    <UiAppTemplate_AppHeaderDesktop
      slot_logo={logo}
      slot_navigation={
        <UiAppMolecule_NavigationForHeader navigation={navigation} />
      }
      slot_right_side={
        <UiAppOrganism_DesktopUserAreaForAppHeader
          on_click_add={() => {
            open_new_bookmark_modal({})
          }}
          on_click_search={() => {}}
        />
      }
    />
  )
}
