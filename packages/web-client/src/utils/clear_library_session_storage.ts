import { browser_storage } from '@/constants/browser-storage'

export const clear_library_session_storage = (params: {
  username?: string
  search_params?: string
}) => {
  for (const key in sessionStorage) {
    if (
      key ==
      browser_storage.session_storage.library.bookmarks({
        search_params: params.search_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.has_more_bookmarks({
        search_params: params.search_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.tags({
        search_params: params.search_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.pinned({
        search_params: params.search_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.density({
        search_params: params.search_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.scroll_y({
        search_params: params.search_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.search_string({
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.highlights({
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.highlights_note({
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.highlights_sites_variants({
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.search_result({
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    }
  }
}
