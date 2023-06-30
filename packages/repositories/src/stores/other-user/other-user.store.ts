import { configureStore } from '@reduxjs/toolkit'
import { metadataSlice } from './slices/metadata/metadata.slice'

const store = configureStore({
  reducer: {
    metadata: metadataSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
