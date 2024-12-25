import { Counts_Ro } from '@repositories/modules/counts/domain/types/counts.ro'
import * as thunks from './action-creators'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type Months = {
  yyyymm: number
  bookmark_count: number
  starred_count: number
  unsorted_count: number
}[]
export type Tags = Record<string, { name: string; yields: number }>

export type CountsState = {
  is_fetching?: boolean
  fetched_at_timestamp?: number
  should_refetch?: boolean
  counts_data?: Counts_Ro
  months?: Months
  tags?: Tags
  yyyymm_gte?: number
  yyyymm_lte?: number
}

const initial_state: CountsState = {}

export const counts_slice = createSlice({
  name: 'counts',
  initialState: initial_state,
  reducers: {
    set_is_fetching(state, action: PayloadAction<boolean>) {
      state.is_fetching = action.payload
    },
    set_fetched_at_timestamp(
      state,
      action: PayloadAction<CountsState['fetched_at_timestamp']>,
    ) {
      state.fetched_at_timestamp = action.payload
    },
    set_should_refetch(
      state,
      action: PayloadAction<CountsState['should_refetch']>,
    ) {
      state.should_refetch = action.payload
    },
    set_data(state, action: PayloadAction<Counts_Ro>) {
      state.counts_data = action.payload

      const months: Months = []

      if (!action.payload.months) return

      Object.entries(action.payload.months).forEach(([k, v]) => {
        months.push({
          yyyymm: parseInt(k),
          bookmark_count: v.bookmark_count,
          starred_count: v.starred_count || 0,
          unsorted_count: v.unsorted_count || 0,
        })
      })

      state.months = months
    },
    set_tags(state, action: PayloadAction<CountsState['tags']>) {
      state.tags = action.payload
    },
    set_yyyymm_gte(state, action: PayloadAction<CountsState['yyyymm_gte']>) {
      state.yyyymm_gte = action.payload
    },
    set_yyyymm_lte(state, action: PayloadAction<CountsState['yyyymm_lte']>) {
      state.yyyymm_lte = action.payload
    },
  },
})

export const counts_actions = {
  ...counts_slice.actions,
  ...thunks,
}
