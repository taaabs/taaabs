export const clear_library_session_storage = (params: {
  username?: string
  query_parms?: string
}) => {
  if (!params.username) {
    if (params.query_parms) {
      for (const key in sessionStorage) {
        if (key == `bookmarks/?${params.query_parms}`) {
          sessionStorage.removeItem(key)
        } else if (key == `has-more-bookmarks/?${params.query_parms}`) {
          sessionStorage.removeItem(key)
        } else if (key == `tags/?${params.query_parms}`) {
          sessionStorage.removeItem(key)
        }
      }
    } else {
      for (const key in sessionStorage) {
        if (key.substring(0, 9) == 'bookmarks') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 18) == 'has-more-bookmarks') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 4) == 'tags') {
          sessionStorage.removeItem(key)
        }
      }
    }
  } else {
    for (const key in sessionStorage) {
      if (params.query_parms) {
        if (key == `bookmarks/${params.username}?${params.query_parms}`) {
          sessionStorage.removeItem(key)
        } else if (
          key == `has-more-bookmarks/${params.username}?${params.query_parms}`
        ) {
          sessionStorage.removeItem(key)
        } else if (key == `tags/${params.username}?${params.query_parms}`) {
          sessionStorage.removeItem(key)
        }
      } else {
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
}
