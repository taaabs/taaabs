export const browser_storage = {
  local_forage: {
    authorized_library: {
      search: {
        bookmarks: 'authorized-library.search.bookmarks',
        index: 'authorized-library-search.search.index',
        cached_at: 'authorized-library-search.search.cached-at',
        archived_bookmarks: 'authorized-library.search.archived-bookmarks',
        archived_index: 'authorized-library-search.search.archived-index',
        archived_cached_at:
          'authorized-library-search.search.archived-cached-at',
      },
    },
  },
  session_storage: {
    last_authorized_counts_params: 'last-authorized-counts-params',
  },
  local_storage: {
    authorized_library: {
      recent_searches: 'authorized-library-search.recent-searches',
    },
  },
}
