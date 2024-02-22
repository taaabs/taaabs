import {
  SettingsBackupsDispatch,
  SettingsBackupsState,
} from '@repositories/stores/settings-backups/settings-backups.store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const use_settings_backups_dispatch = () =>
  useDispatch<SettingsBackupsDispatch>()
export const use_settings_backups_selector: TypedUseSelectorHook<SettingsBackupsState> =
  useSelector
