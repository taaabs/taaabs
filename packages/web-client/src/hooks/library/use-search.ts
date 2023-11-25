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
  tags: 'string[]',
  created_at: 'number',
} as const

type Result = TypedDocument<Orama<typeof schema>>

export const use_search = () => {
  const query_params = use_shallow_search_params()
  const [searchable_bookmarks, set_searchable_bookmarks] =
    useState<SearchableBookmark_Entity[]>()
  const [current_filter, set_current_filter] = useState<LibraryFilter>()
  const [selected_tags, set_selected_tags] = useState<string[]>([])
  const [ids_to_search_in, set_ids_to_search_in] = useState<
    string[] | undefined
  >()
  const dispatch = use_library_dispatch()
  const { bookmarks } = use_library_selector((state) => state.bookmarks)
  const [is_initializing_orama, set_is_initializing_orama] = useState(false)
  const [search_string, set_search_string] = useState('')
  const [hints, set_hints] = useState<Hint[] | undefined>()

  const [orama, set_orama] = useState<Orama<typeof schema> | undefined>()
  const [orama_results, set_orama_results] = useState<Results<Result>>()
  const [found_ids, set_found_ids] = useState<number[] | undefined>()

  useUpdateEffect(() => {
    find_ids_to_search_in()
  }, [current_filter, selected_tags, searchable_bookmarks])

  // detect change to selected tags, filter
  const find_ids_to_search_in = () => {
    if (!searchable_bookmarks) return
    set_ids_to_search_in(
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

  const init_orama = async () => {
    dispatch(bookmarks_actions.set_is_in_search_mode(true))
    set_is_initializing_orama(true)
    const data_source = new LibrarySearch_DataSourceImpl(
      process.env.NEXT_PUBLIC_API_URL,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
    )
    const repository = new LibrarySearch_RepositoryImpl(data_source)
    const get_searchable_bookmarks =
      new GetSearchableBookmarksOnAuthorizedUser_UseCase(repository)
    const { bookmarks } = await get_searchable_bookmarks.invoke({})

    set_searchable_bookmarks(bookmarks)
    const orama_db = await create({
      schema,
    })
    await insertMultiple(
      orama_db,
      bookmarks.map((bookmark) => ({
        id: bookmark.id.toString(),
        title: bookmark.title,
        sites: bookmark.sites,
        tags: bookmark.tags,
        created_at: bookmark.created_at,
      })),
      500,
    )
    set_orama(orama_db)
    set_is_initializing_orama(false)
  }

  const query_orama = async () => {
    const gte = query_params.get('gte')
    const lte = query_params.get('lte')

    const results: Results<Result> = await search(orama!, {
      term: search_string,
      limit: 200,
      where: {
        ...((query_params.get('t') || query_params.get('f')) && ids_to_search_in
          ? { id: ids_to_search_in }
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
    })
    set_orama_results(results)
    const found_ids = results.hits.map((result) => parseInt(result.id))
    set_found_ids(found_ids)
    if (!found_ids.length) {
      clear_hints()
    } else {
      get_hints()
    }
  }

  const get_hints = () => {
    set_hints([{ type: 'new', text: 'todo' }])
  }

  const clear_hints = () => {
    set_hints(undefined)
  }

  useUpdateEffect(() => {
    if (orama !== undefined && search_string.length) {
      query_orama()
    }
  }, [search_string, current_filter, selected_tags])

  const get_bookmarks_of_search = (params: {
    should_get_next_page?: boolean
  }) => {
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
    if (!orama || !searchable_bookmarks) return
    await remove(orama, params.bookmark_id.toString())

    set_searchable_bookmarks(
      searchable_bookmarks.filter(
        (bookmark) => bookmark.id != params.bookmark_id,
      ),
    )
  }

  const update_searchable_bookmarks = async (params: {
    bookmark: UpsertBookmark_Params
  }) => {
    if (
      !orama ||
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
    search_string,
    set_search_string,
    hints,
    get_hints,
    set_hints,
    clear_hints,
    init_orama,
    is_initializing_orama,
    orama,
    found_ids,
    get_bookmarks_of_search,
    delete_searchable_bookmark,
    update_searchable_bookmarks,
    set_current_filter,
    set_selected_tags,
  }
}
