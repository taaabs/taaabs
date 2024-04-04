export const browser_storage = {
  local_forage: {
    authorized_library: {
      search: {
        bookmarks: 'authorized-library.search.bookmarks',
        index: 'authorized-library.search.index',
        cached_at: 'authorized-library.search.cached-at',
        archived_bookmarks: 'authorized-library.search.archived-bookmarks',
        archived_index: 'authorized-library.search.archived-index',
        archived_cached_at: 'authorized-library.search.archived-cached-at',
      },
    },
    public_library: {
      search: {
        bookmarks: (params: { username: string }) =>
          `public-library.search.bookmarks.${params.username}`,
        index: (params: { username: string }) =>
          `public-library.index.${params.username}`,
        cached_at: (params: { username: string }) =>
          `public-library.cached_at.${params.username}`,
        archived_bookmarks: (params: { username: string }) =>
          `public-library.archived_bookmarks.${params.username}`,
        archived_index: (params: { username: string }) =>
          `public-library.archived_index.${params.username}`,
        archived_cached_at: (params: { username: string }) =>
          `public-library.archived_cached_at.${params.username}`,
      },
    },
  },
  // ATTETION: If ever considering renaming keys,
  // remember to take care about "Delete" bookmark
  // menu option handler. It loops through session
  // storage entries of a user and deletes there as well.
  // NOTE: ".?" for authorized user is not a mistake!
  session_storage: {
    library: {
      last_authorized_counts_params: 'library.last-authorized-counts-params',
      bookmarks: (params: {
        username?: string
        search_params: string
        hash: string
      }) =>
        `library.bookmarks.${params.username || ''}?${
          params.search_params || ''
        }${params.hash}`,
      has_more_bookmarks: (params: {
        username?: string
        search_params: string
      }) =>
        `library.has_more_bookmarks.${params.username || ''}?${
          params.search_params || ''
        }`,
      density: (params: {
        username?: string
        search_params: string
        hash: string
      }) =>
        `library.density.${params.username || ''}?${
          params.search_params || ''
        }${params.hash}`,
      tags: (params: { username?: string; search_params?: string }) =>
        `library.tags.${params.username || ''}?${params.search_params || ''}`,
      scroll_y: (params: {
        username?: string
        search_params: string
        hash: string
      }) =>
        `library.scroll_y.${params.username || ''}?${
          params.search_params || ''
        }${params.hash}`,
      pinned: (params: { username?: string }) =>
        `library.pinned.${params.username || ''}`,
      search_string: (params: {
        username?: string
        search_params: string
        hash: string
      }) =>
        `library.search_string.${params.username || ''}?${
          params.search_params || ''
        }${params.hash}`,
      highlights: (params: {
        username?: string
        search_params: string
        hash: string
      }) =>
        `library.hightlights.${params.username || ''}?${
          params.search_params || ''
        }${params.hash}`,
      highlights_note: (params: {
        username?: string
        search_params: string
        hash: string
      }) =>
        `library.hightlights_note.${params.username || ''}?${
          params.search_params || ''
        }${params.hash}`,
      highlights_sites_variants: (params: {
        username?: string
        search_params: string
        hash: string
      }) =>
        `library.hightlights_sites_variants.${params.username || ''}?${
          params.search_params || ''
        }${params.hash}`,
      search_results_count: (params: {
        username?: string
        search_params: string
        hash: string
      }) =>
        `library.search_results_count.${params.username || ''}?${
          params.search_params || ''
        }${params.hash}`,
      search_result: (params: {
        username?: string
        search_params: string
        hash: string
      }) =>
        `library.search_result.${params.username || ''}?${
          params.search_params || ''
        }${params.hash}`,
    },
  },
  local_storage: {
    authorized_library: {
      recent_searches: 'authorized-library-search.recent-searches',
      record_visit_params: 'authorized-library.recent-visit',
    },
  },
}
