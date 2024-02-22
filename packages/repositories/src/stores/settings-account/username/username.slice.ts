import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'

type UsernameState = {
  is_getting_current_username: boolean
  current_username?: string
}

const initial_state: UsernameState = {
  is_getting_current_username: false,
}

export const username_slice = createSlice({
  name: 'username',
  initialState: initial_state,
  reducers: {
    set_is_getting_my_username(
      state,
      action: PayloadAction<UsernameState['is_getting_current_username']>,
    ) {
      state.is_getting_current_username = action.payload
    },
    set_current_username(
      state,
      action: PayloadAction<UsernameState['current_username']>,
    ) {
      state.current_username = action.payload
    },
  },
})

export const username_actions = {
  ...username_slice.actions,
  ...thunks,
}
