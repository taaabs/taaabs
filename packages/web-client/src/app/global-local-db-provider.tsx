'use client'

import { schema } from '@/hooks/library/use-search'
import { Orama } from '@orama/orama'
import { ReactNode, createContext, useState } from 'react'

export type LocalDb = {
  db?: Orama<typeof schema>
  set_db: (db?: Orama<typeof schema>) => void
  archived_db?: Orama<typeof schema>
  set_archived_db: (db?: Orama<typeof schema>) => void
  db_updated_at_timestamp?: number
  set_db_updated_at_timestamp: (timestamp?: number) => void
  archived_db_updated_at_timestamp?: number
  set_archived_db_updated_at_timestamp: (timestamp?: number) => void
}

export const GlobalLocalDbContext = createContext<LocalDb | null>(null)

export const GlobalOramaDbProvider: React.FC<{
  children: ReactNode
}> = (props) => {
  const [db, set_db] = useState<Orama<typeof schema>>()
  const [archived_db, set_archived_db] = useState<Orama<typeof schema>>()
  const [db_updated_at_timestamp, set_db_updated_at_timestamp] =
    useState<number>()
  const [
    archived_db_updated_at_timestamp,
    set_archived_db_updated_at_timestamp,
  ] = useState<number>()

  return (
    <GlobalLocalDbContext.Provider
      value={{
        db,
        set_db,
        archived_db,
        set_archived_db,
        db_updated_at_timestamp,
        set_db_updated_at_timestamp,
        archived_db_updated_at_timestamp,
        set_archived_db_updated_at_timestamp,
      }}
    >
      {props.children}
    </GlobalLocalDbContext.Provider>
  )
}
