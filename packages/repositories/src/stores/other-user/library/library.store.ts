import { configureStore } from '@reduxjs/toolkit'
import { bookmarksSlice } from './bookmarks/bookmarks.slice'

const reducer = {
  bookmarks: bookmarksSlice.reducer,
}

export const configureLibraryStore = () => {
  return configureStore({
    reducer,
  })
}

const libraryStore = configureStore({
  reducer,
})

export type LibraryState = ReturnType<typeof libraryStore.getState>
export type LibraryDispatch = typeof libraryStore.dispatch
