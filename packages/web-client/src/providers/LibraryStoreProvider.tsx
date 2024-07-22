'use client'

import { configure_library_store } from '@repositories/stores/library/library.store'
import { Provider } from 'react-redux'

export const LibraryStoreProvider: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const store = configure_library_store()

  return <Provider store={store}>{props.children as JSX.Element}</Provider>
}
