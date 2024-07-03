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
import { AuthorizedUser as UiAppTemplate_App_HeaderDesktop_AuthorizedUser } from '@web-ui/components/app/templates/app/header-desktop/authorized-user'
import { UserDropdown as UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown } from '@web-ui/components/app/templates/app/header-desktop/authorized-user/user-dropdown'
import { StandardItem as UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_StandardItem } from '@web-ui/components/app/templates/app/header-desktop/authorized-user/user-dropdown/standard-item'
import { Separator as UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_Separator } from '@web-ui/components/app/templates/app/header-desktop/authorized-user/user-dropdown/separator'
import { Bookmarklet as UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_Bookmarklet } from '@web-ui/components/app/templates/app/header-desktop/authorized-user/user-dropdown/bookmarklet'
import { FooterLinks as UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_FooterLinks } from '@web-ui/components/app/templates/app/header-desktop/authorized-user/user-dropdown/footer-links'
import { UpsertBookmark as Form_UpsertBookmark } from '@/modals/upsert-bookmark-modal/upsert-bookmark-modal'
import { update_search_params } from '@/utils/update-query-params'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { search_params_keys } from '@/constants/search-params-keys'
import { toast } from 'react-toastify'
import { browser_storage } from '@/constants/browser-storage'
import { AuthContext } from '../../auth-provider'
import { Dictionary } from '@/dictionaries/dictionary'
// import { LocalDbContext } from '@/app/local-db-provider'
import { BookmarkUrlHashData } from '@/utils/bookmark-url-hash-data'

export const HeaderDesktop: React.FC<{
  dictionary: Dictionary
  bookmarklet_script: string
}> = (props) => {
  const auth_context = useContext(AuthContext)!
  // const local_db_context = useContext(LocalDbContext)!
  const search_params = useSearchParams()
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const public_user_avatar = useContext(PublicUserAvatarContext)
  const modal_context = useContext(ModalContext)!
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
          if (pathname == '/library') return
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
          if (pathname == `/${params.username}`) return
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
    const bookmark = BookmarkUrlHashData.parse({
      hash: window.location.hash.slice(1),
    })

    modal_context.set_content(
      <Form_UpsertBookmark
        key={Date.now()}
        action="create"
        bookmark_autofill={
          params.with_autofill
            ? {
                title: bookmark.title,
                links: bookmark.links,
                tags: bookmark.tags,
                note: bookmark.description,
              }
            : undefined
        }
        on_close={() => {
          modal_context.close()
        }}
        on_submit={async (bookmark) => {
          const data_source = new Bookmarks_DataSourceImpl(
            auth_context.ky_instance,
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          const created_bookmark = await repository.upsert_bookmark(
            bookmark,
            auth_context.auth_data!.encryption_key,
          )
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
            modal_context.close()
          }
          toast.success(props.dictionary.app.library.bookmark_created)
        }}
        dictionary={props.dictionary}
      />,
    )
  }

  useUpdateEffect(() => {
    const bookmark = BookmarkUrlHashData.parse({
      hash: window.location.hash.slice(1),
    })
    if (Object.keys(bookmark).length) {
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
          <UiAppTemplate_App_HeaderDesktop_AuthorizedUser
            pathname={pathname}
            on_click_add={() => {
              open_new_bookmark_modal({})
            }}
            on_click_search={() => {}}
            name={auth_context.auth_data.username}
            slot_user_dropdown={
              <UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown>
                <UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_Bookmarklet
                  text={
                    props.dictionary.app.header_desktop.user_dropdown
                      .bookmarklet.text
                  }
                  subtext={
                    props.dictionary.app.header_desktop.user_dropdown
                      .bookmarklet.subtext
                  }
                  button_label={
                    props.dictionary.app.header_desktop.user_dropdown
                      .bookmarklet.button_label
                  }
                  bookmarklet_script={props.bookmarklet_script}
                />
                <UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_Separator />
                <UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_StandardItem
                  label={
                    props.dictionary.app.header_desktop.user_dropdown
                      .my_public_profile
                  }
                  icon_variant={'PUBLIC_PROFILE'}
                  on_click={() => {
                    router.push(
                      `/${
                        auth_context.auth_data!.username
                      }?back=${pathname}?${search_params.toString()}`,
                    )
                  }}
                />
                <UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_StandardItem
                  label={
                    props.dictionary.app.header_desktop.user_dropdown.settings
                  }
                  icon_variant={'SETTINGS'}
                  on_click={() => {
                    router.push(
                      `/settings?back=${pathname}?${search_params.toString()}`,
                    )
                  }}
                />
                <UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_StandardItem
                  label={
                    props.dictionary.app.header_desktop.user_dropdown.log_out
                  }
                  icon_variant={'LOG_OUT'}
                  on_click={auth_context.logout}
                />
                <UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_Separator />
                <UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown_FooterLinks
                  links={[
                    {
                      label:
                        props.dictionary.app.header_desktop.user_dropdown.about,
                      href: '/about',
                    },
                    {
                      label:
                        props.dictionary.app.header_desktop.user_dropdown
                          .terms_of_service,
                      href: '/terms-of-service',
                    },
                    {
                      label:
                        props.dictionary.app.header_desktop.user_dropdown
                          .privacy_policy,
                      href: '/privacy-policy',
                    },
                  ]}
                />
              </UiAppTemplate_App_HeaderDesktop_AuthorizedUser_UserDropdown>
              //     <UiAppOrganism_App_HeaderDesktop_AuthorizedUser_UserDropdown
              //       profile_url={`/${
              //         auth_context.auth_data.username
              //       }?back=${pathname}?${search_params.toString()}`}
              //       username={auth_context.auth_data.username}
              //       settings_href={`/settings?back=${pathname}?${search_params.toString()}`}
              //       on_click_log_out={auth_context.logout}
              //       footer_links={[
              //         {
              //           label:
              //             props.dictionary.app.header_desktop.user_dropdown.about,
              //           href: '/about',
              //         },
              //         {
              //           label:
              //             props.dictionary.app.header_desktop.user_dropdown
              //               .terms_of_service,
              //           href: '/terms-of-service',
              //         },
              //         {
              //           label:
              //             props.dictionary.app.header_desktop.user_dropdown
              //               .privacy_policy,
              //           href: '/privacy-policy',
              //         },
              //       ]}
              //       translations={{
              //         save_to_taaabs:
              //           props.dictionary.app.header_desktop.user_dropdown
              //             .save_to_taaabs,
              //         theme:
              //           props.dictionary.app.header_desktop.user_dropdown.theme,
              //         settings:
              //           props.dictionary.app.header_desktop.user_dropdown.settings,
              //         log_out:
              //           props.dictionary.app.header_desktop.user_dropdown.log_out,
              //       }}
              //     />
              //   }
              // />
            }
          />
        ) : (
          <div>x</div>
        ))
      }
      translations={{ powered_by: props.dictionary.app.powered_by }}
    />
  )
}
