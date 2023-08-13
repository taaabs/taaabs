import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { MonthsRo } from '@repositories/modules/months/domain/types/months.ro'
import * as thunks from './action-creators'

export type Months = {
  yyyymm: number
  bookmarkCount: number
  starredCount: number
  nsfwCount: number
}[]
export type Tags = Record<string, number>

export type MonthsState = {
  isGettingMonthsData: boolean
  monthsData: MonthsRo.Public | null
  monthsOfBookmarkCreation: Months | null
  monthsOfUrlCreation: Months | null
  tagsOfBookmarkCreation: Tags | null
  tagsOfUrlCreation: Tags | null
  yyyymmGte: number | null
  yyyymmLte: number | null
}

const initialState: MonthsState = {
  isGettingMonthsData: false,
  monthsData: null,
  monthsOfBookmarkCreation: null,
  monthsOfUrlCreation: null,
  tagsOfBookmarkCreation: null,
  tagsOfUrlCreation: null,
  yyyymmGte: null,
  yyyymmLte: null,
}

export const monthsSlice = createSlice({
  name: 'months',
  initialState,
  reducers: {
    setIsGettingData(state, action: PayloadAction<boolean>) {
      state.isGettingMonthsData = action.payload
    },
    setData(state, action: PayloadAction<MonthsRo.Authorized>) {
      state.monthsData = action.payload

      const monthsOfBookmarkCreation: Months = []
      const monthsOfUrlCreation: Months = []

      Object.entries(action.payload.monthsOfBookmarkCreation).forEach(
        ([k, v]) => {
          monthsOfBookmarkCreation.push({
            yyyymm: parseInt(k),
            bookmarkCount: v.bookmarkCount,
            starredCount: v.starredCount || 0,
            nsfwCount: v.nsfwCount || 0,
          })
        },
      )
      Object.entries(action.payload.monthsOfUrlCreation).forEach(([k, v]) => {
        monthsOfUrlCreation.push({
          yyyymm: parseInt(k),
          bookmarkCount: v.bookmarkCount,
          starredCount: v.starredCount || 0,
          nsfwCount: v.nsfwCount || 0,
        })
      })

      state.monthsOfBookmarkCreation = monthsOfBookmarkCreation
      state.monthsOfUrlCreation = monthsOfUrlCreation
    },
    setTagsOfBookmarkCreation(state, action: PayloadAction<Tags>) {
      state.tagsOfBookmarkCreation = action.payload
    },
    setTagsOfUrlCreation(state, action: PayloadAction<Tags>) {
      state.tagsOfUrlCreation = action.payload
    },
    setYyyymmGte(state, action: PayloadAction<MonthsState['yyyymmGte']>) {
      state.yyyymmGte = action.payload
    },
    setYyyymmLte(state, action: PayloadAction<MonthsState['yyyymmLte']>) {
      state.yyyymmLte = action.payload
    },
  },
})

export const monthsActions = {
  ...monthsSlice.actions,
  ...thunks,
}
