'use client'

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { PublicUserAvatarContext } from '../../../providers/public-user-avatar-provider'
import { useContext } from 'react'
import { ModalContext } from '../../../providers/modal-provider'
import { use_is_hydrated } from '@shared/hooks'
import { UserForHeader as UiAppMolecule_UserForHeader } from '@web-ui/components/app/molecules/user-for-header'
import { LogoForHeader as UiCommonAtom_LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
import { NavigationForHeader as UiAppMolecule_NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { HeaderDesktop as UiAppTemplate_App_HeaderDesktop } from '@web-ui/components/app/templates/app/header-desktop'
import { AuthorizedUser as UiAppOrganism_App_HeaderDesktop_AuthorizedUser } from '@web-ui/components/app/templates/app/header-desktop/authorized-user'
import { UserDropdown as UiAppOrganism_App_HeaderDesktop_AuthorizedUser_UserDropdown } from '@web-ui/components/app/templates/app/header-desktop/authorized-user/user-dropdown'
import { UpsertBookmark as Form_UpsertBookmarkForm } from '@/forms/upsert-bookmark'
import { update_search_params } from '@/utils/update-query-params'
import { BookmarkHash } from '@/utils/bookmark-hash'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { search_params_keys } from '@/constants/search-params-keys'
import { toast } from 'react-toastify'
import { browser_storage } from '@/constants/browser-storage'
import { AuthContext } from '../../auth-provider'
import { Dictionary } from '@/dictionaries/dictionary'

export const HeaderDesktop: React.FC<{
  dictionary: Dictionary
}> = (props) => {
  const auth_context = useContext(AuthContext)!
  const search_params = useSearchParams()
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
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
          back_href: search_params.get('back') || '/',
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
        label: props.dictionary.app.menu_items.home,
        href: '/',
        is_active: pathname == '/',
      },
      {
        label: props.dictionary.app.menu_items.library,
        href: '/library',
        is_active: pathname == '/library',
        on_click: () => {
          clear_library_session_storage({
            search_params: search_params.toString(),
          })
          router.push('/library')
        },
      },
      {
        label: props.dictionary.app.menu_items.notifications,
        href: '/notifications',
        is_active: pathname == '/notifications',
      },
    ]
  } else {
    const back = search_params.get('back')
    navigation = [
      {
        label: props.dictionary.app.menu_items.library,
        href: `/${params.username}`,
        is_active: pathname == `/${params.username}`,
        on_click: () => {
          clear_library_session_storage({
            username: params.username as string,
            search_params: search_params.toString(),
          })
          router.push(`/${params.username}${back ? `?back=${back}` : ''}`)
        },
      },
      {
        label: props.dictionary.app.menu_items.activity,
        href: `/${params.username}/activity${back ? `?back=${back}` : ''}`,
        is_active: pathname == `/${params.username}/activity`,
      },
    ]
  }

  const open_new_bookmark_modal = (params: { with_autofill?: boolean }) => {
    const bookmark = BookmarkHash.parse({ hash: window.location.hash.slice(1) })

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
          // const { db, bookmarks_just_tags } =
          //   await global_library_search!.search_hook.init({
          //     is_archived: false,
          //   })

          const data_source = new Bookmarks_DataSourceImpl(
            auth_context.ky_instance,
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          const created_bookmark = await repository.upsert_bookmark(
            bookmark,
            auth_context.auth_data!.encryption_key,
          )
          // await global_library_search!.search_hook.update_bookmark({
          //   db,
          //   bookmarks_just_tags,
          //   is_archived: false,
          //   bookmark: {
          //     id: created_bookmark.id,
          //     created_at: created_bookmark.created_at,
          //     visited_at: created_bookmark.visited_at,
          //     updated_at: created_bookmark.updated_at,
          //     title: created_bookmark.title,
          //     note: created_bookmark.note,
          //     is_archived: false,
          //     is_unread: created_bookmark.is_unread,
          //     stars: created_bookmark.stars,
          //     links: created_bookmark.links.map((link) => ({
          //       url: link.url,
          //       site_path: link.site_path,
          //     })),
          //     tags: created_bookmark.tags.map((tag) => tag.name),
          //     tag_ids: created_bookmark.tags.map((tag) => tag.id),
          //   },
          // })
          if (pathname == '/library') {
            sessionStorage.setItem(
              browser_storage.session_storage.library
                .counts_reload_requested_by_new_bookmark,
              'true',
            )
            const updated_search_params = update_search_params(
              search_params,
              search_params_keys.new_bookmark_results_refetch_trigger,
              created_bookmark.id.toString(),
            )
            window.history.pushState(
              {},
              '',
              window.location.pathname + '?' + updated_search_params,
            )
          } else {
            modal.set_modal()
          }
          toast.success('Bookmark has been created')
        }}
        dictionary={props.dictionary}
      />,
    )
  }

  useUpdateEffect(() => {
    if (window.location.hash.slice(1).length && pathname == '/') {
      open_new_bookmark_modal({ with_autofill: true })
    }
  }, [is_hydrated])

  return (
    <UiAppTemplate_App_HeaderDesktop
      slot_logo={logo}
      slot_navigation={
        <UiAppMolecule_NavigationForHeader navigation={navigation} />
      }
      slot_right_side={
        is_hydrated &&
        (auth_context.auth_data ? (
          <UiAppOrganism_App_HeaderDesktop_AuthorizedUser
            on_click_add={() => {
              open_new_bookmark_modal({})
            }}
            on_click_search={() => {}}
            name={auth_context.auth_data.username}
            slot_user_dropdown={
              <UiAppOrganism_App_HeaderDesktop_AuthorizedUser_UserDropdown
                profile_url_={`/${
                  auth_context.auth_data.username
                }?back=${pathname}?${search_params.toString()}`}
                username_={auth_context.auth_data.username}
                settings_href_={`/settings?back=${pathname}?${search_params.toString()}`}
                on_click_log_out_={auth_context.logout}
                footer_links_={[
                  {
                    label_:
                      props.dictionary.app.header_desktop.user_dropdown.about,
                    href_: '/about',
                  },
                  {
                    label_:
                      props.dictionary.app.header_desktop.user_dropdown
                        .terms_of_service,
                    href_: '/terms-of-service',
                  },
                  {
                    label_:
                      props.dictionary.app.header_desktop.user_dropdown
                        .privacy_policy,
                    href_: '/privacy-policy',
                  },
                ]}
                translations_={{
                  bookmarklet_:
                    props.dictionary.app.header_desktop.user_dropdown
                      .bookmark_this_tab,
                  theme_:
                    props.dictionary.app.header_desktop.user_dropdown.theme,
                  settings_:
                    props.dictionary.app.header_desktop.user_dropdown.settings,
                  log_out_:
                    props.dictionary.app.header_desktop.user_dropdown.log_out,
                }}
              />
            }
          />
        ) : (
          <div>x</div>
        ))
      }
      cockroach_url="https://bit.ly/cockroachdb-cloud"
      translations={{ powered_by: props.dictionary.app.powered_by }}
    />
  )
}
