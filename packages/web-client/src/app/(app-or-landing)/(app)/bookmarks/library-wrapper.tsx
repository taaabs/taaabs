'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import Library from '../library'
import { useContext } from 'react'
import { LocalDbContext } from '../../../local-db-provider'

namespace LibraryWrapper {
  export type Props = {
    dictionary: Dictionary
  }
}

export const LibraryWrapper: React.FC<LibraryWrapper.Props> = (props) => {
  const local_db = useContext(LocalDbContext)!
  return <Library dictionary={props.dictionary} local_db={local_db} />
}
