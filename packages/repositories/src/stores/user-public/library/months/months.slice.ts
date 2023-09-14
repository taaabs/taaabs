import { MonthsRo } from '@repositories/modules/months/domain/types/months.ro'
import * as thunks from './action-creators'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type Months = {
  yyyymm: number
  bookmark_count: number
  starred_count: number
  nsfw_count: number
}[]
export type Tags = Record<string, { id: number; yields: number }>

export type MonthsState = {
  is_getting_months_data: boolean
  months_data: MonthsRo.Public | null
  months_of_bookmark_creation: Months | null
  months_of_url_creation: Months | null
  tags_of_bookmark_creation: Tags | null
  tags_of_url_creation: Tags | null
  yyyymm_gte: number | null
  yyyymm_lte: number | null
}

const initial_state: MonthsState = {
  is_getting_months_data: false,
  months_data: null,
  months_of_bookmark_creation: null,
  months_of_url_creation: null,
  tags_of_bookmark_creation: null,
  tags_of_url_creation: null,
  yyyymm_gte: null,
  yyyymm_lte: null,
}

export const months_slice = createSlice({
  name: 'months',
  initialState: initial_state,
  reducers: {
    set_is_getting_data(state, action: PayloadAction<boolean>) {
      state.is_getting_months_data = action.payload
    },
    set_data(state, action: PayloadAction<MonthsRo.Public>) {
      state.months_data = action.payload

      const months_of_bookmark_creation: Months = []
      const months_of_url_creation: Months = []

      Object.entries(action.payload.created_at).forEach(([k, v]) => {
        months_of_bookmark_creation.push({
          yyyymm: parseInt(k),
          bookmark_count: v.bookmark_count,
          starred_count: v.starred_count || 0,
          nsfw_count: v.nsfw_count || 0,
        })
      })
      Object.entries(action.payload.updated_at).forEach(([k, v]) => {
        months_of_url_creation.push({
          yyyymm: parseInt(k),
          bookmark_count: v.bookmark_count,
          starred_count: v.starred_count || 0,
          nsfw_count: v.nsfw_count || 0,
        })
      })

      state.months_of_bookmark_creation = months_of_bookmark_creation
      state.months_of_url_creation = months_of_url_creation
    },
    set_tags_of_bookmark_creation(state, action: PayloadAction<Tags>) {
      state.tags_of_bookmark_creation = action.payload
    },
    set_tags_of_url_creation(state, action: PayloadAction<Tags>) {
      state.tags_of_url_creation = action.payload
    },
    set_yyyymm_gte(state, action: PayloadAction<MonthsState['yyyymm_gte']>) {
      state.yyyymm_gte = action.payload
    },
    set_yyyymm_lte(state, action: PayloadAction<MonthsState['yyyymm_lte']>) {
      state.yyyymm_lte = action.payload
    },
  },
})

export const months_actions = {
  ...months_slice.actions,
  ...thunks,
}
