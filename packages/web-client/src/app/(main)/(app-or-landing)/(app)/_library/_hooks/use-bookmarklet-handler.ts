import { AuthContext } from '@/providers/AuthProvider'
import { browser_storage } from '@/constants/browser-storage'
import { Dictionary } from '@/dictionaries/dictionary'
import { upsert_bookmark_modal_setter } from '@/modals/upsert-bookmark/upsert-bookmark-modal-setter'
import { ModalContext } from '@/providers/ModalProvider'
import { use_library_dispatch } from '@/stores/library'
import { BookmarkUrlHashData } from '@/utils/bookmark-url-hash-data'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { use_is_hydrated } from '@shared/hooks'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useContext } from 'react'
import { toast } from 'react-toastify'

export const use_bookmarklet_handler = (props: {
  dictionary: Dictionary
  refetch_data: () => void
}) => {
  const auth_context = useContext(AuthContext)
  const is_hydrated = use_is_hydrated()
  const modal_context = useContext(ModalContext)
  const dispatch = use_library_dispatch()

  // Runs on page load, handles bookmarklet script invocation
  useUpdateEffect(() => {
    const create_bookmark_with_clipboard_data = async (
      bookmark: BookmarkUrlHashData.Bookmark,
    ) => {
      // Look for duplicated link and open its edit modal
      let found_duplicate = false
      let should_refetch_data = false
      if (bookmark.links) {
        for (let i = 0; i < bookmark.links.length; i++) {
          const data_source = new Bookmarks_DataSourceImpl(
            auth_context.ky_instance,
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          try {
            const found_bookmark = await repository.find_by_url_hash(
              { url: bookmark.links[i].url },
              auth_context.auth_data!.encryption_key,
            )
            // Duplicate found, open edit modal
            found_duplicate = true
            const updated_bookmark = await upsert_bookmark_modal_setter({
              modal_context,
              bookmark: found_bookmark,
              is_archived: found_bookmark.is_archived,
              dictionary: props.dictionary,
            })
            if (updated_bookmark) {
              should_refetch_data = true
              await dispatch(
                bookmarks_actions.upsert_bookmark({
                  bookmark: updated_bookmark,
                  last_authorized_counts_params:
                    JSON.parse(
                      sessionStorage.getItem(
                        browser_storage.session_storage.library
                          .last_authorized_counts_params,
                      ) || 'null',
                    ) || undefined,
                  ky: auth_context.ky_instance,
                  encryption_key: auth_context.auth_data!.encryption_key,
                }),
              )
              toast.success(props.dictionary.app.library.bookmark_updated)
            }
            break
          } catch {
            // 404 - duplicated bookmark not found, iteration over links continues...
          }
        }
      }

      // Duplicate not found. Create bookmark and open edit modal
      if (!found_duplicate) {
        should_refetch_data = true
       
        // Some websites do not update title during SPA navigation
        let title = bookmark.title

        const websites_with_generic_description = [
          'https://chatgpt.com/',
          'https://chat.mistral.ai/chat/',
          'https://huggingface.co/chat/',
          'https://gemini.google.com/app/',
          'https://claude.ai/chat/',
          'https://www.reddit.com/r/',
        ]
        let note = bookmark.description
        if (
          websites_with_generic_description.some((domain) =>
            bookmark.links?.[0].url.startsWith(domain),
          )
        ) {
          note = undefined
        }

        const new_bookmark: UpsertBookmark_Params = {
          is_public: false,
          is_archived: false,
          title,
          note,
          links:
            bookmark.links?.map((link) => {
              return {
                is_public: false,
                url: link.url,
                site_path: link.site_path,
              }
            }) || [],
          tags: [],
        }
        const created_bookmark = await dispatch(
          bookmarks_actions.upsert_bookmark({
            bookmark: new_bookmark,
            last_authorized_counts_params:
              JSON.parse(
                sessionStorage.getItem(
                  browser_storage.session_storage.library
                    .last_authorized_counts_params,
                ) || 'null',
              ) || undefined,
            ky: auth_context.ky_instance,
            encryption_key: auth_context.auth_data!.encryption_key,
          }),
        )
        toast.success(props.dictionary.app.library.bookmark_created)
        const updated_bookmark = await upsert_bookmark_modal_setter({
          modal_context,
          bookmark: created_bookmark,
          is_archived: created_bookmark.is_archived,
          dictionary: props.dictionary,
        })
        if (updated_bookmark) {
          await dispatch(
            bookmarks_actions.upsert_bookmark({
              bookmark: updated_bookmark,
              last_authorized_counts_params:
                JSON.parse(
                  sessionStorage.getItem(
                    browser_storage.session_storage.library
                      .last_authorized_counts_params,
                  ) || 'null',
                ) || undefined,
              ky: auth_context.ky_instance,
              encryption_key: auth_context.auth_data!.encryption_key,
            }),
          )
          toast.success(props.dictionary.app.library.bookmark_updated)
        }
      }

      // Close modal
      if (should_refetch_data) {
        props.refetch_data()
      } else {
        modal_context.close()
      }
    }

    const bookmark = BookmarkUrlHashData.parse({
      hash: window.location.hash.slice(1),
    })
    if (Object.keys(bookmark).length && auth_context.auth_data) {
      window.location.hash = ''
      create_bookmark_with_clipboard_data(bookmark)
    }
  }, [is_hydrated])
}
