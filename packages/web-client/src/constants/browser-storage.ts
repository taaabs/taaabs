import { BookmarkOfSearch } from '@/hooks/library/use-search'

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
  session_storage: {
    library: {
      last_authorized_counts_params: 'library.last-authorized-counts-params',
      bookmarks: (params: { username?: string; search_params?: string }) =>
        `library.bookmarks.${params.username || ''}?${
          params.search_params || ''
        }`,
      has_more_bookmarks: (params: {
        username?: string
        search_params?: string
      }) =>
        `library.has-more-bookmarks.${params.username || ''}?${
          params.search_params || ''
        }`,
      density: (params: { username?: string; search_params?: string }) =>
        `library.density.${params.username || ''}?${params.search_params || ''}`,
      tags: (params: { username?: string; search_params?: string }) =>
        `library.tags.${params.username || ''}?${params.search_params || ''}`,
      scroll_y: (params: { username?: string; search_params?: string }) =>
        `library.scroll_y.${params.username || ''}?${
          params.search_params || ''
        }`,
    },
  },
  local_storage: {
    authorized_library: {
      recent_searches: 'authorized-library-search.recent-searches',
      recent_visit: 'authorized-library.recent-visit',
    },
  },
}

export namespace BrowserStorage {
  export namespace LocalStorage {
    export namespace AuthorizedLibrary {
      export type RecentVisit = {
        bookmark: BookmarkOfSearch
        visited_at: string
      }
    }
  }
}
