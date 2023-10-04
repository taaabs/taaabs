import {
  SettingsAccountDispatch,
  SettingsAccountState,
} from '@repositories/stores/settings-account/settings-account.store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const use_settings_account_dispatch = () =>
  useDispatch<SettingsAccountDispatch>()
export const use_settings_account_selector: TypedUseSelectorHook<SettingsAccountState> =
  useSelector
