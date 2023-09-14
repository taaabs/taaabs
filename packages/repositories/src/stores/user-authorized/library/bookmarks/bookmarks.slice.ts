import { BookmarkEntity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import * as thunks from './action-creators'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type BookmarksState = {
  isGettingData: boolean
  is_getting_first_bookmarks: boolean
  is_getting_more_bookmarks: boolean
  incomingBookmarks: Array<BookmarkEntity.Authorized> | null
  bookmarks: Array<BookmarkEntity.Authorized> | null
  has_more_bookmarks: boolean | null
}

const initialState: BookmarksState = {
  isGettingData: false,
  is_getting_first_bookmarks: false,
  is_getting_more_bookmarks: false,
  incomingBookmarks: null,
  bookmarks: null,
  has_more_bookmarks: null,
}

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setIsGettingData(state, action: PayloadAction<boolean>) {
      state.isGettingData = action.payload
    },
    setIsGettingFirstBookmarks(state, action: PayloadAction<boolean>) {
      state.is_getting_first_bookmarks = action.payload
    },
    setIsGettingMoreBookmarks(state, action: PayloadAction<boolean>) {
      state.is_getting_more_bookmarks = action.payload
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
      state.bookmarks!.push
    },
    setHasMoreBookmarks(
      state,
      action: PayloadAction<BookmarksState['has_more_bookmarks']>,
    ) {
      state.has_more_bookmarks = action.payload
    },
  },
})

export const bookmarksActions = {
  ...bookmarksSlice.actions,
  ...thunks,
}
