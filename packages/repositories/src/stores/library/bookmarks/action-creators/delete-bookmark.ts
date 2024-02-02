import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { DeleteBookmark_UseCase } from '@repositories/modules/bookmarks/domain/usecases/delete-bookmark.use-case'
import { bookmarks_actions } from '../bookmarks.slice'
import { counts_actions } from '../../counts/counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'

export const delete_bookmark = (params: {
  bookmark_id: number
  last_authorized_counts_params: Counts_Params.Authorized
  api_url: string
  auth_token: string
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) =>
    new Promise(async (resolve) => {
      const state = get_state()

      if (!state.bookmarks.bookmarks)
        throw new Error('[delete_bookmark] Bookmarks should be there')

      const data_source = new Bookmarks_DataSourceImpl(
        params.api_url,
        params.auth_token,
      )

      dispatch(bookmarks_actions.set_is_updating_bookmarks(true))

      const repository = new Bookmarks_RepositoryImpl(data_source)
      const delete_bookmark_use_case = new DeleteBookmark_UseCase(repository)
      await delete_bookmark_use_case.invoke({ bookmark_id: params.bookmark_id })

      dispatch(
        bookmarks_actions.set_incoming_bookmarks(
          state.bookmarks.bookmarks.filter(
            (bookmark) => bookmark.id != params.bookmark_id,
          ),
        ),
      )
      dispatch(
        counts_actions.refresh_authorized_counts({
          last_authorized_counts_params: params.last_authorized_counts_params,
          api_url: params.api_url,
          auth_token: params.auth_token,
        }),
      )
      resolve(null)
    })
}
