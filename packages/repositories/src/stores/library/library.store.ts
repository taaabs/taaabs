import { configureStore } from '@reduxjs/toolkit'
import { bookmarks_slice } from './bookmarks/bookmarks.slice'
import { counts_slice } from './counts/counts.slice'
import { tag_hierarchies_slice } from './tag-hierarchies/tag-hierarchies.slice'
import { pinned_slice } from './pinned/pinned.slice'

const reducer = {
  bookmarks: bookmarks_slice.reducer,
  counts: counts_slice.reducer,
  tag_hierarchies: tag_hierarchies_slice.reducer,
  pinned: pinned_slice.reducer,
}

export const configure_library_store = () => {
  return configureStore({
    reducer,
  })
}

const libraryStore = configureStore({
  reducer,
})

export type LibraryState = ReturnType<typeof libraryStore.getState>
export type LibraryDispatch = typeof libraryStore.dispatch
