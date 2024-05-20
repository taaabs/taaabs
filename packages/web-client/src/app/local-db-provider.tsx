'use client'

import { BookmarkTags, schema } from '@/hooks/library/use-search'
import { Orama } from '@orama/orama'
import { ReactNode, createContext, useContext, useState } from 'react'
import { AuthContext } from './auth-provider'

export type LocalDb = {
  db?: Orama<typeof schema>
  set_db: (db?: Orama<typeof schema>) => void
  archived_db?: Orama<typeof schema>
  set_archived_db: (db?: Orama<typeof schema>) => void
  db_updated_at_timestamp?: number
  set_db_updated_at_timestamp: (timestamp?: number) => void
  archived_db_updated_at_timestamp?: number
  set_archived_db_updated_at_timestamp: (timestamp?: number) => void
  bookmarks_just_tags?: BookmarkTags[]
  set_bookmarks_just_tags: (bookmarks_just_tags: BookmarkTags[]) => void
  archived_bookmarks_just_tags?: BookmarkTags[]
  set_archived_bookmarks_just_tags: (
    archived_bookmarks_just_tags: BookmarkTags[],
  ) => void
}

export const LocalDbContext = createContext<LocalDb | null>(null)

export const LocalDbProvider: React.FC<{
  children: ReactNode
}> = (props) => {
  const auth_context = useContext(AuthContext)

  const [db, set_db] = useState<Orama<typeof schema>>()
  const [archived_db, set_archived_db] = useState<Orama<typeof schema>>()
  const [db_updated_at_timestamp, set_db_updated_at_timestamp] =
    useState<number>()
  const [
    archived_db_updated_at_timestamp,
    set_archived_db_updated_at_timestamp,
  ] = useState<number>()
  const [bookmarks_just_tags, set_bookmarks_just_tags] =
    useState<BookmarkTags[]>()
  const [archived_bookmarks_just_tags, set_archived_bookmarks_just_tags] =
    useState<BookmarkTags[]>()

  // it requires initializing db
  const add_bookmark = () => {}

  return (
    <LocalDbContext.Provider
      value={{
        db,
        set_db,
        archived_db,
        set_archived_db,
        db_updated_at_timestamp,
        set_db_updated_at_timestamp,
        archived_db_updated_at_timestamp,
        set_archived_db_updated_at_timestamp,
        bookmarks_just_tags,
        set_bookmarks_just_tags,
        archived_bookmarks_just_tags,
        set_archived_bookmarks_just_tags,
      }}
    >
      {props.children}
    </LocalDbContext.Provider>
  )
}
