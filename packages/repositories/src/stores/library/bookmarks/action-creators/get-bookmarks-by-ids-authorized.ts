import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { bookmarks_actions } from '../bookmarks.slice'
import { GetBookmarksByIds_Params } from '@repositories/modules/bookmarks/domain/types/get-bookmarks-by-ids.params'
import { GetBookmarksByIdsAuthorized_UseCase } from '@repositories/modules/bookmarks/domain/usecases/get-bookmarks-by-ids-authorized.use-case'

export const get_bookmarks_by_ids_authorized = (params: {
  request_params: GetBookmarksByIds_Params.Authorized
  is_next_page: boolean
  api_url: string
  auth_token: string
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new Bookmarks_DataSourceImpl(
      params.api_url,
      params.auth_token,
    )
    const repository = new Bookmarks_RepositoryImpl(data_source)
    const get_bookomarks_by_ids = new GetBookmarksByIdsAuthorized_UseCase(
      repository,
    )
    dispatch(bookmarks_actions.set_is_in_search_mode(true))
    dispatch(bookmarks_actions.set_is_fetching_data(true))
    if (params.is_next_page) {
      dispatch(bookmarks_actions.set_is_fetching_more_bookmarks(true))
    } else {
      dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(true))
    }

    const { bookmarks } = await get_bookomarks_by_ids.invoke(
      params.request_params,
    )

    if (params.is_next_page) {
      dispatch(bookmarks_actions.set_more_bookmarks(bookmarks))
      dispatch(bookmarks_actions.set_is_fetching_more_bookmarks(false))
    } else {
      dispatch(bookmarks_actions.set_bookmarks(bookmarks))
      dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(false))
    }
  }
}
