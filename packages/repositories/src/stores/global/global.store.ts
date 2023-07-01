import { configureStore } from '@reduxjs/toolkit'

export const globalStore = configureStore({
  reducer: {},
})

export type GlobalState = ReturnType<typeof globalStore.getState>

export type GlobalDispatch = typeof globalStore.dispatch
