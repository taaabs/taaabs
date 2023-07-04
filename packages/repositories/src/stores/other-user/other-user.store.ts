import { configureStore } from '@reduxjs/toolkit'
import { otherUserLibrarySlice } from './features/library/library.slice'

export const otherUserStore = configureStore({
  reducer: {
    library: otherUserLibrarySlice.reducer,
  },
})

export type OtherUserState = ReturnType<typeof otherUserStore.getState>
export type OtherUserDispatch = typeof otherUserStore.dispatch
