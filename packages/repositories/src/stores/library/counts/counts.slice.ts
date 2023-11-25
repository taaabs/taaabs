import { Months_Ro } from '@repositories/modules/months/domain/types/months.ro'
import * as thunks from './action-creators'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type Months = {
  yyyymm: number
  bookmark_count: number
  starred_count: number
  unread_count: number
}[]
export type Tags = Record<string, { id: number; yields: number }>

export type CountsState = {
  is_fetching_counts_data: boolean
  counts_data: Months_Ro | null
  months: Months | null
  tags: Tags | null
  yyyymm_gte: number | null
  yyyymm_lte: number | null
}

const initial_state: CountsState = {
  is_fetching_counts_data: false,
  counts_data: null,
  months: null,
  tags: null,
  yyyymm_gte: null,
  yyyymm_lte: null,
}

export const counts_slice = createSlice({
  name: 'counts',
  initialState: initial_state,
  reducers: {
    set_is_fetching_data(state, action: PayloadAction<boolean>) {
      state.is_fetching_counts_data = action.payload
    },
    set_data(state, action: PayloadAction<Months_Ro>) {
      state.counts_data = action.payload

      const months: Months = []

      if (!action.payload.months) return

      Object.entries(action.payload.months).forEach(([k, v]) => {
        months.push({
          yyyymm: parseInt(k),
          bookmark_count: v.bookmark_count,
          starred_count: v.starred_count || 0,
          unread_count: v.unread_count || 0,
        })
      })

      state.months = months
    },
    set_tags(state, action: PayloadAction<Tags>) {
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
