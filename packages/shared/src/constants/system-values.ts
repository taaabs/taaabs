export const system_values = {
  username_max_length: 15,
  username_min_length: 6,
  password_length: 64,
  max_library_search_results: 1000,
  max_library_search_hints: 10,
  sortablejs_animation_duration: 150,
  library: {
    bookmarks: {
      per_page: 20,
      cache_for_days: 7,
    },
    counts: {
      cache_for_days: 7,
    },
  },
  bookmark: {
    title: {
      max_length: 160,
    },
    note: {
      max_length: 1000,
    },
    tags: {
      limit: 6,
      max_length: 15,
    },
    stars: {
      limit: 5,
    },
  },
}
