import { configureStore } from '@reduxjs/toolkit'
import { librarySlice } from './features/library/library.slice'

export const otherUserStore = configureStore({
  reducer: {
    library: librarySlice.reducer,
  },
})

export type OtherUserState = ReturnType<typeof otherUserStore.getState>
export type OtherUserDispatch = typeof otherUserStore.dispatch
