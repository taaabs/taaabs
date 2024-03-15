import { browser_storage } from '@/constants/browser-storage'

export const clear_library_session_storage = (params: {
  username?: string
  query_params?: string
}) => {
  for (const key in sessionStorage) {
    if (
      key ==
      browser_storage.session_storage.library.bookmarks({
        query_params: params.query_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.has_more_bookmarks({
        query_params: params.query_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.tags({
        query_params: params.query_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.density({
        query_params: params.query_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      browser_storage.session_storage.library.scroll_y({
        query_params: params.query_params,
        username: params.username,
      })
    ) {
      sessionStorage.removeItem(key)
    }
  }
}
