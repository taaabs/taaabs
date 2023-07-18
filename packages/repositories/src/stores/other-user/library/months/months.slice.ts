import { MonthsRo } from '@repositories/modules/months/domain/types/months.ro'
import * as thunks from './action-creators'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type Months = {
  yymm: number
  bookmarksCount: number
}[]

type Tags = [string, number][]

export type MonthsState = {
  isGettingData: boolean
  data: MonthsRo.Public | null
  monthsOfBookmarkCreation: Months | null
  monthsOfUrlCreation: Months | null
  yymmStart: number | null
  yymmEnd: number | null
  tags: Tags | null
}

const initialState: MonthsState = {
  isGettingData: false,
  data: null,
  monthsOfBookmarkCreation: null,
  monthsOfUrlCreation: null,
  yymmStart: null,
  yymmEnd: null,
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

      state.monthsOfBookmarkCreation =
        action.payload.monthsOfBookmarkCreation.map((month) => ({
          yymm: month.yymm,
          bookmarksCount: month.bookmarkCount,
        }))

      state.monthsOfUrlCreation = action.payload.monthsOfUrlCreation.map(
        (month) => ({
          yymm: month.yymm,
          bookmarksCount: month.bookmarkCount,
        }),
      )
    },
    setYymmStart(state, action: PayloadAction<number>) {
      state.yymmStart = action.payload
    },
    setYymmEnd(state, action: PayloadAction<number>) {
      state.yymmEnd = action.payload
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
