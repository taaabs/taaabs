import { get_auth_data } from '@/helpers/get-auth-data'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { AES } from '@repositories/utils/aes'
import { SHA256 } from '@repositories/utils/sha256'
import { system_values } from '@shared/constants/system-values'
import { CreateBookmark_Dto } from '@shared/types/modules/bookmarks/create-bookmark.dto'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { HtmlParser } from '@shared/utils/html-parser'
import pako from 'pako'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'

// Avoid flash of unstyled content
const link_href = browser.runtime.getURL('popup.css')
if (!document.querySelector(`link[href="${link_href}"]`)) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = link_href
  document.head.appendChild(link)
}

// Clicking on floating button clears text selection so we hold it for a short while
let selected_text = ''
const text_selection_handler = () => {
  const selection = window.getSelection()?.toString() || ''
  setTimeout(() => {
    selected_text = selection
  }, 500)
}
document.addEventListener('selectionchange', text_selection_handler)

browser.runtime.onMessage.addListener((message: any, _, __): any => {
  if (is_message(message) && message.action == 'inject-popup') {
    const popup = document.getElementById('root-taaabs-popup')
    if (!popup) {
      inject_popup()
      browser.runtime.sendMessage({ action: 'popup-opened' })
      // We no longer need to store text selection for popup intialization
      document.removeEventListener('selectionchange', text_selection_handler)
    } else {
      // Toggle visibility
      if (
        (popup.style.opacity == '1' && popup.style.pointerEvents == 'all') ||
        (popup.style.opacity == '' && popup.style.pointerEvents == '')
      ) {
        popup.style.opacity = '0'
        popup.style.pointerEvents = 'none'
        console.debug('Popup visibility has been hidden')
        browser.runtime.sendMessage({ action: 'popup-closed' })
      } else {
        popup.style.opacity = '1'
        popup.style.pointerEvents = 'all'
        console.debug('Popup visibility has been restored')
        browser.runtime.sendMessage({ action: 'popup-opened' })
        window.postMessage({ action: 'popup-restored' }, '*')
      }
    }
  } else if (is_message(message) && message.action == 'close-popup') {
    close_popup()
  } else if (is_message(message) && message.action == 'bookmark-created') {
    window.postMessage({ action: 'url-saved-status', is_saved: true }, '*')
  } else if (is_message(message) && message.action == 'bookmark-deleted') {
    window.postMessage({ action: 'url-saved-status', is_saved: false }, '*')
  }
})

// Detect auth_data deletion from storage
browser.storage.onChanged.addListener((changes) => {
  if (changes.auth_data && !changes.auth_data.newValue) {
    window.postMessage({ action: 'auth-state', is_logged_id: false }, '*')
  }
})

const message_handler = async (event: MessageEvent) => {
  if (event.source !== window) return
  const action = event.data.action
  if (action == 'get-auth-state') {
    try {
      if (await get_auth_data()) {
        window.postMessage({ action: 'auth-state', is_logged_id: true }, '*')
      }
    } catch {
      window.postMessage({ action: 'auth-state', is_logged_id: false }, '*')
    }
  } else if (action == 'check-url-saved') {
    browser.runtime
      .sendMessage({ action: 'check-url-saved' })
      .then((response: any) => {
        window.postMessage(
          { action: 'url-saved-status', is_saved: response.is_saved },
          '*',
        )
      })
    // Initial selected text
    window.postMessage(
      {
        action: 'selected-text',
        selected_text,
      },
      '*',
    )
  } else if (action == 'open-options-page') {
    browser.runtime.sendMessage({ action: 'open-options-page' })
  } else if (action == 'send-chatbot-prompt') {
    browser.runtime.sendMessage({
      action: 'send-chatbot-prompt',
      chatbot_url: event.data.chatbot_url,
      prompt: event.data.prompt,
      plain_text: event.data.plain_text,
      window_width: window.outerWidth,
      window_height: window.outerHeight,
      open_in_new_tab: event.data.open_in_new_tab,
    })
  } else if (action == 'get-last-used-chatbot-name') {
    // Use browser.storage.local for Firefox
    const storage_area = browser.browserAction
      ? browser.storage.local
      : browser.storage.sync

    storage_area
      .get('last_used_chatbot_name')
      .then(({ last_used_chatbot_name }) => {
        window.postMessage(
          {
            action: 'last-used-chatbot-name',
            last_used_chatbot_name: last_used_chatbot_name || 'chatgpt',
          },
          '*',
        )
      })
  } else if (action == 'set-last-used-chatbot-name') {
    // Use browser.storage.local for Firefox
    const storageArea = browser.browserAction
      ? browser.storage.local
      : browser.storage.sync

    storageArea.set({
      last_used_chatbot_name: event.data.last_used_chatbot_name,
    })
  } else if (action == 'get-custom-chatbot-url') {
    browser.storage.local
      .get('custom_chatbot_url')
      .then(({ custom_chatbot_url }) => {
        window.postMessage(
          {
            action: 'custom-chatbot-url',
            custom_chatbot_url,
          },
          '*',
        )
      })
  } else if (action == 'create-bookmark') {
    // Injected code creates UpsertBookmark_Params, this content script DTO,
    // and service worker sends data over to BE because sending here attaches referer header.
    const auth_data = await get_auth_data()

    const params = event.data.bookmark as UpsertBookmark_Params

    const tags: CreateBookmark_Dto.Body['tags'] = []
    if (params.tags) {
      for (const tag of params.tags) {
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
    if (params.links) {
      for (const link of params.links) {
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
                  btoa(String.fromCharCode(...pako.deflate(link.reader_data))),
                  new Uint8Array(auth_data.encryption_key),
                )
              : undefined,
          })
        }
      }
    }

    let cover = params.cover

    const title = params.title?.substring(
      0,
      system_values.bookmark.title.max_length,
    )
    const note = params.note?.substring(
      0,
      system_values.bookmark.note.max_length,
    )

    const body: CreateBookmark_Dto.Body = {
      created_at: params.created_at?.toISOString(),
      title: params.is_public ? title : undefined,
      title_aes:
        !params.is_public && title
          ? await AES.encrypt(title, new Uint8Array(auth_data.encryption_key))
          : undefined,
      note: params.is_public ? note : undefined,
      note_aes:
        !params.is_public && note
          ? await AES.encrypt(note, new Uint8Array(auth_data.encryption_key))
          : undefined,
      is_public: params.is_public || undefined,
      is_archived: params.is_archived || undefined,
      stars: params.stars || undefined,
      is_unsorted:
        params.is_unsorted === undefined
          ? params.tags && params.tags.length
            ? false
            : undefined
          : params.is_unsorted,
      tags,
      links,
      cover: params.is_public ? cover : undefined,
      cover_aes:
        !params.is_public && cover
          ? await AES.encrypt(cover, new Uint8Array(auth_data.encryption_key))
          : undefined,
      blurhash_aes:
        !params.is_public && params.blurhash
          ? await AES.encrypt(
              params.blurhash,
              new Uint8Array(auth_data.encryption_key),
            )
          : undefined,
    }

    browser.runtime
      .sendMessage({
        action: 'create-bookmark',
        data: body,
      })
      .then((response: any) => {
        window.postMessage(
          {
            action: 'created-bookmark',
            bookmark: response.bookmark,
          },
          '*',
        )
        window.postMessage({ action: 'url-saved-status', is_saved: true }, '*')
      })
  } else if (action == 'delete-bookmark') {
    browser.runtime
      .sendMessage({
        action: 'delete-bookmark',
        url: event.data.url,
      })
      .then(() => {
        window.postMessage(
          {
            action: 'bookmark-deleted-successfully',
          },
          '*',
        )
        window.postMessage({ action: 'url-saved-status', is_saved: false }, '*')
      })
  } else if (action == 'get-prompts-history') {
    browser.storage.local.get('prompts_history').then(({ prompts_history }) => {
      if (prompts_history) {
        window.postMessage(
          {
            action: 'prompts-history',
            prompts_history,
          },
          '*',
        )
      }
    })
  } else if (action == 'set-prompts-history') {
    browser.storage.local.set({ prompts_history: event.data.prompts_history })
  } else if (action == 'get-attach-text-checkbox-state') {
    browser.storage.local
      .get('is_attach_this_page_checkbox_checked')
      .then(({ is_attach_this_page_checkbox_checked }) => {
        window.postMessage(
          {
            action: 'attach-text-checkbox-state',
            is_checked: is_attach_this_page_checkbox_checked,
          },
          '*',
        )
      })
  } else if (action == 'set-attach-text-checkbox-state') {
    browser.storage.local.set({
      is_attach_this_page_checkbox_checked: event.data.is_checked,
    })
  } else if (action == 'parse-html') {
    // Some sites like gmail restrict parsing directly from popup
    // by having strict DOM manipulation security policy
    const parsed_html = await HtmlParser.parse({
      html: event.data.html,
      url: document.location.href,
    })
    window.postMessage(
      {
        action: 'parsed-html',
        parsed_html,
      },
      '*',
    )
  }
}

const hide_popup_handler = (event: MouseEvent | KeyboardEvent) => {
  const popup = document.getElementById('root-taaabs-popup')
  if (
    popup &&
    (!popup.contains(event.target as Node) ||
      (event as KeyboardEvent).key == 'Escape')
  ) {
    popup.style.opacity = '0'
    popup.style.pointerEvents = 'none'
    browser.runtime.sendMessage({ action: 'popup-closed' })
  }
}

const inject_popup = () => {
  const container = document.createElement('div')
  container.id = 'root-taaabs-popup'
  container.style.display = 'block'
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.right = '0'
  container.style.width = '300px'
  container.style.margin = '24px'
  container.style.zIndex = '99999999'
  container.style.transition = '150ms opacity ease-in-out'

  document.body.appendChild(container)

  const script = document.createElement('script')
  script.src = browser.runtime.getURL('popup.js')
  document.body.appendChild(script)

  // Add event listener for both click outside and Escape key
  document.addEventListener('click', hide_popup_handler)
  document.addEventListener('keydown', hide_popup_handler)

  // Listen for messages from popup
  window.addEventListener('message', message_handler)
}

const close_popup = () => {
  console.debug('Removing popup from DOM.')
  document.getElementById('root-taaabs-popup')?.remove()
  const script_src = browser.runtime.getURL('popup.js')
  document.querySelector(`script[src="${script_src}"]`)?.remove()
  document.removeEventListener('click', hide_popup_handler)
  document.removeEventListener('keydown', hide_popup_handler)
  window.removeEventListener('message', message_handler)
}
