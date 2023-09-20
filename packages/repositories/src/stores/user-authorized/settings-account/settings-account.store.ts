import { configureStore } from '@reduxjs/toolkit'
import { username_slice } from './username/username.slice'

const reducer = {
  username: username_slice.reducer,
}

export const configure_settings_account_store = () => {
  return configureStore({
    reducer,
  })
}

const settings_account_store = configureStore({ reducer })

export type SettingsAccountState = ReturnType<
  typeof settings_account_store.getState
>
export type SettingsAccountDispatch = typeof settings_account_store.dispatch
