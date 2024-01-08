export const clear_library_session_storage = (params: {
  username?: string
  query_parms?: string
}) => {
  if (!params.username) {
    if (params.query_parms) {
      for (const key in sessionStorage) {
        if (key == `library.bookmarks.?${params.query_parms}`) {
          sessionStorage.removeItem(key)
        } else if (key == `library.has-more-bookmarks.?${params.query_parms}`) {
          sessionStorage.removeItem(key)
        } else if (key == `library.tags.?${params.query_parms}`) {
          sessionStorage.removeItem(key)
        }
      }
    } else {
      for (const key in sessionStorage) {
        if (key.substring(0, 17) == 'library.bookmarks') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 26) == 'library.has-more-bookmarks') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 12) == 'library.tags') {
          sessionStorage.removeItem(key)
        }
      }
    }
  } else {
    for (const key in sessionStorage) {
      if (params.query_parms) {
        if (
          key == `library.bookmarks.${params.username}?${params.query_parms}`
        ) {
          sessionStorage.removeItem(key)
        } else if (
          key ==
          `library.has-more-bookmarks.${params.username}?${params.query_parms}`
        ) {
          sessionStorage.removeItem(key)
        } else if (
          key == `library.tags.${params.username}?${params.query_parms}`
        ) {
          sessionStorage.removeItem(key)
        }
      } else {
        if (
          key.substring(0, 18 + params.username.length) ==
          `library.bookmarks.${params.username}`
        ) {
          sessionStorage.removeItem(key)
        } else if (
          key.substring(0, 27 + params.username.length) ==
          `library.has-more-bookmarks.${params.username}`
        ) {
          sessionStorage.removeItem(key)
        } else if (
          key.substring(0, 13 + params.username.length) ==
          `library.tags.${params.username}`
        ) {
          sessionStorage.removeItem(key)
        }
      }
    }
  }
}
