import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as thunks from './action-creators'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { Sortby } from '@shared/types/modules/bookmarks/sortby'
import { Order } from '@shared/types/modules/bookmarks/order'

type SearchState = {
  is_getting_search_data: boolean
  filter?: LibraryFilter
  tags?: number[]
  sortby?: Sortby
  order?: Order
  yyyymm_gte?: number
  yyyymm_lte?: number
  search_string?: string
}

const initial_state: SearchState = {
  is_getting_search_data: false,
}

export const search_slice = createSlice({
  name: 'search',
  initialState: initial_state,
  reducers: {
    set_is_getting_search_data(
      state,
      action: PayloadAction<SearchState['is_getting_search_data']>,
    ) {
      state.is_getting_search_data = action.payload
    },
    set_filter(state, action: PayloadAction<SearchState['filter']>) {
      state.filter = action.payload
    },
    set_tags(state, action: PayloadAction<SearchState['tags']>) {
      state.tags = action.payload
    },
    set_sortby(state, action: PayloadAction<SearchState['sortby']>) {
      state.sortby = action.payload
    },
    set_order(state, action: PayloadAction<SearchState['order']>) {
      state.order = action.payload
    },
    set_yyyymm_gte(state, action: PayloadAction<SearchState['yyyymm_gte']>) {
      state.yyyymm_gte = action.payload
    },
    set_yyyymm_lte(state, action: PayloadAction<SearchState['yyyymm_lte']>) {
      state.yyyymm_lte = action.payload
    },
    set_search_string(
      state,
      action: PayloadAction<SearchState['search_string']>,
    ) {
      state.search_string = action.payload
    },
  },
})

export const search_actions = {
  ...search_slice.actions,
  ...thunks,
}
