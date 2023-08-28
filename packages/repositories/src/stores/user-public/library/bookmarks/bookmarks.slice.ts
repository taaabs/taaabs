import { BookmarkEntity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'

type BookmarksState = {
  isGettingData: boolean
  isGettingFirstBookmarks: boolean
  isGettingMoreBookmarks: boolean
  incomingBookmarks: Array<BookmarkEntity.Public> | null
  bookmarks: Array<BookmarkEntity.Public> | null
  hasMoreBookmarks: boolean | null
}

const initialState: BookmarksState = {
  isGettingData: false,
  isGettingFirstBookmarks: false,
  isGettingMoreBookmarks: false,
  incomingBookmarks: null,
  bookmarks: null,
  hasMoreBookmarks: null,
}

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setIsGettingData(state, action: PayloadAction<boolean>) {
      state.isGettingData = action.payload
    },
    setIsGettingFirstBookmarks(state, action: PayloadAction<boolean>) {
      state.isGettingFirstBookmarks = action.payload
    },
    setIsGettingMoreBookmarks(state, action: PayloadAction<boolean>) {
      state.isGettingMoreBookmarks = action.payload
    },
    setIncomingBookmarks(
      state,
      action: PayloadAction<BookmarksState['incomingBookmarks']>,
    ) {
      state.incomingBookmarks = action.payload
    },
    setBookmarks(state, action: PayloadAction<BookmarksState['bookmarks']>) {
      state.bookmarks = action.payload
    },
    setMoreBookmarks(
      state,
      action: PayloadAction<BookmarksState['bookmarks']>,
    ) {
      if (!state.bookmarks || !action.payload)
        throw 'Some bookmarks should be there.'
      state.bookmarks.push(...action.payload)
    },
    setHasMoreBookmarks(
      state,
      action: PayloadAction<BookmarksState['hasMoreBookmarks']>,
    ) {
      state.hasMoreBookmarks = action.payload
    },
    setBookmarkRenderHeight(
      state,
      action: PayloadAction<{ index: number; height: number }>,
    ) {
      if (!state.bookmarks) return
      state.bookmarks[action.payload.index].renderHeight = action.payload.height
    },
  },
})

export const bookmarksActions = {
  ...bookmarksSlice.actions,
  ...thunks,
}
