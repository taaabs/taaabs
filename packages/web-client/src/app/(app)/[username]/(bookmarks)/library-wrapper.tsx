'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import { useContext } from 'react'
import Library from '../../library'
import { PublicUserLibarySearchContext } from '../public-user-library-search-provider'

namespace LibraryWrapper {
  export type Props = {
    dictionary: Dictionary
  }
}

export const LibraryWrapper: React.FC<LibraryWrapper.Props> = (props) => {
  const public_user_library_search = useContext(PublicUserLibarySearchContext)
  return (
    <Library
      dictionary={props.dictionary}
      search_hook={public_user_library_search!.search_hook}
    />
  )
}
