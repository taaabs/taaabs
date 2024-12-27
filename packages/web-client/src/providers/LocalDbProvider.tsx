'use client'

import { Orama, create, insert, insertMultiple, remove } from '@orama/orama'
import { ReactNode, createContext, useContext, useState } from 'react'
import { AuthContext } from './AuthProvider'
import localforage from 'localforage'
import {
  afterInsert as highlightAfterInsert,
  loadWithHighlight,
  saveWithHighlight,
} from '@orama/plugin-match-highlight'
import { useParams } from 'next/navigation'
import { browser_storage } from '@/constants/browser-storage'
import { LibrarySearch_DataSourceImpl } from '@repositories/modules/library-search/infrastructure/data-sources/library-search.data-source-impl'
import { LibrarySearch_RepositoryImpl } from '@repositories/modules/library-search/infrastructure/repositories/library-search.repository-impl'
import { Bookmark_Entity } from '@repositories/modules/library-search/domain/entities/bookmark.entity'
import { get_site_variants_for_search } from '@shared/utils/get-site-variants-for-search'
import { english_stop_words } from '@shared/constants/english-stop-words'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'

export type BookmarkForSearch = {
  id: number
  created_at: string
  visited_at: string
  updated_at: string
  title?: string
  note?: string
  is_archived: boolean
  is_unsorted?: boolean
  stars?: number
  tags: { name: string; id: number }[]
  links: { url: string; site_path?: string }[]
  tag_ids: number[]
  points?: number
}

export const schema = {
  id: 'string',
  card: 'string',
  tag_ids: 'enum[]',
  sites: 'string[]',
  sites_variants: 'string[]',
  tags: 'string[]',
  created_at: 'number',
  updated_at: 'number',
  visited_at: 'number',
  is_unsorted: 'boolean',
  stars: 'number',
  points: 'number',
} as const

export type LocalDb = {
  init: (params: {
    is_archived: boolean
    force_reinitialization?: boolean
    include_visited_at?: boolean
    include_points?: boolean
  }) => Promise<{
    db: Orama<typeof schema>
  }>
  db?: Orama<typeof schema>
  set_db: (db?: Orama<typeof schema>) => void
  archived_db?: Orama<typeof schema>
  set_archived_db: (db?: Orama<typeof schema>) => void
  is_initializing?: boolean
  indexed_bookmarks_percentage?: number
  upsert_bookmark: (params: {
    db: Orama<typeof schema>
    bookmark: BookmarkForSearch
  }) => Promise<void>
  delete_bookmark: (params: {
    db: Orama<typeof schema>
    bookmark_id: number
  }) => Promise<void>
}

export const LocalDbContext = createContext<LocalDb | null>(null)

export const LocalDbProvider: React.FC<{
  children: ReactNode
}> = (props) => {
  const auth_context = useContext(AuthContext)
  const { username }: { username?: string } = useParams()
  const [is_initializing, set_is_initializing] = useState(false)
  const [indexed_bookmarks_percentage, set_indexed_bookmarks_percentage] =
    useState<number | undefined>()

  const [db, set_db] = useState<Orama<typeof schema>>()
  const [archived_db, set_archived_db] = useState<Orama<typeof schema>>()

  const _clear_cached_data = async (params: { is_archived: boolean }) => {
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
    include_visited_at?: boolean
    include_points?: boolean
  }): Promise<{
    db: Orama<typeof schema>
  }> => {
    set_is_initializing(true)

    const version: number | undefined = !username
      ? (await localforage.getItem<number>(
          browser_storage.local_forage.authorized_library.search.version,
        )) || undefined
      : undefined

    const cached_at: number | undefined = !username
      ? (await localforage.getItem<number>(
          !params.is_archived
            ? browser_storage.local_forage.authorized_library.search
                .cached_at_timestamp
            : browser_storage.local_forage.authorized_library.search
                .archived_cached_at_timestamp,
        )) || undefined
      : undefined

    const data_source = new LibrarySearch_DataSourceImpl(
      auth_context.ky_instance,
    )
    const repository = new LibrarySearch_RepositoryImpl(data_source)

    let bookmarks: Bookmark_Entity[]
    let incoming_version: number
    if (!username) {
      const result = await repository.get_bookmarks_on_authorized_user(
        {
          is_archived: params.is_archived,
          after: !params.force_reinitialization ? cached_at : undefined,
          include_visited_at: params.include_visited_at,
          include_points: params.include_points,
        },
        auth_context.auth_data!.encryption_key,
      )
      bookmarks = result.bookmarks
      incoming_version = result.version
    } else {
      const result = await repository.get_bookmarks_on_public_user({
        is_archived: params.is_archived,
        username: username as string,
        after: !params.force_reinitialization ? cached_at : undefined,
        include_points: params.include_points,
      })
      bookmarks = result.bookmarks
      incoming_version = result.version
    }

    if (
      params.force_reinitialization ||
      (version && version != incoming_version)
    ) {
      await _clear_cached_data({ is_archived: params.is_archived })
    }

    let fresh_db: Orama<typeof schema>

    if (
      !params.force_reinitialization &&
      version == incoming_version &&
      ((!params.is_archived && db) || (params.is_archived && archived_db))
    ) {
      // DB is initialized, should be updated
      fresh_db = (!params.is_archived ? db : archived_db)!
      for (const bookmark of bookmarks) {
        await remove(fresh_db, bookmark.id.toString())
        if (!bookmark.is_deleted) {
          await insert(fresh_db, {
            id: bookmark.id.toString(),
            card:
              (bookmark.title ? `${bookmark.title} ` : '') +
              (bookmark.note ? `${bookmark.note} ` : '') +
              bookmark.tags.map((tag) => tag.name).join(' ') +
              (bookmark.tags.length ? ' ' : '') +
              bookmark.links
                .map((link) => link.site.replace('/', ' › '))
                .join(' '),
            sites: bookmark.links.map((link) => link.site),
            sites_variants: bookmark.links
              .map((link) => get_site_variants_for_search(link.site))
              .flat(),
            tag_ids: bookmark.tags.map((tag) => tag.id),
            tags: bookmark.tags.map((tag) => tag.name),
            created_at: bookmark.created_at,
            updated_at: bookmark.updated_at,
            visited_at: bookmark.visited_at,
            is_unsorted: bookmark.is_unsorted,
            stars: bookmark.stars,
            points: bookmark.points
              ? parseInt(`${bookmark.points}${bookmark.created_at}`)
              : bookmark.created_at,
          })
        }
      }
    } else {
      // DB is not initialized, should be restored from cache and updated OR created from scratch
      fresh_db = await create({
        schema,
        sort: {
          unsortableProperties: [
            'id',
            'card',
            'plain_text',
            'sites',
            'sites_variants',
            'is_unsorted',
            'stars',
            'tags',
            'tags_ids',
          ],
        },
        plugins: [
          {
            name: 'highlight',
            afterInsert: highlightAfterInsert,
          },
        ],
        components: {
          tokenizer: {
            stemming: true,
            stopWords: english_stop_words,
          },
        },
      })

      const cached_index: string | undefined = !username
        ? (await localforage.getItem<string>(
            !params.is_archived
              ? browser_storage.local_forage.authorized_library.search.index
              : browser_storage.local_forage.authorized_library.search
                  .archived_index,
          )) || undefined
        : undefined

      if (cached_index) {
        // Update cached index
        await loadWithHighlight(fresh_db, JSON.parse(cached_index as any))
        for (const bookmark of bookmarks) {
          await remove(fresh_db, bookmark.id.toString())
          if (!bookmark.is_deleted) {
            await insert(fresh_db, {
              id: bookmark.id.toString(),
              card:
                (bookmark.title ? `${bookmark.title} ` : '') +
                (bookmark.note ? `${bookmark.note} ` : '') +
                bookmark.tags.map((tag) => tag.name).join(' ') +
                (bookmark.tags.length ? ' ' : '') +
                bookmark.links
                  .map((link) => link.site.replace('/', ' › '))
                  .join(' '),
              sites: bookmark.links.map((link) => link.site),
              sites_variants: bookmark.links
                .map((link) => get_site_variants_for_search(link.site))
                .flat(),
              tag_ids: bookmark.tags.map((tag) => tag.id),
              tags: bookmark.tags.map((tag) => tag.name),
              created_at: bookmark.created_at,
              updated_at: bookmark.updated_at,
              visited_at: bookmark.visited_at,
              is_unsorted: bookmark.is_unsorted,
              stars: bookmark.stars,
              points: bookmark.points
                ? parseInt(`${bookmark.points}${bookmark.created_at}`)
                : bookmark.created_at,
            })
          }
        }
      } else {
        // DB was not cached, thus is created from scratch
        const chunk_size = 1000
        let indexed_count = 0
        for (let i = 0; i < bookmarks.length; i += chunk_size) {
          const chunk = bookmarks.slice(i, i + chunk_size)
          await insertMultiple(
            fresh_db,
            chunk
              .filter((bookmark) => !bookmark.is_deleted)
              .map((bookmark) => ({
                id: bookmark.id.toString(),
                card:
                  (bookmark.title ? `${bookmark.title} ` : '') +
                  (bookmark.note ? `${bookmark.note} ` : '') +
                  bookmark.tags.map((tag) => tag.name).join(' ') +
                  (bookmark.tags.length ? ' ' : '') +
                  bookmark.links
                    .map((link) => link.site.replace('/', ' › '))
                    .join(' '),
                sites: bookmark.links.map((link) => link.site),
                sites_variants: bookmark.links
                  .map((link) => get_site_variants_for_search(link.site))
                  .flat(),
                tag_ids: bookmark.tags.map((tag) => tag.id),
                tags: bookmark.tags.map((tag) => tag.name),
                created_at: bookmark.created_at,
                updated_at: bookmark.updated_at,
                visited_at: bookmark.visited_at,
                is_unsorted: bookmark.is_unsorted,
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
        set_db(fresh_db)
      } else {
        set_archived_db(fresh_db)
      }
    }

    // Cache db
    if (bookmarks.length) {
      const index = await saveWithHighlight(fresh_db)
      if (!username) {
        await localforage.setItem(
          browser_storage.local_forage.authorized_library.search.version,
          incoming_version,
        )
        if (!params.is_archived) {
          await localforage.setItem(
            browser_storage.local_forage.authorized_library.search
              .cached_at_timestamp,
            bookmarks[bookmarks.length - 1].updated_at,
          )
          await localforage.setItem(
            browser_storage.local_forage.authorized_library.search.index,
            JSON.stringify(index),
          )
        } else {
          await localforage.setItem(
            browser_storage.local_forage.authorized_library.search
              .archived_cached_at_timestamp,
            bookmarks[bookmarks.length - 1].updated_at,
          )
          await localforage.setItem(
            browser_storage.local_forage.authorized_library.search
              .archived_index,
            JSON.stringify(index),
          )
        }
      }
    }

    set_is_initializing(false)
    return {
      db: fresh_db,
    }
  }

  // Used solely for updating highlights
  const upsert_bookmark = async (params: {
    db: Orama<typeof schema>
    bookmark: BookmarkForSearch
  }) => {
    await remove(params.db, params.bookmark.id.toString())

    const sites = params.bookmark.links.map(
      (link) =>
        `${get_domain_from_url(link.url)}${
          link.site_path ? `/${link.site_path}` : ''
        }`,
    )
    await insert(params.db, {
      id: params.bookmark.id.toString(),
      card:
        (params.bookmark.title ? `${params.bookmark.title} ` : '') +
        (params.bookmark.note ? `${params.bookmark.note} ` : '') +
        params.bookmark.tags.map((tag) => tag.name).join(' ') +
        (params.bookmark.tags.length ? ' ' : '') +
        sites.map((site) => site.replace('/', ' › ')).join(' '),
      sites,
      sites_variants: sites
        .map((site) => get_site_variants_for_search(site))
        .flat(),
      tag_ids: params.bookmark.tags.map((tag) => tag.id),
      tags: params.bookmark.tags.map((tag) => tag.name),
      created_at: Math.round(
        new Date(params.bookmark.created_at).getTime() / 1000,
      ),
      updated_at: Math.round(
        new Date(params.bookmark.updated_at).getTime() / 1000,
      ),
      visited_at: Math.round(
        new Date(params.bookmark.visited_at).getTime() / 1000,
      ),
      is_unsorted: params.bookmark.is_unsorted,
      stars: params.bookmark.stars,
      points: params.bookmark.points
        ? parseInt(`${params.bookmark.points}${params.bookmark.created_at}`)
        : Math.round(new Date(params.bookmark.created_at).getTime() / 1000),
    })
  }

  const delete_bookmark = async (params: {
    db: Orama<typeof schema>
    bookmark_id: number
  }) => {
    await remove(params.db, params.bookmark_id.toString())
  }

  return (
    <LocalDbContext.Provider
      value={{
        init,
        db,
        set_db,
        archived_db,
        set_archived_db,
        is_initializing,
        indexed_bookmarks_percentage,
        upsert_bookmark,
        delete_bookmark,
      }}
    >
      {props.children}
    </LocalDbContext.Provider>
  )
}
