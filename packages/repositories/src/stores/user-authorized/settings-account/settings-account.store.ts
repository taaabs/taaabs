import { configureStore } from '@reduxjs/toolkit'

const reducer = {}

export const configureSettingsAccountStore = () => {
  return configureStore({
    reducer,
  })
}

const settingsAccountStore = configureStore({ reducer })

export type SettingsAccountState = ReturnType<
  typeof settingsAccountStore.getState
>
export type SettingsAccountDispatch = typeof settingsAccountStore.dispatch
