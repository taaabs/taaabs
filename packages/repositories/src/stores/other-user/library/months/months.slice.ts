import { MonthsRo } from '@repositories/modules/months/domain/types/months.ro'
import * as thunks from './action-creators'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type Months = {
  yymm: number
  bookmarkCount: number
  starredCount: number
  nsfwCount: number
}[]
export type Tags = Record<string, number>

export type MonthsState = {
  isGettingData: boolean
  data: MonthsRo.Public | null
  monthsOfBookmarkCreation: Months
  monthsOfUrlCreation: Months
  tags: Tags | null
}

const initialState: MonthsState = {
  isGettingData: false,
  data: null,
  monthsOfBookmarkCreation: [],
  monthsOfUrlCreation: [],
  tags: null,
}

export const monthsSlice = createSlice({
  name: 'months',
  initialState,
  reducers: {
    setIsGettingData(state, action: PayloadAction<boolean>) {
      state.isGettingData = action.payload
    },
    setData(state, action: PayloadAction<MonthsRo.Public>) {
      state.data = action.payload
      state.monthsOfBookmarkCreation = []
      state.monthsOfUrlCreation = []

      Object.entries(action.payload.monthsOfBookmarkCreation).forEach(
        ([k, v]) => {
          state.monthsOfBookmarkCreation.push({
            yymm: parseInt(k),
            bookmarkCount: v.bookmarkCount,
            starredCount: v.starredCount || 0,
            nsfwCount: v.nsfwCount || 0,
          })
        },
      )

      Object.entries(action.payload.monthsOfUrlCreation).forEach(([k, v]) => {
        state.monthsOfUrlCreation.push({
          yymm: parseInt(k),
          bookmarkCount: v.bookmarkCount,
          starredCount: v.starredCount || 0,
          nsfwCount: v.nsfwCount || 0,
        })
      })
    },
    setTags(state, action: PayloadAction<Tags>) {
      state.tags = action.payload
    },
  },
})

export const monthsActions = {
  ...monthsSlice.actions,
  ...thunks,
}
