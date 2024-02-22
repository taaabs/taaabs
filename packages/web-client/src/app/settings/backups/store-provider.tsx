'use client'

import { configure_settings_backup_store } from '@repositories/stores/settings-backups/settings-backups.store'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'

export const StoreProvider: React.FC<{ children: ReactNode }> = (props) => {
  const store = configure_settings_backup_store()

  return <Provider store={store}>{props.children}</Provider>
}
