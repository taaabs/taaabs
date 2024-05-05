'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import Library from '../library'
import { useContext } from 'react'
import { GlobalLibarySearchContext } from '@/app/global-library-search-provider'

namespace LibraryWrapper {
  export type Props = {
    dictionary: Dictionary
  }
}

export const LibraryWrapper: React.FC<LibraryWrapper.Props> = (props) => {
  const global_library_search = useContext(GlobalLibarySearchContext)
  return (
    <Library
      dictionary={props.dictionary}
      search_hook={global_library_search!.search_hook}
    />
  )
}
