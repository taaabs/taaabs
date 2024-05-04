import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'

type Backup = {
  id: number
  created_at: string
  name?: string
}

type BackupsState = {
  is_fetching_backups: boolean
  backups?: Backup[]
}

const initial_state: BackupsState = {
  is_fetching_backups: false,
}

export const backups_slice = createSlice({
  name: 'backups',
  initialState: initial_state,
  reducers: {
    set_is_fetching_backups(
      state,
      action: PayloadAction<BackupsState['is_fetching_backups']>,
    ) {
      state.is_fetching_backups = action.payload
    },
    set_backups(state, action: PayloadAction<BackupsState['backups']>) {
      state.backups = action.payload
    },
  },
})

export const backups_actions = {
  ...backups_slice.actions,
  ...thunks,
}
