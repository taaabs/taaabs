import { get_auth_data } from '@/helpers/get-auth-data'
import { GetUpsertBookmarkParams_Message } from '@/types/messages'
import { is_message } from '@/utils/is-message'
import { AES } from '@repositories/utils/aes'
import { SHA256 } from '@repositories/utils/sha256'
import { CreateBookmark_Dto } from '@shared/types/modules/bookmarks/create-bookmark.dto'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { HtmlParser } from '@shared/utils/html-parser'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'
import pako from 'pako'
import { system_values } from '@shared/constants/system-values'
import { get_ky_instance } from '@/background/api/get-ky-instance'

export const use_create_bookmark = (params: {
  set_is_saved: (is_saved: boolean) => void
}) => {
  const [is_creating, set_is_creating] = useState<boolean>()

  const create_bookmark = async (params: {
    reader_data?: HtmlParser.ParsedResult['reader_data']
  }) => {
    set_is_creating(true)
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([current_tab]) => {
        const message: GetUpsertBookmarkParams_Message = {
          action: 'get-upsert-bookmark-params',
          reader_data: params.reader_data,
        }
        browser.tabs.sendMessage(current_tab.id!, message)
      })
  }

  useEffect(() => {
    browser.runtime.onMessage.addListener((message: any, _, __): any => {
      if (is_message(message) && message.action == 'upsert-bookmark-params') {
        ;(async () => {
          try {
            const auth_data = await get_auth_data()

            const upsert_bookmark_params = message.bookmark

            const tags: CreateBookmark_Dto.Body['tags'] = []
            if (upsert_bookmark_params.tags) {
              for (const tag of upsert_bookmark_params.tags) {
                if (!tag.name.trim().length) continue
                const hash = await SHA256(
                  tag.name,
                  new Uint8Array(auth_data.encryption_key),
                )
                if (tags.find((t) => t.hash == hash)) continue
                if (tag.is_public) {
                  tags.push({
                    is_public: true,
                    hash,
                    name: tag.name.trim(),
                  })
                } else {
                  tags.push({
                    is_public: false,
                    hash,
                    name_aes: await AES.encrypt(
                      tag.name.trim(),
                      new Uint8Array(auth_data.encryption_key),
                    ),
                  })
                }
              }
            }

            const links: CreateBookmark_Dto.Body['links'] = []
            if (upsert_bookmark_params.links) {
              for (const link of upsert_bookmark_params.links) {
                if (!link.url.trim().length) continue
                const hash = await SHA256(
                  link.url.trim(),
                  new Uint8Array(auth_data.encryption_key),
                )
                if (links.find((l) => l.hash == hash)) continue
                const domain = get_domain_from_url(link.url)
                if (link.is_public) {
                  links.push({
                    is_public: true,
                    url: link.url.trim(),
                    hash: await SHA256(
                      link.url.trim(),
                      new Uint8Array(auth_data.encryption_key),
                    ),
                    site_path: link.is_public ? link.site_path : undefined,
                    is_pinned: link.is_pinned,
                    pin_title: link.pin_title,
                    open_snapshot: link.open_snapshot,
                    reader_data: link.reader_data,
                    favicon_aes: link.favicon
                      ? await AES.encrypt(
                          link.favicon,
                          new Uint8Array(auth_data.encryption_key),
                        )
                      : undefined,
                  })
                } else {
                  links.push({
                    is_public: false,
                    url_aes: await AES.encrypt(
                      link.url.trim(),
                      new Uint8Array(auth_data.encryption_key),
                    ),
                    site_aes: await AES.encrypt(
                      link.site_path ? `${domain}/${link.site_path}` : domain,
                      new Uint8Array(auth_data.encryption_key),
                    ),
                    hash: await SHA256(
                      link.url.trim(),
                      new Uint8Array(auth_data.encryption_key),
                    ),
                    is_pinned: link.is_pinned,
                    pin_title_aes: link.pin_title
                      ? await AES.encrypt(
                          link.pin_title,
                          new Uint8Array(auth_data.encryption_key),
                        )
                      : undefined,
                    open_snapshot: link.open_snapshot,
                    favicon_aes: link.favicon
                      ? await AES.encrypt(
                          link.favicon,
                          new Uint8Array(auth_data.encryption_key),
                        )
                      : undefined,
                    reader_data_aes: link.reader_data
                      ? await AES.encrypt(
                          btoa(
                            String.fromCharCode(
                              ...pako.deflate(link.reader_data),
                            ),
                          ),
                          new Uint8Array(auth_data.encryption_key),
                        )
                      : undefined,
                  })
                }
              }
            }

            let cover = upsert_bookmark_params.cover

            const title = upsert_bookmark_params.title?.substring(
              0,
              system_values.bookmark.title.max_length,
            )
            const note = upsert_bookmark_params.note?.substring(
              0,
              system_values.bookmark.note.max_length,
            )

            const body: CreateBookmark_Dto.Body = {
              created_at: upsert_bookmark_params.created_at?.toISOString(),
              title: upsert_bookmark_params.is_public ? title : undefined,
              title_aes:
                !upsert_bookmark_params.is_public && title
                  ? await AES.encrypt(
                      title,
                      new Uint8Array(auth_data.encryption_key),
                    )
                  : undefined,
              note: upsert_bookmark_params.is_public ? note : undefined,
              note_aes:
                !upsert_bookmark_params.is_public && note
                  ? await AES.encrypt(
                      note,
                      new Uint8Array(auth_data.encryption_key),
                    )
                  : undefined,
              is_public: upsert_bookmark_params.is_public || undefined,
              is_archived: upsert_bookmark_params.is_archived || undefined,
              stars: upsert_bookmark_params.stars || undefined,
              is_unsorted:
                upsert_bookmark_params.is_unsorted === undefined
                  ? upsert_bookmark_params.tags &&
                    upsert_bookmark_params.tags.length
                    ? false
                    : undefined
                  : upsert_bookmark_params.is_unsorted,
              tags,
              links,
              cover: upsert_bookmark_params.is_public ? cover : undefined,
              cover_aes:
                !upsert_bookmark_params.is_public && cover
                  ? await AES.encrypt(
                      cover,
                      new Uint8Array(auth_data.encryption_key),
                    )
                  : undefined,
              blurhash_aes:
                !upsert_bookmark_params.is_public &&
                upsert_bookmark_params.blurhash
                  ? await AES.encrypt(
                      upsert_bookmark_params.blurhash,
                      new Uint8Array(auth_data.encryption_key),
                    )
                  : undefined,
            }

            const ky_instance = get_ky_instance()
            const created_bookmark = await ky_instance
              .post('v1/bookmarks', {
                json: body,
              })
              .json()
            console.debug(created_bookmark)
            set_is_creating(false)
            params.set_is_saved(true)
          } catch (error) {
            console.error('Error while creating bookmark', error)
          }
        })()
      }
    })
  }, [])

  return { create_bookmark, is_creating, set_is_creating }
}
