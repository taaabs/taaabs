import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as thunks from './action-creators'
import { TagHierarchy_Entity } from '@repositories/modules/tag-hierarchies/domain/entities/tag-hierarchy.entity'

type TagHierarchiesState = {
  is_fetching?: boolean
  is_updating?: boolean
  fetched_at_timestamp?: number
  total?: number
  tag_hierarchies?: TagHierarchy_Entity[]
}

const initial_state: TagHierarchiesState = {}

export const tag_hierarchies_slice = createSlice({
  name: 'tag-hierarchies',
  initialState: initial_state,
  reducers: {
    set_is_fetching(
      state,
      action: PayloadAction<TagHierarchiesState['is_fetching']>,
    ) {
      state.is_fetching = action.payload
    },
    set_is_updating(
      state,
      action: PayloadAction<TagHierarchiesState['is_updating']>,
    ) {
      state.is_updating = action.payload
    },
    set_fetched_at_timestamp(
      state,
      action: PayloadAction<TagHierarchiesState['fetched_at_timestamp']>,
    ) {
      state.fetched_at_timestamp = action.payload
    },
    set_total(state, action: PayloadAction<TagHierarchiesState['total']>) {
      state.total = action.payload
    },
    set_tag_hierarchies(
      state,
      action: PayloadAction<TagHierarchiesState['tag_hierarchies']>,
    ) {
      state.tag_hierarchies = action.payload
    },
  },
})

export const tag_hierarchies_actions = {
  ...tag_hierarchies_slice.actions,
  ...thunks,
}
