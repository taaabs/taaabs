import { configureStore } from '@reduxjs/toolkit'
import { backups_slice } from './backups/backups.slice'

const reducer = {
  backups: backups_slice.reducer,
}

export const configure_settings_backup_store = () => {
  return configureStore({
    reducer,
  })
}

const settings_backups_store = configureStore({ reducer })

export type SettingsBackupsState = ReturnType<
  typeof settings_backups_store.getState
>
export type SettingsBackupsDispatch = typeof settings_backups_store.dispatch
