import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserData } from '../../../../../../repositories/src/user-data/domain/entities/UserData'

import * as thunks from './action-creators'

type UserDataState = {
  isLoading: boolean
  userData?: UserData
}

const initialUserDataState: UserDataState = {
  isLoading: true,
}

const UserDataSlice = createSlice({
  name: 'user-data',
  initialState: initialUserDataState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    // setUserData(state, action: PayloadAction<UserDataDto>) {
    //   state.userData = action.payload
    // },
  },
})

export const UserDataActions = {
  ...UserDataSlice.actions,
  ...thunks,
}

export default UserDataSlice
