import { MonthsRo } from '@repositories/modules/months/domain/types/months.ro'
import * as thunks from './action-creators'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type Months = {
  yyyymm: number
  bookmarkCount: number
  starredCount: number
  nsfwCount: number
}[]
export type Tags = Record<string, number>

export type MonthsState = {
  isGettingData: boolean
  data: MonthsRo.Public | null
  monthsOfBookmarkCreation: Months | null
  monthsOfUrlCreation: Months | null
  tags: Tags | null
}

const initialState: MonthsState = {
  isGettingData: false,
  data: null,
  monthsOfBookmarkCreation: null,
  monthsOfUrlCreation: null,
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
    setTags(state, action: PayloadAction<Tags>) {
      state.tags = action.payload
    },
  },
})

export const monthsActions = {
  ...monthsSlice.actions,
  ...thunks,
}
