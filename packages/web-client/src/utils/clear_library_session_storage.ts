import { browser_storage } from '@/constants/browser-storage'

export const clear_library_session_storage = (params: {
  username?: string
  search_params: string
  hash?: string
}) => {
  for (const key in sessionStorage) {
    if (
      key ==
      browser_storage.session_storage.library.bookmarks({
        search_params: params.search_params,
        username: params.username,
        hash: params.hash ? params.hash : '',
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
        }) &&
      !params.hash
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.density({
        search_params: params.search_params,
        username: params.username,
        hash: params.hash ? params.hash : '',
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.scroll_y({
        search_params: params.search_params,
        username: params.username,
        hash: params.hash ? params.hash : '',
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.search_string({
        username: params.username,
        search_params: params.search_params,
        hash: params.hash ? params.hash : '',
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.highlights({
        username: params.username,
        search_params: params.search_params,
        hash: params.hash ? params.hash : '',
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.highlights_sites_variants({
        username: params.username,
        search_params: params.search_params,
        hash: params.hash ? params.hash : '',
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.search_result({
        username: params.username,
        search_params: params.search_params,
        hash: params.hash ? params.hash : '',
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      !params.search_params &&
      key ==
        browser_storage.session_storage.library.pinned({
          username: params.username,
        })
    ) {
      sessionStorage.removeItem(key)
    }
  }
}
