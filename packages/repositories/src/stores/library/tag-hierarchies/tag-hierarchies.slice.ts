import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TagHierarchyNode_Entity } from '@repositories/modules/tag-hierarchies/domain/entities/tag-hierarchy.entity'

import * as thunks from './action-creators'

type TagHierarchiesState = {
  is_fetching?: boolean
  is_updating?: boolean
  tree?: TagHierarchyNode_Entity[]
}

const initial_state: TagHierarchiesState = {}

export const tag_hierarchies_slice = createSlice({
  name: 'tag-hierarchies',
  initialState: initial_state,
  reducers: {
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
    set_tree(state, action: PayloadAction<TagHierarchiesState['tree']>) {
      state.tree = action.payload
    },
  },
})

export const tag_hierarchies_actions = {
  ...tag_hierarchies_slice.actions,
  ...thunks,
}
