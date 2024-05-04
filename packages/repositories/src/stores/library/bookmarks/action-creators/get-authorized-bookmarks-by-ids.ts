import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { bookmarks_actions } from '../bookmarks.slice'
import { GetBookmarksByIds_Params } from '@repositories/modules/bookmarks/domain/types/get-bookmarks-by-ids.params'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { KyInstance } from 'ky'

export const get_authorized_bookmarks_by_ids = (params: {
  request_params: GetBookmarksByIds_Params.Authorized
  is_next_page: boolean
  ky: KyInstance
  encryption_key: Uint8Array
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) =>
    new Promise<void>(async (resolve) => {
      const data_source = new Bookmarks_DataSourceImpl(params.ky)
      const repository = new Bookmarks_RepositoryImpl(data_source)

      dispatch(bookmarks_actions.set_is_fetching(true))
      if (params.is_next_page) {
        dispatch(bookmarks_actions.set_is_fetching_more_bookmarks(true))
      } else {
        dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(true))
      }

      const { bookmarks } = await repository.get_bookmarks_by_ids_authorized(
        params.request_params,
        params.encryption_key,
      )

      let bookmarks_with_density: Bookmark_Entity[] = []

      if (get_state().bookmarks.density == 'compact') {
        bookmarks_with_density = bookmarks
          ? bookmarks.map((bookmark) => ({
              ...bookmark,
              is_compact: true,
            }))
          : []
      } else {
        bookmarks_with_density = bookmarks || []
      }

      dispatch(bookmarks_actions.set_is_fetching(false))
      dispatch(bookmarks_actions.set_showing_bookmarks_fetched_by_ids(true))

      if (params.is_next_page) {
        dispatch(bookmarks_actions.set_more_bookmarks(bookmarks_with_density))
        dispatch(bookmarks_actions.set_is_fetching_more_bookmarks(false))
      } else {
        dispatch(
          bookmarks_actions.set_incoming_bookmarks(bookmarks_with_density),
        )
        dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(false))
        dispatch(
          bookmarks_actions.set_first_bookmarks_fetched_at_timestamp(
            Date.now(),
          ),
        )
      }
      resolve()
    })
}
