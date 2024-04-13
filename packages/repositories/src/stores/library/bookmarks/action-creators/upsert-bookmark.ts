import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { UpsertBookmark_UseCase } from '@repositories/modules/bookmarks/domain/usecases/upsert-bookmark.use-case'
import { bookmarks_actions } from '../bookmarks.slice'
import { counts_actions } from '../../counts/counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { KyInstance } from 'ky'
import { Pinned_DataSourceImpl } from '@repositories/modules/pinned/infrastructure/data-sources/pinned.data-source-impl'
import { Pinned_RepositoryImpl } from '@repositories/modules/pinned/infrastructure/repositories/pinned.repository-impl'
import { GetPinnedAuthorized_UseCase } from '@repositories/modules/pinned/domain/usecases/get-pinned-authorized.use-case'
import { pinned_actions } from '../../pinned/pinned.slice'

export const upsert_bookmark = (params: {
  bookmark: UpsertBookmark_Params
  last_authorized_counts_params?: Counts_Params.Authorized
  ky: KyInstance
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) =>
    new Promise<Bookmark_Entity>(async (resolve) => {
      const data_source = new Bookmarks_DataSourceImpl(params.ky)
      const repository = new Bookmarks_RepositoryImpl(data_source)
      const upsert_bookmark_use_case = new UpsertBookmark_UseCase(repository)

      const result = await upsert_bookmark_use_case.invoke(params.bookmark)

      const state = get_state()

      if (params.bookmark.bookmark_id) {
        if (!state.bookmarks.incoming_bookmarks)
          throw new Error(
            '[upsert_bookmark] Incoming bookmarks should be there.',
          )
        if (!params.last_authorized_counts_params)
          throw new Error(
            '[upsert_bookmark] Last authorized counts params should be there.',
          )

        const is_archived_toggled_should_remove =
          params.bookmark.is_archived &&
          !params.last_authorized_counts_params.is_archived

        const is_restored_toggled_should_remove =
          !params.bookmark.is_archived &&
          params.last_authorized_counts_params.is_archived

        const is_starred_toggled_should_remove =
          params.bookmark.stars == 0 &&
          params.last_authorized_counts_params.starred_only

        const is_unread_toggled_should_remove =
          !params.bookmark.is_unread &&
          params.last_authorized_counts_params.unread_only

        if (
          is_archived_toggled_should_remove ||
          is_restored_toggled_should_remove ||
          is_unread_toggled_should_remove ||
          is_starred_toggled_should_remove
        ) {
          dispatch(
            bookmarks_actions.set_incoming_bookmarks(
              state.bookmarks.incoming_bookmarks.filter(
                (bookmark) => bookmark.id != params.bookmark.bookmark_id,
              ),
            ),
          )
        } else {
          dispatch(
            bookmarks_actions.set_incoming_bookmarks(
              state.bookmarks.incoming_bookmarks.map((bookmark) => {
                if (bookmark.id == result.id) {
                  return {
                    ...result,
                    is_compact: false,
                  }
                } else {
                  return bookmark
                }
              }),
            ),
          )
        }

        // Updating pinned here prevents layout shift.
        const pinned_data_source = new Pinned_DataSourceImpl(params.ky)
        const pinned_repository = new Pinned_RepositoryImpl(pinned_data_source)
        const get_pinned_use_case = new GetPinnedAuthorized_UseCase(
          pinned_repository,
        )
        dispatch(pinned_actions.set_is_fetching(true))
        const pinned_result = await get_pinned_use_case.invoke()
        dispatch(pinned_actions.set_is_fetching(false))
        dispatch(pinned_actions.set_items(pinned_result))
        dispatch(pinned_actions.set_fetched_at_timestamp(Date.now()))

        await dispatch(
          counts_actions.refresh_authorized_counts({
            last_authorized_counts_params: params.last_authorized_counts_params,
            ky: params.ky,
          }),
        )
      }

      resolve(result)
    })
}
