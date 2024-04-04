import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'
import { system_values } from '@shared/constants/system-values'

type BookmarksState = {
  is_fetching: boolean
  is_updating_bookmarks: boolean
  is_fetching_first_bookmarks: boolean
  first_bookmarks_fetched_at_timestamp?: number // Used for synchronization of pinned links re-render.
  is_fetching_more_bookmarks: boolean
  showing_bookmarks_fetched_by_ids?: boolean
  incoming_bookmarks: Bookmark_Entity[] | null
  bookmarks: Bookmark_Entity[] | null
  has_more_bookmarks: boolean | null
  processing_progress?: number // Filling tag combinations and generating counts.
  import_progress?: number
  should_refetch_counts?: boolean
  density: 'default' | 'compact'
}

const initial_state: BookmarksState = {
  is_fetching: false,
  is_updating_bookmarks: false,
  is_fetching_first_bookmarks: false,
  is_fetching_more_bookmarks: false,
  incoming_bookmarks: null,
  bookmarks: null,
  has_more_bookmarks: null,
  density: 'default',
}

export const bookmarks_slice = createSlice({
  name: 'bookmarks',
  initialState: initial_state,
  reducers: {
    set_is_fetching(state, action: PayloadAction<boolean>) {
      state.is_fetching = action.payload
    },
    set_is_updating_bookmarks(state, action: PayloadAction<boolean>) {
      state.is_updating_bookmarks = action.payload
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
      // Keeping incoming bookmarks up-to-date is important for filtering out lazy loaded bookmarks.
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
      if (!state.bookmarks) return
      state.bookmarks[action.payload.index].render_height =
        action.payload.height
    },
    set_should_refetch_counts(
      state,
      action: PayloadAction<BookmarksState['should_refetch_counts']>,
    ) {
      state.should_refetch_counts = action.payload
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
    set_density(state, action: PayloadAction<BookmarksState['density']>) {
      state.density = action.payload
    },
    set_density_of_current_bookmarks(
      state,
      action: PayloadAction<BookmarksState['density']>,
    ) {
      state.density = action.payload
      if (state.bookmarks) {
        state.bookmarks = state.bookmarks
          .slice(0, system_values.library.bookmarks.per_page)
          .map((bookmark) => ({
            ...bookmark,
            render_height: undefined,
            is_compact: action.payload == 'compact',
          }))
      }
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
