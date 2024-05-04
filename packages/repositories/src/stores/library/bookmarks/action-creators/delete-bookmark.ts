import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { bookmarks_actions } from '../bookmarks.slice'
import { counts_actions } from '../../counts/counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { KyInstance } from 'ky'
import { Pinned_DataSourceImpl } from '@repositories/modules/pinned/infrastructure/data-sources/pinned.data-source-impl'
import { Pinned_RepositoryImpl } from '@repositories/modules/pinned/infrastructure/repositories/pinned.repository-impl'
import { pinned_actions } from '../../pinned/pinned.slice'
import { GetTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/get-tag-hierarchies.params'
import { tag_hierarchies_actions } from '../../tag-hierarchies/tag-hierarchies.slice'

export const delete_bookmark = (params: {
  bookmark_id: number
  last_authorized_counts_params: Counts_Params.Authorized
  get_tag_hierarchies_request_params?: GetTagHierarchies_Params.Authorized
  ky: KyInstance
  encryption_key: Uint8Array
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) =>
    new Promise(async (resolve) => {
      const state = get_state()

      if (!state.bookmarks.bookmarks)
        throw new Error('[delete_bookmark] Bookmarks should be there')

      const data_source = new Bookmarks_DataSourceImpl(params.ky)
      const repository = new Bookmarks_RepositoryImpl(data_source)
      dispatch(bookmarks_actions.set_is_upserting(true))
      await repository.delete_bookmark({ bookmark_id: params.bookmark_id })
      dispatch(
        bookmarks_actions.set_incoming_bookmarks(
          state.bookmarks.bookmarks.filter(
            (bookmark) => bookmark.id != params.bookmark_id,
          ),
        ),
      )

      // Updating pinned here prevents layout shift.
      const pinned_data_source = new Pinned_DataSourceImpl(params.ky)
      const pinned_repository = new Pinned_RepositoryImpl(pinned_data_source)
      dispatch(pinned_actions.set_is_fetching(true))
      const pinned_result = (
        await Promise.all([
          pinned_repository.get_pinned_authorized(params.encryption_key),
          dispatch(
            counts_actions.refresh_authorized_counts({
              last_authorized_counts_params:
                params.last_authorized_counts_params,
              ky: params.ky,
              encryption_key: params.encryption_key,
            }),
          ),
          params.get_tag_hierarchies_request_params &&
            dispatch(
              tag_hierarchies_actions.get_tag_hierarchies_authorized({
                request_params: params.get_tag_hierarchies_request_params,
                ky: params.ky,
                encryption_key: params.encryption_key,
              }),
            ),
        ])
      )[0]
      dispatch(pinned_actions.set_is_fetching(false))
      dispatch(pinned_actions.set_items(pinned_result))
      dispatch(pinned_actions.set_fetched_at_timestamp(Date.now()))

      resolve(null)
    })
}
