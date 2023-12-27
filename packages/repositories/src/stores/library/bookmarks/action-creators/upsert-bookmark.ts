import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { UpsertBookmark_UseCase } from '@repositories/modules/bookmarks/domain/usecases/upsert-bookmark.use-case'
import { bookmarks_actions } from '../bookmarks.slice'
import { counts_actions } from '../../counts/counts.slice'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'

export const upsert_bookmark = (params: {
  bookmark: UpsertBookmark_Params
  last_authorized_counts_params?: Counts_Params.Authorized
  api_url: string
  auth_token: string
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    dispatch(bookmarks_actions.set_is_updating_bookmarks(true))

    const data_source = new Bookmarks_DataSourceImpl(
      params.api_url,
      params.auth_token,
    )
    const repository = new Bookmarks_RepositoryImpl(data_source)
    const upsert_bookmark_use_case = new UpsertBookmark_UseCase(repository)

    const result = await upsert_bookmark_use_case.invoke(params.bookmark)

    const state = get_state()

    if (params.bookmark.bookmark_id) {
      if (!state.bookmarks.bookmarks)
        throw new Error('[upsert_bookmark] Bookmarks should be there.')
      if (!params.last_authorized_counts_params)
        throw new Error(
          '[upsert_bookmark] Last authorized months params should be there.',
        )

      const is_archived_toggled_should_remove =
        params.bookmark.is_archived &&
        !(params.last_authorized_counts_params.filter == LibraryFilter.Archived)

      const is_restored_toggled_should_remove =
        !params.bookmark.is_archived &&
        params.last_authorized_counts_params.filter == LibraryFilter.Archived

      const is_starred_toggled_should_remove =
        (params.bookmark.stars == 0 &&
          (params.last_authorized_counts_params.filter ==
            LibraryFilter.OneStar ||
            params.last_authorized_counts_params.filter ==
              LibraryFilter.TwoStars ||
            params.last_authorized_counts_params.filter ==
              LibraryFilter.ThreeStars ||
            params.last_authorized_counts_params.filter ==
              LibraryFilter.OneStarUnread ||
            params.last_authorized_counts_params.filter ==
              LibraryFilter.TwoStarsUnread ||
            params.last_authorized_counts_params.filter ==
              LibraryFilter.ThreeStarsUnread)) ||
        (params.bookmark.stars == 1 &&
          (params.last_authorized_counts_params.filter ==
            LibraryFilter.TwoStars ||
            params.last_authorized_counts_params.filter ==
              LibraryFilter.ThreeStars ||
            params.last_authorized_counts_params.filter ==
              LibraryFilter.TwoStarsUnread ||
            params.last_authorized_counts_params.filter ==
              LibraryFilter.ThreeStarsUnread)) ||
        (params.bookmark.stars == 2 &&
          (params.last_authorized_counts_params.filter ==
            LibraryFilter.ThreeStars ||
            params.last_authorized_counts_params.filter ==
              LibraryFilter.ThreeStarsUnread))

      const is_unread_toggled_should_remove =
        !params.bookmark.is_unread &&
        (params.last_authorized_counts_params.filter == LibraryFilter.Unread ||
          params.last_authorized_counts_params.filter ==
            LibraryFilter.OneStarUnread ||
          params.last_authorized_counts_params.filter ==
            LibraryFilter.TwoStarsUnread ||
          params.last_authorized_counts_params.filter ==
            LibraryFilter.ThreeStarsUnread)

      if (
        is_archived_toggled_should_remove ||
        is_restored_toggled_should_remove ||
        is_unread_toggled_should_remove ||
        is_starred_toggled_should_remove
      ) {
        dispatch(
          bookmarks_actions.set_incoming_bookmarks(
            state.bookmarks.bookmarks.filter(
              (bookmark) => bookmark.id != params.bookmark.bookmark_id,
            ),
          ),
        )
      } else {
        dispatch(
          bookmarks_actions.set_incoming_bookmarks(
            state.bookmarks.bookmarks.map((bookmark) => {
              if (bookmark.id == result.id) {
                return result
              } else {
                return bookmark
              }
            }),
          ),
        )
      }

      dispatch(
        counts_actions.refresh_authorized_counts({
          last_authorized_counts_params: params.last_authorized_counts_params,
          api_url: params.api_url,
          auth_token: params.auth_token,
        }),
      )

      if (is_archived_toggled_should_remove) {
        dispatch(bookmarks_actions.set_toast_message('archived'))
      } else if (is_restored_toggled_should_remove) {
        dispatch(bookmarks_actions.set_toast_message('restored'))
      } else if (
        is_unread_toggled_should_remove ||
        is_starred_toggled_should_remove
      ) {
        dispatch(
          bookmarks_actions.set_toast_message('filter-no-longer-satisfied'),
        )
      }
    }
  }
}
