import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserData } from '@taaabs/repositories/user-data/domain/entities/UserData'

import * as thunks from './action-creators'

type UserDataState = {
  isLoading: boolean
  userData?: UserData
}

const initialState: UserDataState = {
  isLoading: true,
}

const userDataSlice = createSlice({
  name: 'user-data',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setUserData(state, action: PayloadAction<any>) {
      state.userData = action.payload
    },
  },
})

export const UserDataActions = {
  ...userDataSlice.actions,
  ...thunks,
}

export default userDataSlice
