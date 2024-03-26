import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PinnedLink_Entity } from '@repositories/modules/pinned/domain/entities/pinned-link.entity'
import * as thunks from './action-creators'

type PinnedState = {
  is_fetching?: boolean
  fetched_at_timestamp?: number
  is_updating?: boolean
  items?: PinnedLink_Entity[]
}

const initial_state: PinnedState = {}

export const pinned_slice = createSlice({
  name: 'pinned',
  initialState: initial_state,
  reducers: {
    set_is_fetching(state, action: PayloadAction<PinnedState['is_fetching']>) {
      state.is_fetching = action.payload
    },
    set_fetched_at_timestamp(
      state,
      action: PayloadAction<PinnedState['fetched_at_timestamp']>,
    ) {
      state.fetched_at_timestamp = action.payload
    },
    set_is_updating(state, action: PayloadAction<PinnedState['is_updating']>) {
      state.is_updating = action.payload
    },
    set_items(state, action: PayloadAction<PinnedState['items']>) {
      state.items = action.payload
    },
  },
})

export const pinned_actions = {
  ...pinned_slice.actions,
  ...thunks,
}
