export const clear_library_session_storage = (params: {
  username?: string
  query_params?: string
}) => {
  for (const key in sessionStorage) {
    if (
      key ==
      `library.bookmarks.${params.username || ''}?${params.query_params || ''}`
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      `library.has-more-bookmarks.${params.username || ''}?${
        params.query_params || ''
      }`
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      `library.tags.${params.username || ''}?${params.query_params || ''}`
    ) {
      sessionStorage.removeItem(key)
    } else if (
      key ==
      `library.density.${params.username || ''}?${params.query_params || ''}`
    ) {
      sessionStorage.removeItem(key)
    }
  }
}
