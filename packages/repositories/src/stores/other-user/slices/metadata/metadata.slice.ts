import { MetadataRo } from '@/modules/metadata/domain/types/metadata.ro'
import * as thunks from './action-creators'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type MetadataState = {
  isFetchingMetadata: boolean
  metadata: MetadataRo.Public | null
}

const initialMetadataState: MetadataState = {
  isFetchingMetadata: false,
  metadata: null,
}

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState: initialMetadataState,
  reducers: {
    setIsFetchingMetadata(state, action: PayloadAction<boolean>) {
      state.isFetchingMetadata = action.payload
    },
    setMetadata(state, action: PayloadAction<MetadataState['metadata']>) {
      state.metadata = action.payload
    },
  },
})

export const metadataActions = {
  ...metadataSlice.actions,
  ...thunks,
}
