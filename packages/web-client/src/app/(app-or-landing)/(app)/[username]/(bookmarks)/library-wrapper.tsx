'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import { useContext } from 'react'
import Library from '../../_library/Library'
import { LocalDbContext } from '@/app/local-db-provider'

namespace LibraryWrapper {
  export type Props = {
    dictionary: Dictionary
  }
}

export const LibraryWrapper: React.FC<LibraryWrapper.Props> = (props) => {
  const local_db = useContext(LocalDbContext)!
  return <Library dictionary={props.dictionary} local_db={local_db} />
}
