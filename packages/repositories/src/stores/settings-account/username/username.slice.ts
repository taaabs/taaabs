import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'

type UsernameState = {
  is_getting_my_username: boolean
  my_username?: string
}

const initial_state: UsernameState = {
  is_getting_my_username: false,
}

export const username_slice = createSlice({
  name: 'username',
  initialState: initial_state,
  reducers: {
    set_is_getting_my_username(state, action: PayloadAction<boolean>) {
      state.is_getting_my_username = action.payload
    },
    set_my_username(state, action: PayloadAction<string>) {
      state.my_username = action.payload
    },
  },
})

export const username_actions = {
  ...username_slice.actions,
  ...thunks,
}
