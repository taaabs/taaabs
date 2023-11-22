import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'
import { SearchableBookmark_Entity } from '@repositories/modules/library-search/domain/entities/searchable-bookmark.entity'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'

type SearchState = {
  is_fetching_searchable_bookmarks: boolean
  searchable_bookmarks?: SearchableBookmark_Entity[]
  searchable_bookmarks_filtered?: SearchableBookmark_Entity[]
  bookmark_ids_inc?: number[]
  bookmarks_of_search?: Bookmark_Entity[]
}

const initial_state: SearchState = {
  is_fetching_searchable_bookmarks: false,
}

export const search_slice = createSlice({
  name: 'search',
  initialState: initial_state,
  reducers: {
    set_is_getting_searchable_bookmarks(
      state,
      action: PayloadAction<SearchState['is_fetching_searchable_bookmarks']>,
    ) {
      state.is_fetching_searchable_bookmarks = action.payload
    },
    set_searchable_bookmarks(
      state,
      action: PayloadAction<SearchState['searchable_bookmarks']>,
    ) {
      state.searchable_bookmarks = action.payload
    },
    set_bookmark_ids_inc(
      state,
      action: PayloadAction<SearchState['bookmark_ids_inc']>,
    ) {
      state.bookmark_ids_inc = action.payload
    },
    set_bookmarks_of_search(
      state,
      action: PayloadAction<SearchState['bookmarks_of_search']>,
    ) {
      state.bookmarks_of_search = action.payload
    },
  },
})

export const search_actions = {
  ...search_slice.actions,
  ...thunks,
}
