import { MonthsRo } from '@repositories/modules/months/domain/types/months.ro'
import * as thunks from './action-creators'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type Months = {
  yymm: number
  bookmarkCount: number
  starredCount: number | null
  nsfwCount: number | null
}[]
export type Tags = Record<string, number>

export type MonthsState = {
  isGettingData: boolean
  data: MonthsRo.Public | null
  monthsOfBookmarkCreation: Months
  monthsOfUrlCreation: Months
  yymmStart: number | null
  yymmEnd: number | null
  tags: Tags | null
}

const initialState: MonthsState = {
  isGettingData: false,
  data: null,
  monthsOfBookmarkCreation: [],
  monthsOfUrlCreation: [],
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

      Object.entries(action.payload.monthsOfBookmarkCreation).forEach(
        ([k, v]) => {
          state.monthsOfBookmarkCreation.push({
            yymm: parseInt(k),
            bookmarkCount: v.bookmarkCount,
            starredCount: v.starredCount,
            nsfwCount: v.nsfwCount,
          })
        },
      )

      Object.entries(action.payload.monthsOfUrlCreation).forEach(([k, v]) => {
        state.monthsOfUrlCreation.push({
          yymm: parseInt(k),
          bookmarkCount: v.bookmarkCount,
          starredCount: v.starredCount,
          nsfwCount: v.nsfwCount,
        })
      })
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
