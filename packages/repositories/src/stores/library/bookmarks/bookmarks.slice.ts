import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'

type BookmarksState = {
  is_fetching_data: boolean
  is_updating_bookmarks: boolean
  is_fetching_first_bookmarks: boolean
  is_fetching_more_bookmarks: boolean
  first_bookmarks_fetched_at_timestamp?: number
  showing_bookmarks_fetched_by_ids?: boolean
  incoming_bookmarks: Bookmark_Entity[] | null
  bookmarks: Bookmark_Entity[] | null
  has_more_bookmarks: boolean | null
  density: 'default' | 'compact'
  density_commited: 'default' | 'compact'
}

const initial_state: BookmarksState = {
  is_fetching_data: false,
  is_updating_bookmarks: false,
  is_fetching_first_bookmarks: false,
  is_fetching_more_bookmarks: false,
  incoming_bookmarks: null,
  bookmarks: null,
  has_more_bookmarks: null,
  density: 'default',
  density_commited: 'default',
}

export const bookmarks_slice = createSlice({
  name: 'bookmarks',
  initialState: initial_state,
  reducers: {
    set_is_fetching_data(state, action: PayloadAction<boolean>) {
      state.is_fetching_data = action.payload
    },
    set_is_updating_bookmarks(state, action: PayloadAction<boolean>) {
      state.is_updating_bookmarks = action.payload
    },
    set_is_fetching_first_bookmarks(state, action: PayloadAction<boolean>) {
      state.is_fetching_first_bookmarks = action.payload
      if (action.payload == false) {
        state.first_bookmarks_fetched_at_timestamp = Date.now()
      }
    },
    set_is_fetching_more_bookmarks(state, action: PayloadAction<boolean>) {
      state.is_fetching_more_bookmarks = action.payload
    },
    set_showing_bookmarks_fetched_by_ids(
      state,
      action: PayloadAction<boolean>,
    ) {
      state.showing_bookmarks_fetched_by_ids = action.payload
    },
    set_incoming_bookmarks(
      state,
      action: PayloadAction<BookmarksState['incoming_bookmarks']>,
    ) {
      state.incoming_bookmarks = action.payload
    },
    set_bookmarks(state, action: PayloadAction<BookmarksState['bookmarks']>) {
      state.bookmarks = action.payload
    },
    set_more_bookmarks(
      state,
      action: PayloadAction<BookmarksState['bookmarks']>,
    ) {
      if (!state.bookmarks || !action.payload)
        throw new Error('Some bookmarks should be there.')
      state.bookmarks.push(...action.payload)
    },
    set_has_more_bookmarks(
      state,
      action: PayloadAction<BookmarksState['has_more_bookmarks']>,
    ) {
      state.has_more_bookmarks = action.payload
    },
    set_bookmark_render_height(
      state,
      action: PayloadAction<{ index: number; height: number }>,
    ) {
      if (!state.bookmarks) return
      state.bookmarks[action.payload.index].render_height =
        action.payload.height
    },
    set_density(state, action: PayloadAction<BookmarksState['density']>) {
      state.density = action.payload
    },
    set_density_commited(
      state,
      action: PayloadAction<BookmarksState['density_commited']>,
    ) {
      state.density_commited = action.payload
    },
    set_bookmark_is_compact(
      state,
      action: PayloadAction<{ index: number; is_compact: boolean }>,
    ) {
      if (!state.bookmarks) return
      state.bookmarks[action.payload.index].is_compact =
        action.payload.is_compact
    },
  },
})

export const bookmarks_actions = {
  ...bookmarks_slice.actions,
  ...thunks,
}
