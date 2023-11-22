import { LibrarySearch_DataSourceImpl } from '@repositories/modules/library-search/infrastructure/data-sources/library-search.data-source-impl'
import { LibraryDispatch } from '../../library.store'
import { LibrarySearch_RepositoryImpl } from '@repositories/modules/library-search/infrastructure/repositories/library-search.repository-impl'
import { GetBookmarksOnAuthorizedUser_UseCase } from '@repositories/modules/library-search/domain/usecases/get-bookmarks-on-authorized-user.user-case'
import { search_actions } from '../search.slice'

export const initialize_search = (params: {
  api_url: string
  auth_token: string
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new LibrarySearch_DataSourceImpl(
      params.api_url,
      params.auth_token,
    )
    const repository = new LibrarySearch_RepositoryImpl(data_source)
    const get_bookmarks = new GetBookmarksOnAuthorizedUser_UseCase(repository)

    dispatch(search_actions.set_is_getting_searchable_bookmarks(true))

    const { bookmarks } = await get_bookmarks.invoke({})

    dispatch(search_actions.set_is_getting_searchable_bookmarks(false))
    dispatch(search_actions.set_searchable_bookmarks(bookmarks))
  }
}
