import { Months_Ro } from '@repositories/modules/months/domain/types/months.ro'
import * as thunks from './action-creators'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Months_Params } from '@repositories/modules/months/domain/types/months.params'

export type Months = {
  yyyymm: number
  bookmark_count: number
  starred_count: number
  nsfw_count: number
}[]
export type Tags = Record<string, { id: number; yields: number }>

export type MonthsState = {
  is_getting_months_data: boolean
  months_data: Months_Ro | null
  months: Months | null
  tags: Tags | null
  yyyymm_gte: number | null
  yyyymm_lte: number | null
  last_authorized_months_params?: Months_Params.Authorized
}

const initial_state: MonthsState = {
  is_getting_months_data: false,
  months_data: null,
  months: null,
  tags: null,
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
    set_data(state, action: PayloadAction<Months_Ro>) {
      state.months_data = action.payload

      const months: Months = []

      if (!action.payload.months) return

      Object.entries(action.payload.months).forEach(([k, v]) => {
        months.push({
          yyyymm: parseInt(k),
          bookmark_count: v.bookmark_count,
          starred_count: v.starred_count || 0,
          nsfw_count: v.nsfw_count || 0,
        })
      })

      state.months = months
    },
    set_tags(state, action: PayloadAction<Tags>) {
      state.tags = action.payload
    },
    set_yyyymm_gte(state, action: PayloadAction<MonthsState['yyyymm_gte']>) {
      state.yyyymm_gte = action.payload
    },
    set_yyyymm_lte(state, action: PayloadAction<MonthsState['yyyymm_lte']>) {
      state.yyyymm_lte = action.payload
    },
    set_last_authorized_months_params(
      state,
      action: PayloadAction<MonthsState['last_authorized_months_params']>,
    ) {
      state.last_authorized_months_params = action.payload
    },
  },
})

export const months_actions = {
  ...months_slice.actions,
  ...thunks,
}
