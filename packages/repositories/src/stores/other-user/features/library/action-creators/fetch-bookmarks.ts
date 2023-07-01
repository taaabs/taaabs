import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { GetPublicBookmarks } from '@repositories/modules/bookmarks/domain/usecases/get-public-bookmarks'
import { BookmarksDataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks-data-source-impl'
import { BookmarksRepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks-repository-impl'
import { Dispatch } from '@repositories/stores/other-user/other-user.store'
import axios from 'axios'
import { libraryActions } from '../library.slice'

export const fetchBookmarks = (params: BookmarksParams.Public) => {
  return async (dispatch: Dispatch) => {
    const dataSource = new BookmarksDataSourceImpl(axios)
    const repository = new BookmarksRepositoryImpl(dataSource)
    const getBookmarks = new GetPublicBookmarks(repository)

    dispatch(libraryActions.setIsFetchingBookmarks(true))
    const { bookmarks, pagination } = await getBookmarks.invoke(params)
    dispatch(libraryActions.setIsFetchingBookmarks(false))
    dispatch(libraryActions.setBookmarks(bookmarks))
    dispatch(libraryActions.setHasMoreBookmarks(pagination.hasMore))
  }
}
