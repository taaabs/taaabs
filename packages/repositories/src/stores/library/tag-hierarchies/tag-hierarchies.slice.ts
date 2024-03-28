import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as thunks from './action-creators'
import { TagHierarchy_Entity } from '@repositories/modules/tag-hierarchies/domain/entities/tag-hierarchy.entity'

type TagHierarchiesState = {
  is_initialized?: boolean
  is_fetching?: boolean
  is_updating?: boolean
  total?: number
  tag_hierarchies?: TagHierarchy_Entity[]
}

const initial_state: TagHierarchiesState = {}

export const tag_hierarchies_slice = createSlice({
  name: 'tag-hierarchies',
  initialState: initial_state,
  reducers: {
    set_is_initialized(
      state,
      action: PayloadAction<TagHierarchiesState['is_initialized']>,
    ) {
      state.is_initialized = action.payload
    },
    set_is_fetching_data(
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
