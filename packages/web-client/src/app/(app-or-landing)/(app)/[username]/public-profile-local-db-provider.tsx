'use client'

import { LocalDb } from '@/app/local-db-provider'
import { BookmarkTags, schema } from '@/hooks/library/use-search'
import { Orama } from '@orama/orama'
import { ReactNode, createContext, useState } from 'react'

export const PublicProfileLocalDbContext = createContext<LocalDb | null>(null)

export const PublicProfileLocalDbProvider: React.FC<{
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
  const [bookmarks_just_tags, set_bookmarks_just_tags] =
    useState<BookmarkTags[]>()
  const [archived_bookmarks_just_tags, set_archived_bookmarks_just_tags] =
    useState<BookmarkTags[]>()

  return (
    <PublicProfileLocalDbContext.Provider
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
    </PublicProfileLocalDbContext.Provider>
  )
}
