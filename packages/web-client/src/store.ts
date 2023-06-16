import { configureStore } from '@reduxjs/toolkit'
import UserDataSlice from './features/user-data/presentation/redux/user-data.slice'

const store = configureStore({
  reducer: {
    userData: UserDataSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
