'use client'

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { PublicUserAvatarContext } from '../../providers/public-user-avatar-provider'
import { useContext } from 'react'
import { ModalContext } from '../../providers/modal-provider'
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
import { GlobalLibarySearchContext } from '../global-library-search-provider'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { UpsertBookmark_UseCase } from '@repositories/modules/bookmarks/domain/usecases/upsert-bookmark.use-case'
import { search_params_keys } from '@/constants/search-params-keys'

export const ClientComponentAppHeaderDesktop: React.FC = () => {
  const search_params = useSearchParams()
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const public_user_avatar = useContext(PublicUserAvatarContext)
  const modal = useContext(ModalContext)
  const global_library_search = useContext(GlobalLibarySearchContext)
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
          clear_library_session_storage({
            search_params: search_params.toString(),
          })
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
            search_params: search_params.toString(),
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
        on_close={modal.set_modal}
        on_submit={async (bookmark) => {
          const { db, bookmarks_just_tags } =
            await global_library_search!.search_hook.init({
              is_archived: false,
            })

          const data_source = new Bookmarks_DataSourceImpl(ky_instance)
          const repository = new Bookmarks_RepositoryImpl(data_source)
          const upsert_bookmark_use_case = new UpsertBookmark_UseCase(
            repository,
          )
          const created_bookmark =
            await upsert_bookmark_use_case.invoke(bookmark)
          await global_library_search!.search_hook.update_bookmark({
            db,
            bookmarks_just_tags,
            is_archived: false,
            bookmark: {
              id: created_bookmark.id,
              created_at: created_bookmark.created_at,
              visited_at: created_bookmark.visited_at,
              updated_at: created_bookmark.updated_at,
              title: created_bookmark.title,
              note: created_bookmark.note,
              is_archived: false,
              is_unread: created_bookmark.is_unread,
              stars: created_bookmark.stars,
              links: created_bookmark.links.map((link) => ({
                url: link.url,
                site_path: link.site_path,
              })),
              tags: created_bookmark.tags.map((tag) => tag.name),
              tag_ids: created_bookmark.tags.map((tag) => tag.id),
            },
          })
          if (pathname == '/bookmarks') {
            const updated_search_params = update_search_params(
              search_params,
              search_params_keys.newly_created_bookmark_updated_at_timestamp,
              new Date(created_bookmark.updated_at).getTime().toString(),
            )
            window.history.pushState(
              {},
              '',
              window.location.pathname + '?' + updated_search_params,
            )
          } else {
            modal.set_modal()
          }
        }}
      />,
    )
  }

  useUpdateEffect(() => {
    if (window.location.hash.slice(1).length) {
      // open_new_bookmark_modal({ with_autofill: true })
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
      cockroach_url="https://bit.ly/cockroachdb-cloud"
      translations={{ powered_by: 'Powered by' }}
    />
  )
}
