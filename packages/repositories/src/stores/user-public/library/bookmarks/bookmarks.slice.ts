import { BookmarkEntity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'

type BookmarksState = {
  is_getting_data: boolean
  is_getting_first_bookmarks: boolean
  is_getting_more_bookmarks: boolean
  incoming_bookmarks: Array<BookmarkEntity.Public> | null
  bookmarks: Array<BookmarkEntity.Public> | null
  has_more_bookmarks: boolean | null
}

const initial_state: BookmarksState = {
  is_getting_data: false,
  is_getting_first_bookmarks: false,
  is_getting_more_bookmarks: false,
  incoming_bookmarks: null,
  bookmarks: null,
  has_more_bookmarks: null,
}

export const bookmarks_slice = createSlice({
  name: 'bookmarks',
  initialState: initial_state,
  reducers: {
    set_is_getting_data(state, action: PayloadAction<boolean>) {
      state.is_getting_data = action.payload
    },
    set_is_getting_first_bookmarks(state, action: PayloadAction<boolean>) {
      state.is_getting_first_bookmarks = action.payload
    },
    set_is_getting_more_bookmarks(state, action: PayloadAction<boolean>) {
      state.is_getting_more_bookmarks = action.payload
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
        throw 'Some bookmarks should be there.'
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
  },
})

export const bookmarks_actions = {
  ...bookmarks_slice.actions,
  ...thunks,
}
