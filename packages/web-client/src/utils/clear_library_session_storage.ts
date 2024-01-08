export const clear_library_session_storage = (params: {
  username?: string
}) => {
  if (!params.username) {
    for (const key in sessionStorage) {
      if (key.substring(0, 9) == 'bookmarks') {
        sessionStorage.removeItem(key)
      } else if (key.substring(0, 18) == 'has-more-bookmarks') {
        sessionStorage.removeItem(key)
      } else if (key.substring(0, 4) == 'tags') {
        sessionStorage.removeItem(key)
      }
    }
  } else {
    for (const key in sessionStorage) {
      if (
        key.substring(0, 10 + params.username.length) ==
        `bookmarks/${params.username}`
      ) {
        sessionStorage.removeItem(key)
      } else if (
        key.substring(0, 19 + params.username.length) ==
        `has-more-bookmarks/${params.username}`
      ) {
        sessionStorage.removeItem(key)
      } else if (
        key.substring(0, 5 + params.username.length) ==
        `tags/${params.username}`
      ) {
        sessionStorage.removeItem(key)
      }
    }
  }
}
