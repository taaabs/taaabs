import {
  Orama,
  Results,
  TypedDocument,
  create,
  insertMultiple,
  search,
  remove,
} from '@orama/orama'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { SearchableBookmark_Entity } from '@repositories/modules/library-search/domain/entities/searchable-bookmark.entity'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { LibrarySearch_DataSourceImpl } from '@repositories/modules/library-search/infrastructure/data-sources/library-search.data-source-impl'
import { LibrarySearch_RepositoryImpl } from '@repositories/modules/library-search/infrastructure/repositories/library-search.repository-impl'
import { GetSearchableBookmarksOnAuthorizedUser_UseCase } from '@repositories/modules/library-search/domain/usecases/get-searchable-bookmarks-on-authorized-user.user-case'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'

type Hint = {
  type: 'new' | 'recent'
  text: string
}

const schema = {
  id: 'string',
  title: 'string',
  sites: 'string[]',
  created_at: 'number',
} as const

type Result = TypedDocument<Orama<typeof schema>>

export const use_search = () => {
  const query_params = use_shallow_search_params()
  const [is_search_focused, set_is_search_focused] = useState(false)
  const [searchable_bookmarks, set_searchable_bookmarks] =
    useState<SearchableBookmark_Entity[]>()
  const [current_filter, set_current_filter] = useState<LibraryFilter>()
  const [selected_tags, set_selected_tags] = useState<string[]>([])
  const [ids_to_search_amongst, set_ids_to_search_amongst] = useState<
    string[] | undefined
  >()
  const dispatch = use_library_dispatch()
  const { bookmarks } = use_library_selector((state) => state.bookmarks)
  const [is_initializing, set_is_initializing] = useState(false)
  const [search_string, set_search_string] = useState('')
  const [hints, set_hints] = useState<Hint[] | undefined>()
  const [db, set_db] = useState<Orama<typeof schema> | undefined>()
  const [indexed_bookmarks_percentage, set_indexed_bookmarks_percentage] =
    useState<number | undefined>()
  const [db_results, set_db_results] = useState<Results<Result>>()
  const [found_ids, set_found_ids] = useState<number[] | undefined>()

  useUpdateEffect(() => {
    find_bookmarks_ids_within_current_view_options()
  }, [current_filter, selected_tags, searchable_bookmarks])

  const find_bookmarks_ids_within_current_view_options = () => {
    if (!searchable_bookmarks) return
    set_ids_to_search_amongst(
      searchable_bookmarks
        .filter((bookmark) => {
          let should_keep = false
          if (selected_tags.every((tag) => bookmark.tags.includes(tag))) {
            if (current_filter == LibraryFilter.All) {
              if (!bookmark.is_archived) {
                should_keep = true
              }
            } else if (current_filter == LibraryFilter.Archived) {
              if (bookmark.is_archived) {
                should_keep = true
              }
            } else if (current_filter == LibraryFilter.Unread) {
              if (bookmark.is_unread && !bookmark.is_archived) {
                should_keep = true
              }
            } else if (current_filter == LibraryFilter.OneStar) {
              if (bookmark.stars >= 1 && !bookmark.is_archived) {
                should_keep = true
              }
            } else if (current_filter == LibraryFilter.TwoStars) {
              if (bookmark.stars >= 2 && !bookmark.is_archived) {
                should_keep = true
              }
            } else if (current_filter == LibraryFilter.ThreeStars) {
              should_keep = true
              if (bookmark.stars == 3 && !bookmark.is_archived) {
                should_keep = true
              }
            } else if (current_filter == LibraryFilter.OneStarUnread) {
              if (
                bookmark.stars >= 1 &&
                bookmark.is_unread &&
                !bookmark.is_archived
              ) {
                should_keep = true
              }
            } else if (current_filter == LibraryFilter.TwoStarsUnread) {
              if (
                bookmark.stars >= 2 &&
                bookmark.is_unread &&
                !bookmark.is_archived
              ) {
                should_keep = true
              }
            } else if (current_filter == LibraryFilter.ThreeStarsUnread) {
              if (
                bookmark.stars == 3 &&
                bookmark.is_unread &&
                !bookmark.is_archived
              ) {
                should_keep = true
              }
            }
          }
          return should_keep
        })
        .map((bookmark) => bookmark.id.toString()),
    )
  }

  const init = async () => {
    set_is_initializing(true)
    const data_source = new LibrarySearch_DataSourceImpl(
      process.env.NEXT_PUBLIC_API_URL,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
    )
    const repository = new LibrarySearch_RepositoryImpl(data_source)
    const get_searchable_bookmarks =
      new GetSearchableBookmarksOnAuthorizedUser_UseCase(repository)
    const { bookmarks } = await get_searchable_bookmarks.invoke({})

    set_searchable_bookmarks(bookmarks)
    const db = await create({
      schema,
    })

    const chunkSize = 500
    let indexed_count = 0
    for (let i = 0; i < bookmarks.length; i += chunkSize) {
      const chunk = bookmarks.slice(i, i + chunkSize)
      await insertMultiple(
        db,
        chunk.map((bookmark) => {
          return {
            id: bookmark.id.toString(),
            title:
              bookmark.title +
              ' ' +
              bookmark.tags.join(' ') +
              ' ' +
              bookmark.sites.join(' '),
            sites: bookmark.sites,
            created_at: bookmark.created_at,
          }
        }),
      )
      indexed_count += chunk.length
      set_indexed_bookmarks_percentage(
        Math.floor((indexed_count / bookmarks.length) * 100),
      )
    }

    set_db(db)
    set_is_initializing(false)
  }

  const query_db = async () => {
    if (!db) return
    const gte = query_params.get('gte')
    const lte = query_params.get('lte')

    const results: Results<Result> = await search(db, {
      term: search_string,
      limit: 200,
      properties: ['title'],
      where: {
        ...((query_params.get('t') || query_params.get('f')) &&
        ids_to_search_amongst
          ? { id: ids_to_search_amongst }
          : {}),
        ...(gte && lte
          ? {
              created_at: {
                between: [
                  new Date(
                    parseInt(gte.toString().substring(0, 4)),
                    parseInt(gte.toString().substring(4, 6)) - 1,
                  ).getTime() / 1000,
                  new Date(
                    parseInt(lte.toString().substring(0, 4)),
                    parseInt(lte.toString().substring(4, 6)),
                  ).getTime() / 1000,
                ],
              },
            }
          : {}),
      },
      threshold: 0,
    })
    set_db_results(results)
    if (results.count == 0) {
      clear_hints()
      set_found_ids(undefined)
    } else {
      const found_ids = results.hits.map((result) => parseInt(result.id))
      set_found_ids(found_ids)
      get_hints()
    }
  }

  useUpdateEffect(() => {
    if (db !== undefined && search_string.length) {
      query_db()
    }
  }, [search_string])

  const get_hints = () => {
    set_hints([{ type: 'new', text: 'todo' }])
  }

  const clear_hints = () => {
    set_hints(undefined)
  }

  const clear_search_string = () => {
    set_search_string('')
  }

  const reset_field = () => {
    clear_search_string()
    set_db_results(undefined)
  }

  const get_bookmarks = (params: { should_get_next_page?: boolean }) => {
    clear_hints()
    if (found_ids) {
      if (!params.should_get_next_page) {
        dispatch(
          bookmarks_actions.get_bookmarks_by_ids_authorized({
            api_url: process.env.NEXT_PUBLIC_API_URL,
            auth_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
            is_next_page: false,
            request_params: {
              ids: found_ids.slice(0, 20),
            },
          }),
        )
      } else if (bookmarks) {
        dispatch(
          bookmarks_actions.get_bookmarks_by_ids_authorized({
            api_url: process.env.NEXT_PUBLIC_API_URL,
            auth_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
            is_next_page: true,
            request_params: {
              ids: found_ids.slice(bookmarks.length, bookmarks.length + 20),
            },
          }),
        )
      }
    }
  }

  const delete_searchable_bookmark = async (params: {
    bookmark_id: number
  }) => {
    if (!db || !searchable_bookmarks) return
    await remove(db, params.bookmark_id.toString())

    set_searchable_bookmarks(
      searchable_bookmarks.filter(
        (bookmark) => bookmark.id != params.bookmark_id,
      ),
    )
  }

  const update_searchable_bookmark = async (params: {
    bookmark: UpsertBookmark_Params
  }) => {
    if (
      !db ||
      !searchable_bookmarks ||
      !params.bookmark.bookmark_id ||
      !params.bookmark.created_at
    )
      return

    set_searchable_bookmarks([
      ...searchable_bookmarks.filter(
        (bookmark) => bookmark.id != params.bookmark.bookmark_id,
      ),
      {
        id: params.bookmark.bookmark_id,
        title: params.bookmark.title,
        created_at: Math.round(
          new Date(params.bookmark.created_at).getTime() / 1000,
        ),
        is_archived: params.bookmark.is_archived,
        is_unread: params.bookmark.is_unread,
        sites: params.bookmark.links.map(
          (link) =>
            `${get_domain_from_url(link.url)}${
              link.site_path ? `/${link.site_path}` : ''
            }`,
        ),
        stars: params.bookmark.stars || 0,
        tags: params.bookmark.tags.map((tag) => tag.name),
      },
    ])
  }

  return {
    is_search_focused,
    set_is_search_focused,
    search_string,
    set_search_string,
    hints,
    clear_hints,
    get_hints,
    init,
    db_results,
    is_initializing,
    db,
    found_ids,
    get_bookmarks,
    delete_searchable_bookmark,
    update_searchable_bookmark,
    set_current_filter,
    set_selected_tags,
    indexed_bookmarks_percentage,
    clear_search_string,
    reset_field,
  }
}
