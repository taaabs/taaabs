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
import { HtmlParser } from '@shared/utils/html-parser'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { encode } from 'blurhash'
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
    const create_bookmark_with_clipboard_data = async () => {
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
            toast.info('Link is already in library')
            const updated_bookmark = await upsert_bookmark_modal_setter({
              modal_context,
              bookmark: found_bookmark,
              is_archived: found_bookmark.is_archived,
              dictionary: props.dictionary,
            })
            if (updated_bookmark) {
              should_refetch_data = true
              let should_refetch_links_reader_data = false
              if (found_bookmark.is_public != updated_bookmark.is_public) {
                should_refetch_links_reader_data = true
              }
              if (!should_refetch_links_reader_data) {
                updated_bookmark.links.forEach((link) => {
                  const old_link = found_bookmark.links.find(
                    (l) => l.url == link.url,
                  )
                  if (old_link && old_link.is_public != link.is_public) {
                    should_refetch_links_reader_data = true
                  }
                })
              }
              await dispatch(
                bookmarks_actions.upsert_bookmark({
                  bookmark: updated_bookmark,
                  should_refetch_links_reader_data,
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
        const bookmark_url_hash_data = BookmarkUrlHashData.parse({
          hash: window.location.hash.slice(1),
        })
        let clipboard_data: {
          html: string
          favicon?: string
          og_image?: string
        } | null = null
        try {
          const clipboard_value = await navigator.clipboard.readText()
          clipboard_data = JSON.parse(clipboard_value)
        } catch {}

        let og_image: string | undefined = undefined
        let og_image_blurhash: string | undefined = undefined

        if (clipboard_data?.og_image) {
          const img = new Image()
          img.src = clipboard_data.og_image

          await new Promise((resolve) => {
            img.onload = resolve
          })

          const original_width = img.width
          const original_height = img.height

          // Calculate new dimensions
          const max_width = 1200
          let new_width = original_width
          let new_height = original_height

          if (original_width > max_width) {
            new_width = max_width
            new_height = Math.round(
              (original_height / original_width) * max_width,
            )
          }

          // Create canvas for full-size image
          const full_size_canvas = document.createElement('canvas')
          full_size_canvas.width = new_width
          full_size_canvas.height = new_height
          const full_size_ctx = full_size_canvas.getContext('2d')
          if (!full_size_ctx)
            throw new Error('Could not get 2D context from full-size canvas.')

          full_size_ctx.drawImage(img, 0, 0, new_width, new_height)
          og_image = full_size_canvas.toDataURL('image/webp')

          // Create smaller canvas for Blurhash calculation
          const blurhash_width = 50
          const blurhash_height = Math.round(
            (new_height / new_width) * blurhash_width,
          )

          const blurhashCanvas = document.createElement('canvas')
          blurhashCanvas.width = blurhash_width
          blurhashCanvas.height = blurhash_height
          const blurhash_ctx = blurhashCanvas.getContext('2d')
          if (!blurhash_ctx)
            throw new Error('Could not get 2D context from Blurhash canvas.')

          // Use built-in scaling of drawImage for better quality
          blurhash_ctx.drawImage(img, 0, 0, blurhash_width, blurhash_height)

          // Calculate Blurhash using the resized image
          const pixels = blurhash_ctx.getImageData(
            0,
            0,
            blurhash_width,
            blurhash_height,
          ).data
          og_image_blurhash = encode(
            pixels,
            blurhash_width,
            blurhash_height,
            4,
            3,
          )
        }

        // Some websites do not update title during SPA navigation
        let title = bookmark_url_hash_data.title

        if (clipboard_data?.html) {
          const temp_el = document.createElement('div')
          temp_el.innerHTML = clipboard_data.html
          const url = bookmark_url_hash_data.links?.[0].url
          if (url) {
            // chatgpt.com
            if (url.startsWith('https://chatgpt.com/')) {
              title = temp_el.querySelector<HTMLElement>(
                '.bg-token-sidebar-surface-secondary.active\\:opacity-90.rounded-lg.relative.group > .p-2.gap-2.items-center.flex',
              )?.innerText
            }
            // claude.ai
            else if (url.startsWith('https://claude.ai/chat/')) {
              title = temp_el.querySelector<HTMLElement>(
                '.tracking-tight.font-normal.font-tiempos.truncate',
              )?.innerText
            }
            // chat.mistral.ai
            else if (url.startsWith('https://chat.mistral.ai/chat/')) {
              title = temp_el.querySelector<HTMLElement>(
                '.text-primary.bg-muted.group.sm\\:min-h-6.rounded-lg.justify-between.items-center.flex-row.shrink-0.w-full.min-h-7.flex',
              )?.innerText
            }
            // coral.cohere.com
            else if (url.startsWith('https://coral.cohere.com/c/')) {
              title = temp_el.querySelector<HTMLElement>(
                '.truncate.font-body.text-p-lg',
              )?.innerText
            }
            // gemini.google.com
            else if (url.startsWith('https://gemini.google.com/app/')) {
              title = temp_el.querySelector<HTMLElement>(
                '.selected.ng-star-inserted.conversation.mat-mdc-tooltip-trigger > .gmat-body-1.conversation-title',
              )?.innerText
            }
          }
        }

        const websites_with_generic_description = [
          'https://chatgpt.com/',
          'https://chat.mistral.ai/chat/',
          'https://huggingface.co/chat/',
          'https://gemini.google.com/app/',
          'https://claude.ai/chat/',
          'https://www.reddit.com/r/',
        ]
        let note = bookmark_url_hash_data.description
        if (
          websites_with_generic_description.some((domain) =>
            bookmark_url_hash_data.links?.[0].url.startsWith(domain),
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
            bookmark_url_hash_data.links?.map((link) => {
              const favicon = clipboard_data?.favicon
                ? clipboard_data.favicon.replace('data:image/webp;base64,', '')
                : undefined
              const reader_data =
                bookmark_url_hash_data?.links &&
                bookmark_url_hash_data.links.length &&
                bookmark_url_hash_data.links[0].url == link.url
                  ? clipboard_data
                    ? HtmlParser.parse({
                        url: link.url,
                        html: clipboard_data.html,
                      })?.reader_data
                    : undefined
                  : undefined
              return {
                is_public: false,
                url: link.url,
                site_path: link.site_path,
                favicon,
                reader_data,
              }
            }) || [],
          tags: [],
          cover: og_image?.split(',')[1],
          blurhash: og_image_blurhash,
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
          let should_refetch_links_reader_data = false
          if (created_bookmark.is_public != updated_bookmark.is_public) {
            should_refetch_links_reader_data = true
          }
          if (!should_refetch_links_reader_data) {
            updated_bookmark.links.forEach((link) => {
              const old_link = created_bookmark.links.find(
                (l) => l.url == link.url,
              )
              if (old_link && old_link.is_public != link.is_public) {
                should_refetch_links_reader_data = true
              }
            })
          }
          await dispatch(
            bookmarks_actions.upsert_bookmark({
              bookmark: updated_bookmark,
              should_refetch_links_reader_data,
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
      create_bookmark_with_clipboard_data()
    }
  }, [is_hydrated])
}