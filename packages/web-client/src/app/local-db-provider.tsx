'use client'

import { Orama, create, insert, insertMultiple, remove } from '@orama/orama'
import { ReactNode, createContext, useContext, useState } from 'react'
import { AuthContext } from './auth-provider'
import { KyInstance } from 'ky'
import localforage from 'localforage'
import {
  afterInsert as highlightAfterInsert,
  loadWithHighlight,
} from '@orama/plugin-match-highlight'
import { useParams } from 'next/navigation'
import { browser_storage } from '@/constants/browser-storage'
import { LibrarySearch_DataSourceImpl } from '@repositories/modules/library-search/infrastructure/data-sources/library-search.data-source-impl'
import { LibrarySearch_RepositoryImpl } from '@repositories/modules/library-search/infrastructure/repositories/library-search.repository-impl'
import { GetLastUpdated_Ro } from '@repositories/modules/library-search/domain/types/get-last-updated.ro'
import { SearchableBookmark_Entity } from '@repositories/modules/library-search/domain/entities/searchable-bookmark.entity'
import { get_site_variants_for_search } from '@shared/utils/get-site-variants-for-search'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'

type BookmarkOfSearch = {
  id: number
  created_at: string
  visited_at: string
  updated_at: string
  title?: string
  note?: string
  is_archived: boolean
  is_unread: boolean
  stars?: number
  tags: string[]
  links: { url: string; site_path?: string }[]
  tag_ids: number[]
}

export const schema = {
  id: 'string',
  text: 'string',
  tag_ids: 'enum[]',
  sites: 'string[]',
  sites_variants: 'string[]',
  tags: 'string[]',
  created_at: 'number',
  updated_at: 'number',
  visited_at: 'number',
  is_unread: 'boolean',
  stars: 'number',
  points: 'number',
} as const

export type LocalDb = {
  init: (params: {
    is_archived: boolean
    force_reinitialization?: boolean
  }) => Promise<{
    db: Orama<typeof schema>
  }>
  db?: Orama<typeof schema>
  set_db: (db?: Orama<typeof schema>) => void
  archived_db?: Orama<typeof schema>
  set_archived_db: (db?: Orama<typeof schema>) => void
  db_updated_at_timestamp?: number
  set_db_updated_at_timestamp: (timestamp?: number) => void
  archived_db_updated_at_timestamp?: number
  set_archived_db_updated_at_timestamp: (timestamp?: number) => void

  is_initializing?: boolean
  indexed_bookmarks_percentage?: number
  search_data_awaits_caching?: boolean
  set_search_data_awaits_caching: (awaits_caching: boolean) => void
  archived_search_data_awaits_caching?: boolean
  set_archived_search_data_awaits_caching: (awaits_caching: boolean) => void
  upsert_bookmark: (params: {
    db: Orama<typeof schema>
    is_archived: boolean
    bookmark: BookmarkOfSearch
  }) => Promise<void>
  delete_bookmark: (params: {
    db: Orama<typeof schema>
    is_archived: boolean
    bookmark_id: number
  }) => Promise<void>
}

export const LocalDbContext = createContext<LocalDb | null>(null)

export const LocalDbProvider: React.FC<{
  children: ReactNode
}> = (props) => {
  const auth_context = useContext(AuthContext)!
  const { username }: { username?: string } = useParams()
  const [is_initializing, set_is_initializing] = useState(false)
  const [indexed_bookmarks_percentage, set_indexed_bookmarks_percentage] =
    useState<number | undefined>()
  const [search_data_awaits_caching, set_search_data_awaits_caching] =
    useState<boolean>()
  const [
    archived_search_data_awaits_caching,
    set_archived_search_data_awaits_caching,
  ] = useState<boolean>()

  const [db, set_db] = useState<Orama<typeof schema>>()
  const [archived_db, set_archived_db] = useState<Orama<typeof schema>>()
  const [db_updated_at_timestamp, set_db_updated_at_timestamp] =
    useState<number>()
  const [
    archived_db_updated_at_timestamp,
    set_archived_db_updated_at_timestamp,
  ] = useState<number>()

  enum DbStalenessState {
    FRESH,
    INSTANCE_STALE_CACHED_STALE,
  }

  const get_is_db_stale = async (params: {
    is_archived: boolean
    ky: KyInstance
  }): Promise<DbStalenessState> => {
    const instance_updated_at: number | undefined = !params.is_archived
      ? db_updated_at_timestamp
      : archived_db_updated_at_timestamp

    const cached_at =
      (await localforage.getItem<number>(
        !username
          ? !params.is_archived
            ? browser_storage.local_forage.authorized_library.search
                .cached_at_timestamp
            : browser_storage.local_forage.authorized_library.search
                .archived_cached_at_timestamp
          : !params.is_archived
          ? browser_storage.local_forage.public_library.search.cached_at_timestamp(
              {
                username: username as string,
              },
            )
          : browser_storage.local_forage.public_library.search.archived_cached_at_timestamp(
              { username: username as string },
            ),
      )) || undefined

    let remote_updated_at: number

    const data_source = new LibrarySearch_DataSourceImpl(params.ky)
    const repository = new LibrarySearch_RepositoryImpl(data_source)

    let result: GetLastUpdated_Ro
    if (!username) {
      result = await repository.get_last_updated_at_on_authorized_user()
    } else {
      result = await repository.get_last_updated_at_on_public_user({
        username: username as string,
      })
    }

    !params.is_archived
      ? (remote_updated_at = result.updated_at?.getTime() || 0)
      : (remote_updated_at = result.archived_updated_at?.getTime() || 0)

    if (
      (instance_updated_at && instance_updated_at >= remote_updated_at) ||
      (cached_at && cached_at >= remote_updated_at)
    ) {
      return DbStalenessState.FRESH
    } else {
      return DbStalenessState.INSTANCE_STALE_CACHED_STALE
    }
  }

  const clear_cached_data = async (params: { is_archived: boolean }) => {
    if (!username) {
      await localforage.removeItem(
        !params.is_archived
          ? browser_storage.local_forage.authorized_library.search.index
          : browser_storage.local_forage.authorized_library.search
              .archived_index,
      )
      await localforage.removeItem(
        !params.is_archived
          ? browser_storage.local_forage.authorized_library.search
              .cached_at_timestamp
          : browser_storage.local_forage.authorized_library.search
              .archived_cached_at_timestamp,
      )
    } else {
      // await localforage.removeItem(
      //   !params.is_archived_
      //     ? browser_storage.local_forage.public_library.search.index({
      //         username: username as string,
      //       })
      //     : browser_storage.local_forage.public_library.search.archived_index({
      //         username: username as string,
      //       }),
      // )
      // await localforage.removeItem(
      //   !params.is_archived_
      //     ? browser_storage.local_forage.public_library.search.bookmarks({
      //         username: username as string,
      //       })
      //     : browser_storage.local_forage.public_library.search.archived_bookmarks(
      //         { username: username as string },
      //       ),
      // )
      // await localforage.removeItem(
      //   !params.is_archived_
      //     ? browser_storage.local_forage.public_library.search.cached_at_timestamp(
      //         {
      //           username: username as string,
      //         },
      //       )
      //     : browser_storage.local_forage.public_library.search.archived_cached_at_timestamp(
      //         { username: username as string },
      //       ),
      // )
    }
    if (!params.is_archived) {
      set_db(undefined)
    } else {
      set_archived_db(undefined)
    }
  }

  const init = async (params: {
    is_archived: boolean
    force_reinitialization?: boolean
  }): Promise<{
    db: Orama<typeof schema>
  }> => {
    if (params.force_reinitialization) {
      await clear_cached_data({ is_archived: params.is_archived })
    } else {
      const staleness_state = await get_is_db_stale({
        is_archived: params.is_archived,
        ky: auth_context.ky_instance,
      })

      // Bypass initialization if current instance is up to date.
      // Current instance could be out of date if user updated cached db in another tab.
      if (staleness_state == DbStalenessState.FRESH) {
        const updated_at = !params.is_archived
          ? db_updated_at_timestamp!
          : archived_db_updated_at_timestamp!
        const cached_at = await localforage.getItem<number>(
          !username
            ? !params.is_archived
              ? browser_storage.local_forage.authorized_library.search
                  .cached_at_timestamp
              : browser_storage.local_forage.authorized_library.search
                  .archived_cached_at_timestamp
            : !params.is_archived
            ? browser_storage.local_forage.public_library.search.cached_at_timestamp(
                {
                  username: username as string,
                },
              )
            : browser_storage.local_forage.public_library.search.archived_cached_at_timestamp(
                { username: username as string },
              ),
        )
        if (
          (updated_at && !cached_at) ||
          (updated_at && cached_at && updated_at >= cached_at)
        ) {
          if (!params.is_archived) {
            return {
              db: db!,
            }
          } else {
            return {
              db: archived_db!,
            }
          }
        }
      } else if (
        staleness_state == DbStalenessState.INSTANCE_STALE_CACHED_STALE
      ) {
        await clear_cached_data({ is_archived: params.is_archived })
      }
    }

    set_is_initializing(true)

    const new_db = await create({
      schema,
      sort: {
        unsortableProperties: [
          'id',
          'title',
          'sites',
          'sites_variants',
          'is_unread',
          'stars',
        ],
      },
      plugins: [
        {
          name: 'highlight',
          afterInsert: highlightAfterInsert,
        },
      ],
    })

    const cached_index = await localforage.getItem<string>(
      !username
        ? !params.is_archived
          ? browser_storage.local_forage.authorized_library.search.index
          : browser_storage.local_forage.authorized_library.search
              .archived_index
        : !params.is_archived
        ? browser_storage.local_forage.public_library.search.index({
            username: username as string,
          })
        : browser_storage.local_forage.public_library.search.archived_index({
            username: username as string,
          }),
    )

    if (cached_index) {
      await loadWithHighlight(new_db, JSON.parse(cached_index as any))
    } else {
      const data_source = new LibrarySearch_DataSourceImpl(
        auth_context.ky_instance,
      )
      const repository = new LibrarySearch_RepositoryImpl(data_source)

      let bookmarks: SearchableBookmark_Entity[]
      if (!username) {
        bookmarks = (
          await repository.get_bookmarks_on_authorized_user(
            {
              is_archived: params.is_archived,
            },
            auth_context.auth_data!.encryption_key,
          )
        ).bookmarks
      } else {
        bookmarks = (
          await repository.get_bookmarks_on_public_user({
            is_archived: params.is_archived,
            username: username as string,
          })
        ).bookmarks
      }

      const chunk_size = 1000
      let indexed_count = 0
      for (let i = 0; i < bookmarks.length; i += chunk_size) {
        const chunk = bookmarks.slice(i, i + chunk_size)
        await insertMultiple(
          new_db,
          chunk.map((bookmark) => ({
            id: bookmark.id.toString(),
            text:
              (bookmark.title ? `${bookmark.title} ` : '') +
              (bookmark.note ? `${bookmark.note} ` : '') +
              bookmark.tags.map((tag) => tag.name).join(' ') +
              (bookmark.tags.length ? ' ' : '') +
              bookmark.sites.map((site) => site.replace('/', ' › ')).join(' '),
            sites: bookmark.sites,
            sites_variants: bookmark.sites
              .map((site) => get_site_variants_for_search(site))
              .flat(),
            tag_ids: bookmark.tags.map((tag) => tag.id),
            tags: bookmark.tags.map((tag) => tag.name),
            created_at: bookmark.created_at,
            updated_at: bookmark.updated_at,
            visited_at: bookmark.visited_at,
            is_unread: bookmark.is_unread,
            stars: bookmark.stars,
            points: bookmark.points
              ? parseInt(`${bookmark.points}${bookmark.created_at}`)
              : bookmark.created_at,
          })),
          chunk_size,
        )
        indexed_count += chunk.length
        const progress_percentage = Math.round(
          (indexed_count / bookmarks.length) * 100,
        )
        set_indexed_bookmarks_percentage(
          progress_percentage < 100 ? progress_percentage : undefined,
        )
      }

      set_indexed_bookmarks_percentage(undefined)
    }

    if (!params.is_archived) {
      set_db(new_db)
      set_db_updated_at_timestamp(Date.now())
      set_search_data_awaits_caching(true)
    } else {
      set_archived_db(new_db)
      set_archived_search_data_awaits_caching(true)
      set_archived_db_updated_at_timestamp(Date.now())
    }

    set_is_initializing(false)
    return {
      db: new_db,
    }
  }

  const upsert_bookmark = async (params: {
    db: Orama<typeof schema>
    is_archived: boolean
    bookmark: BookmarkOfSearch
  }) => {
    await remove(params.db, params.bookmark.id.toString())

    if (
      (params.is_archived && params.bookmark.is_archived) ||
      (!params.is_archived && !params.bookmark.is_archived)
    ) {
      const sites = params.bookmark.links.map(
        (link) =>
          `${get_domain_from_url(link.url)}${
            link.site_path ? `/${link.site_path}` : ''
          }`,
      )
      await insert(params.db, {
        id: params.bookmark.id.toString(),
        text:
          (params.bookmark.title ? `${params.bookmark.title} ` : '') +
          (params.bookmark.note ? `${params.bookmark.note} ` : '') +
          params.bookmark.tags.join(' ') +
          (sites.length ? ' ' : '') +
          sites.join(' '),
        created_at: Math.round(
          new Date(params.bookmark.created_at).getTime() / 1000,
        ),
        updated_at: Math.round(
          new Date(params.bookmark.updated_at).getTime() / 1000,
        ),
        visited_at: Math.round(
          new Date(params.bookmark.visited_at).getTime() / 1000,
        ),
        is_unread: params.bookmark.is_unread,
        sites,
        sites_variants: sites
          .map((site) => get_site_variants_for_search(site))
          .flat(),
        stars: params.bookmark.stars || 0,
        tags: params.bookmark.tags,
        tag_ids: params.bookmark.tag_ids,
      })
    }

    if (!params.is_archived) {
      set_search_data_awaits_caching(true)
      set_db_updated_at_timestamp(
        new Date(params.bookmark.updated_at).getTime(),
      )
    } else {
      set_archived_search_data_awaits_caching(true)
      set_archived_db_updated_at_timestamp(
        new Date(params.bookmark.updated_at).getTime(),
      )
    }
  }

  const delete_bookmark = async (params: {
    db: Orama<typeof schema>
    is_archived: boolean
    bookmark_id: number
  }) => {
    await remove(params.db, params.bookmark_id.toString())

    if (!params.is_archived) {
      set_search_data_awaits_caching(true)
      set_db_updated_at_timestamp(Date.now())
    } else {
      set_archived_search_data_awaits_caching(true)
      set_archived_db_updated_at_timestamp(Date.now())
    }
  }

  return (
    <LocalDbContext.Provider
      value={{
        init,
        db,
        set_db,
        archived_db,
        set_archived_db,
        db_updated_at_timestamp,
        set_db_updated_at_timestamp,
        archived_db_updated_at_timestamp,
        set_archived_db_updated_at_timestamp,
        is_initializing,
        indexed_bookmarks_percentage,
        search_data_awaits_caching,
        set_search_data_awaits_caching,
        archived_search_data_awaits_caching,
        set_archived_search_data_awaits_caching,
        upsert_bookmark,
        delete_bookmark,
      }}
    >
      {props.children}
    </LocalDbContext.Provider>
  )
}
