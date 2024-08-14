'use client'

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { PublicUserAvatarContext } from '../../../../providers/PublicUserAvatarProvider'
import { useContext } from 'react'
import { ModalContext } from '../../../../providers/ModalProvider'
import { use_is_hydrated } from '@shared/hooks'
import { UsernameWithBackArrow as Ui_app_templates_App_HeaderDesktop_UsernameWithBackArrow } from '@web-ui/components/app/templates/App/HeaderDesktop/UsernameWithBackArrow'
import { LogoForHeader as UiLogoForHeader } from '@web-ui/components/LogoForHeader'
import { HeaderDesktop as Ui_app_templates_App_HeaderDesktop } from '@web-ui/components/app/templates/App/HeaderDesktop'
import { UserArea as Ui_app_templates_App_HeaderDesktop_UserArea } from '@web-ui/components/app/templates/App/HeaderDesktop/UserArea'
import { UserDropdown as Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown } from '@web-ui/components/app/templates/App/HeaderDesktop/UserArea/UserDropdown'
import { StandardItem as Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_StandardItem } from '@web-ui/components/app/templates/App/HeaderDesktop/UserArea/UserDropdown/StandardItem'
import { Separator as Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_Separator } from '@web-ui/components/app/templates/App/HeaderDesktop/UserArea/UserDropdown/Separator'
import { IntegrationItem as Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_IntegrationItem } from '@web-ui/components/app/templates/App/HeaderDesktop/UserArea/UserDropdown/IntegrationItem'
import { ExtensionButton as Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_IntegrationItem_ExtensionButton } from '@web-ui/components/app/templates/App/HeaderDesktop/UserArea/UserDropdown/IntegrationItem/ExtensionButton'
import { BookmarkletButton as Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_IntegrationItem_BookmarkletButton } from '@web-ui/components/app/templates/App/HeaderDesktop/UserArea/UserDropdown/IntegrationItem/BookmarkletButton'
import { FooterLinks as Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_FooterLinks } from '@web-ui/components/app/templates/App/HeaderDesktop/UserArea/UserDropdown/FooterLinks'
import { UpsertBookmarkModal } from '@/modals/upsert-bookmark-modal/UpsertBookmarkModal'
import { update_search_params } from '@/utils/update-query-params'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { search_params_keys } from '@/constants/search-params-keys'
import { toast } from 'react-toastify'
import { browser_storage } from '@/constants/browser-storage'
import { AuthContext } from '../../../../providers/AuthProvider'
import { Dictionary } from '@/dictionaries/dictionary'
import { BookmarkUrlHashData } from '@/utils/bookmark-url-hash-data'
import { Navigation as Ui_app_templates_App_HeaderDesktop_Navigation } from '@web-ui/components/app/templates/App/HeaderDesktop/Navigation'

export const HeaderDesktop: React.FC<{
  dictionary: Dictionary
  bookmarklet_script: string
}> = (props) => {
  const auth_context = useContext(AuthContext)
  const search_params = useSearchParams()
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const public_user_avatar = useContext(PublicUserAvatarContext)
  const modal_context = useContext(ModalContext)
  const is_hydrated = use_is_hydrated()

  const back = search_params.get('back')

  const get_logo = () => {
    if (params.username) {
      return (
        <Ui_app_templates_App_HeaderDesktop_UsernameWithBackArrow
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
      return <UiLogoForHeader href="/" />
    }
  }

  const get_navigation = () => {
    let items: Ui_app_templates_App_HeaderDesktop_Navigation.Item[]
    if (!params.username) {
      const chat: Ui_app_templates_App_HeaderDesktop_Navigation.Item = {
        title: props.dictionary.app.menu_items.chat,
        icon: 'CHAT',
        filled_icon: 'CHAT_FILLED',
        href: '/chat',
        is_active: pathname == '/chat',
      }
      items = [
        {
          title: props.dictionary.app.menu_items.home,
          icon: 'HOME',
          filled_icon: 'HOME_FILLED',
          href: '/',
          is_active: pathname == '/',
        },
        {
          title: props.dictionary.app.menu_items.library,
          icon: 'BOOKMARK',
          filled_icon: 'BOOKMARK_FILLED',
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
        ...(process.env.NODE_ENV == 'development' ? [chat] : []),
      ]
    } else {
      const activity: Ui_app_templates_App_HeaderDesktop_Navigation.Item = {
        title: props.dictionary.app.menu_items.activity,
        icon: 'ACTIVITY',
        filled_icon: 'ACTIVITY_FILLED',
        href: `/${params.username}/activity${back ? `?back=${back}` : ''}`,
        is_active: pathname == `/${params.username}/activity`,
      }
      items = [
        {
          title: props.dictionary.app.menu_items.library,
          icon: 'BOOKMARK',
          filled_icon: 'BOOKMARK_FILLED',
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
        ...(process.env.NODE_ENV == 'development' ? [activity] : []),
      ]
    }

    return <Ui_app_templates_App_HeaderDesktop_Navigation items={items} />
  }

  const open_new_bookmark_modal = (params: { with_autofill?: boolean }) => {
    const bookmark = BookmarkUrlHashData.parse({
      hash: window.location.hash.slice(1),
    })

    modal_context.set(
      <UpsertBookmarkModal
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

  const get_user_actions = () => {
    if (is_hydrated) {
      if (auth_context.auth_data) {
        return (
          <Ui_app_templates_App_HeaderDesktop_UserArea
            pathname={pathname}
            on_click_add={() => {
              open_new_bookmark_modal({})
            }}
            name={
              auth_context.auth_data.username ||
              props.dictionary.app.header_desktop.guest_username
            }
            slot_user_dropdown={
              <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown>
                <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_IntegrationItem
                  text={
                    props.dictionary.app.header_desktop.user_dropdown.extension
                      .text
                  }
                  subtext={
                    props.dictionary.app.header_desktop.user_dropdown.extension
                      .subtext
                  }
                >
                  <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_IntegrationItem_ExtensionButton
                    text={
                      props.dictionary.app.header_desktop.user_dropdown
                        .extension.chrome.text
                    }
                    subtext={
                      props.dictionary.app.header_desktop.user_dropdown
                        .extension.chrome.subtext
                    }
                    icon="CHROME"
                    href="https://chromewebstore.google.com/detail/taaabs-social-bookmarking/mfpmbjjgeklnhjmpahigldafhcdoaona"
                  />
                </Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_IntegrationItem>
                <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_IntegrationItem
                  text={
                    props.dictionary.app.header_desktop.user_dropdown
                      .bookmarklet.text
                  }
                  subtext={
                    props.dictionary.app.header_desktop.user_dropdown
                      .bookmarklet.subtext
                  }
                >
                  <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_IntegrationItem_BookmarkletButton
                    label={
                      props.dictionary.app.header_desktop.user_dropdown
                        .bookmarklet.button_label
                    }
                    script={props.bookmarklet_script}
                  />
                </Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_IntegrationItem>
                <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_Separator />
                {auth_context.auth_data!.username && (
                  <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_StandardItem
                    label={
                      props.dictionary.app.header_desktop.user_dropdown
                        .my_public_profile
                    }
                    on_click={() => {
                      router.push(
                        `/${
                          auth_context.auth_data!.username
                        }?back=${pathname}?${search_params.toString()}`,
                      )
                    }}
                  />
                )}
                <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_StandardItem
                  label={
                    props.dictionary.app.header_desktop.user_dropdown.settings
                  }
                  on_click={() => {
                    router.push(
                      `/settings?back=${pathname}?${search_params.toString()}`,
                    )
                  }}
                />
                {auth_context.auth_data!.username ? (
                  <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_StandardItem
                    label={
                      props.dictionary.app.header_desktop.user_dropdown.log_out
                    }
                    on_click={auth_context.logout}
                  />
                ) : (
                  <>
                    <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_StandardItem
                      label={
                        props.dictionary.app.header_desktop.user_dropdown.log_in
                      }
                      on_click={() => {
                        router.push('/login')
                      }}
                    />
                    <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_StandardItem
                      label={
                        props.dictionary.app.header_desktop.user_dropdown
                          .create_account
                      }
                      on_click={() => {
                        router.push('/signup')
                      }}
                    />
                  </>
                )}

                <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_Separator />
                <Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown_FooterLinks
                  links={[
                    {
                      label:
                        props.dictionary.app.header_desktop.user_dropdown.about,
                      href: auth_context.auth_data!.username ? '/about' : '/',
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
              </Ui_app_templates_App_HeaderDesktop_AuthorizedUser_UserDropdown>
            }
          />
        )
      } else {
        return <Ui_app_templates_App_HeaderDesktop_UserArea />
      }
    } else {
      return <></>
    }
  }

  return (
    <Ui_app_templates_App_HeaderDesktop
      slot_left={get_logo()}
      slot_middle={get_navigation()}
      slot_right={get_user_actions()}
    />
  )
}
