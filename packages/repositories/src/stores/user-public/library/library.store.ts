import { configureStore } from '@reduxjs/toolkit'
import { bookmarks_slice } from './bookmarks/bookmarks.slice'
import { months_slice } from './months/months.slice'

const reducer = {
  bookmarks: bookmarks_slice.reducer,
  months: months_slice.reducer,
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
