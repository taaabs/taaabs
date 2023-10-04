'use client'

import { configure_settings_account_store } from '@repositories/stores/settings-account/settings-account.store'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'

export const SettingsAccountStoreProvider: React.FC<{ children: ReactNode }> = (
  props,
) => {
  const store = configure_settings_account_store()

  return <Provider store={store}>{props.children}</Provider>
}
