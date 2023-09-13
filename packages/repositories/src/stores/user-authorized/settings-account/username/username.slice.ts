import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type UsernameState = {
  isGettingCurrentUsername: boolean
  currentUsername?: string
  newUsername?: string
  isCheckingUsernameAvailability: boolean
  isNewUsernameAvailable?: boolean
}

const initialState: UsernameState = {
  isGettingCurrentUsername: false,
  isCheckingUsernameAvailability: false,
}

export const usernameSlice = createSlice({
  name: 'username',
  initialState,
  reducers: {
    setIsGettingCurrentUsername(state, action: PayloadAction<boolean>) {
      state.isGettingCurrentUsername = action.payload
    },
    setCurrentUsername(state, action: PayloadAction<string>) {
      state.currentUsername = action.payload
    },
    setNewUsername(state, action: PayloadAction<string>) {
      state.newUsername = action.payload
    },
    setIsCheckingUsernameAvailability(state, action: PayloadAction<boolean>) {
      state.isCheckingUsernameAvailability = action.payload
    },
    setIsNewUsernameAvailable(state, action: PayloadAction<boolean>) {
      state.isNewUsernameAvailable = action.payload
    },
  },
})

export const usernameActions = {
  ...usernameSlice.actions,
}
