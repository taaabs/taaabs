import { browser_storage } from '@/constants/browser-storage'

export const clear_library_session_storage = (params: {
  username?: string
  search_params?: string
  hash?: string
}) => {
  const search_params = params.search_params || ''
  const username = params.username
  const hash = params.hash || ''

  for (const key in sessionStorage) {
    if (
      key ==
      browser_storage.session_storage.library.bookmarks({
        search_params,
        username,
        hash,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.has_more_bookmarks({
        search_params,
        username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
        browser_storage.session_storage.library.tags({
          search_params,
          username,
        }) &&
      !hash
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.density({
        search_params,
        username,
        hash,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.scroll_y({
        search_params,
        username,
        hash,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.highlights({
        username,
        search_params,
        hash,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.highlights_sites_variants({
        username,
        search_params,
        hash,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.search_result({
        username,
        search_params,
        hash,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      !params.search_params &&
      key ==
        browser_storage.session_storage.library.pinned({
          username,
        })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.is_pinned_revealed({
        username,
        search_params,
        hash,
      })
    ) {
      sessionStorage.removeItem(key)
    }
  }
}
