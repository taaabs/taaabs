import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { metadataSlice } from './features/metadata/metadata.slice'
import { librarySlice } from './features/library/library.slice'

// const rootReducer = combineReducers({})

export const otherUserStore = configureStore({
  reducer: {
    metadata: metadataSlice.reducer,
    library: librarySlice.reducer,
  },
})

export type OtherUserState = ReturnType<typeof otherUserStore.getState>
export type OtherUserDispatch = typeof otherUserStore.dispatch
