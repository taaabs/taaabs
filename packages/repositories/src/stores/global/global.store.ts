import { combineReducers, configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({})

export const globalStore = configureStore({
  reducer: rootReducer,
})

export type GlobalState = ReturnType<typeof globalStore.getState>

export type GlobalDispatch = typeof globalStore.dispatch
