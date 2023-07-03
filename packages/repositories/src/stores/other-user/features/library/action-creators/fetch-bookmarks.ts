import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { GetPublicBookmarks } from '@repositories/modules/bookmarks/domain/usecases/get-public-bookmarks'
import { BookmarksDataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks-data-source-impl'
import { BookmarksRepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks-repository-impl'
import { OtherUserDispatch } from '@repositories/stores/other-user/other-user.store'
import { libraryActions } from '../library.slice'

export const fetchBookmarks = (
  params: BookmarksParams.Public,
  apiUrl: string,
) => {
  return async (dispatch: OtherUserDispatch) => {
    const dataSource = new BookmarksDataSourceImpl(apiUrl)
    const repository = new BookmarksRepositoryImpl(dataSource)
    const getBookmarks = new GetPublicBookmarks(repository)

    dispatch(libraryActions.setIsFetchingBookmarks(true))
    const { bookmarks, pagination } = await getBookmarks.invoke(params)
    dispatch(libraryActions.setBookmarks(bookmarks))
    dispatch(libraryActions.setHasMoreBookmarks(pagination.hasMore))
    dispatch(libraryActions.setIsFetchingBookmarks(false))
  }
}
