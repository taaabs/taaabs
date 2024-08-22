import { get_auth_data } from '@/helpers/get-auth-data'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { AES } from '@repositories/utils/aes'
import { SHA256 } from '@repositories/utils/sha256'
import { CreateBookmark_Dto } from '@shared/types/modules/bookmarks/create-bookmark.dto'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import pako from 'pako'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == 'inject_popup') {
    if (!document.getElementById('taaabs-popup')) {
      inject_popup()
    } else {
      console.log('Popup is already injected.')
    }
  } else if (request.action == 'close_popup') {
    close_popup()
  }
})

const inject_popup = () => {
  const popup_html = chrome.runtime.getURL('popup.html')
  fetch(popup_html)
    .then((r) => r.text())
    .then((data) => {
      const container = document.createElement('div')
      container.id = 'taaabs-popup'
      container.style.display = 'block'
      container.innerHTML = data
      document.body.appendChild(container)

      const script = document.createElement('script')
      script.src = chrome.runtime.getURL('popup.js')
      document.body.appendChild(script)

      // Add event listener to close popup when clicking outside
      document.addEventListener('click', (event) => {
        const popup = document.getElementById('taaabs-popup')
        if (popup && !popup.contains(event.target as Node)) {
          close_popup()
        }
      })

      // Injected code creates UpsertBookmark_Params, this content script DTO,
      // and service worker sends data over to BE because sending here attaches referer header.
      window.addEventListener('message', async (event) => {
        if (event.source !== window) return
        if (event.data && event.data.from == 'preactApp') {
          const auth_data = await get_auth_data()

          const params = event.data.data as UpsertBookmark_Params

          const tags: CreateBookmark_Dto.Body['tags'] = []
          for (const tag of params.tags) {
            if (!tag.name.trim().length) continue
            const hash = await SHA256(tag.name, auth_data.encryption_key)
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
                  auth_data.encryption_key,
                ),
              })
            }
          }

          const links: CreateBookmark_Dto.Body['links'] = []
          for (const link of params.links) {
            if (!link.url.trim().length) continue
            const hash = await SHA256(link.url.trim(), auth_data.encryption_key)
            if (links.find((l) => l.hash == hash)) continue
            const domain = get_domain_from_url(link.url)
            if (link.is_public) {
              links.push({
                is_public: true,
                url: link.url.trim(),
                hash: await SHA256(link.url.trim(), auth_data.encryption_key),
                site_path: link.is_public ? link.site_path : undefined,
                is_pinned: link.is_pinned,
                pin_title: link.pin_title,
                open_snapshot: link.open_snapshot,
                reader_data: link.reader_data,
                favicon_aes: link.favicon
                  ? await AES.encrypt(link.favicon, auth_data.encryption_key)
                  : undefined,
              })
            } else {
              links.push({
                is_public: false,
                url_aes: await AES.encrypt(
                  link.url.trim(),
                  auth_data.encryption_key,
                ),
                site_aes: await AES.encrypt(
                  link.site_path ? `${domain}/${link.site_path}` : domain,
                  auth_data.encryption_key,
                ),
                hash: await SHA256(link.url.trim(), auth_data.encryption_key),
                is_pinned: link.is_pinned,
                pin_title_aes: link.pin_title
                  ? await AES.encrypt(link.pin_title, auth_data.encryption_key)
                  : undefined,
                open_snapshot: link.open_snapshot,
                favicon_aes: link.favicon
                  ? await AES.encrypt(link.favicon, auth_data.encryption_key)
                  : undefined,
                reader_data_aes: link.reader_data
                  ? await AES.encrypt(
                      btoa(
                        String.fromCharCode(...pako.deflate(link.reader_data)),
                      ),
                      auth_data.encryption_key,
                    )
                  : undefined,
              })
            }
          }

          let cover = params.cover

          const body: CreateBookmark_Dto.Body = {
            created_at: params.created_at?.toISOString(),
            title: params.is_public ? params.title : undefined,
            title_aes:
              !params.is_public && params.title
                ? await AES.encrypt(params.title, auth_data.encryption_key)
                : undefined,
            note: params.is_public ? params.note : undefined,
            note_aes:
              !params.is_public && params.note
                ? await AES.encrypt(params.note, auth_data.encryption_key)
                : undefined,
            is_public: params.is_public || undefined,
            is_archived: params.is_archived || undefined,
            stars: params.stars || undefined,
            is_unsorted:
              params.is_unsorted === undefined
                ? params.tags.length
                  ? false
                  : undefined
                : params.is_unsorted,
            tags,
            links,
            cover: params.is_public ? cover : undefined,
            cover_aes:
              !params.is_public && cover
                ? await AES.encrypt(cover, auth_data.encryption_key)
                : undefined,
            blurhash_aes:
              !params.is_public && params.blurhash
                ? await AES.encrypt(params.blurhash, auth_data.encryption_key)
                : undefined,
          }

          chrome.runtime.sendMessage(
            {
              from: 'preactApp',
              action: 'someAction',
              data: body,
            },
            () => {
              window.postMessage({ status: 'success' })
            },
          )
        }
      })
    })
    .catch((error) => {
      console.error('Failed to fetch popup-injected.html:', error)
    })
}

const close_popup = () => {
  document.getElementById('taaabs-popup')?.remove()
  const script_src = chrome.runtime.getURL('popup.js')
  document.querySelector(`script[src="${script_src}"]`)?.remove()
}