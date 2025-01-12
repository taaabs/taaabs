import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'

type BookmarksState = {
  is_fetching?: boolean
  is_upserting?: boolean
  is_fetching_first_bookmarks?: boolean
  first_bookmarks_fetched_at_timestamp?: number // Used for synchronization of pinned links re-render
  is_fetching_more_bookmarks?: boolean
  showing_bookmarks_fetched_by_ids?: boolean
  incoming_bookmarks?: Bookmark_Entity[]
  bookmarks?: Bookmark_Entity[]
  has_more_bookmarks?: boolean
  processing_progress?: number // Filling tag combinations and generating counts
  import_progress?: number
}

const initial_state: BookmarksState = {}

export const bookmarks_slice = createSlice({
  name: 'bookmarks',
  initialState: initial_state,
  reducers: {
    set_is_fetching(state, action: PayloadAction<boolean>) {
      state.is_fetching = action.payload
    },
    set_is_upserting(state, action: PayloadAction<boolean>) {
      state.is_upserting = action.payload
    },
    set_is_fetching_first_bookmarks(state, action: PayloadAction<boolean>) {
      state.is_fetching_first_bookmarks = action.payload
    },
    set_first_bookmarks_fetched_at_timestamp(
      state,
      action: PayloadAction<
        BookmarksState['first_bookmarks_fetched_at_timestamp']
      >,
    ) {
      state.first_bookmarks_fetched_at_timestamp = action.payload
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
      if (!state.bookmarks || !state.incoming_bookmarks || !action.payload)
        throw new Error('Some bookmarks should be there.')
      // Keeping incoming bookmarks up-to-date is important for filtering out lazy loaded bookmarks
      state.incoming_bookmarks.push(...action.payload)
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
      // state.bookmarks[action.payload.index] is an important check, without it we sometimes get error during fast tag changes
      if (!state.bookmarks || !state.bookmarks[action.payload.index]) return
      state.bookmarks[action.payload.index].render_height =
        action.payload.height
    },
    set_processing_progress(
      state,
      action: PayloadAction<BookmarksState['processing_progress']>,
    ) {
      state.processing_progress = action.payload
    },
    set_import_progress(
      state,
      action: PayloadAction<BookmarksState['import_progress']>,
    ) {
      state.import_progress = action.payload
    },
    set_bookmark_is_compact(
      state,
      action: PayloadAction<{ index: number; is_compact: boolean }>,
    ) {
      if (!state.bookmarks) return
      state.bookmarks[action.payload.index].is_compact =
        action.payload.is_compact
    },
    increment_bookmark_views(state, action: PayloadAction<{ index: number }>) {
      if (!state.bookmarks || !state.bookmarks[action.payload.index].views)
        return
      const bookmark = state.bookmarks[action.payload.index]
      state.bookmarks[action.payload.index] = {
        ...bookmark,
        views: bookmark.views ? bookmark.views + 1 : 1,
      }
    },
  },
})

export const bookmarks_actions = {
  ...bookmarks_slice.actions,
  ...thunks,
}
