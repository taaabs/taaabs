import { configureStore } from '@reduxjs/toolkit'
import { metadataSlice } from './slices/metadata/metadata.slice'
import { librarySlice } from './slices/library/library.slice'

const store = configureStore({
  reducer: {
    metadata: metadataSlice.reducer,
    library: librarySlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
