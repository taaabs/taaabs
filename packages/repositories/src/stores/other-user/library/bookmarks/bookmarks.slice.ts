import { BookmarkEntity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'

type BookmarksState = {
  isGettingFirstBookmarks: boolean
  isGettingMoreBookmarks: boolean
  bookmarks: Array<BookmarkEntity.Public> | null
  hasMoreBookmarks: boolean | null
}

const initialState: BookmarksState = {
  isGettingFirstBookmarks: false,
  isGettingMoreBookmarks: false,
  bookmarks: null,
  hasMoreBookmarks: null,
}

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setIsGettingFirstBookmarks(state, action: PayloadAction<boolean>) {
      state.isGettingFirstBookmarks = action.payload
    },
    setIsGettingMoreBookmarks(state, action: PayloadAction<boolean>) {
      state.isGettingMoreBookmarks = action.payload
    },
    setBookmarks(state, action: PayloadAction<BookmarksState['bookmarks']>) {
      state.bookmarks = action.payload
    },
    setHasMoreBookmarks(state, action: PayloadAction<boolean>) {
      state.hasMoreBookmarks = action.payload
    },
  },
})

export const bookmarksActions = {
  ...bookmarksSlice.actions,
  ...thunks,
}
