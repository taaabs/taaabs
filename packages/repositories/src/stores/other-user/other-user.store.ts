import { configureStore } from '@reduxjs/toolkit'
import { metadataSlice } from './features/metadata/metadata.slice'
import { librarySlice } from './features/library/library.slice'

const store = configureStore({
  reducer: {
    metadata: metadataSlice.reducer,
    library: librarySlice.reducer,
  },
})

export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch
export default store
