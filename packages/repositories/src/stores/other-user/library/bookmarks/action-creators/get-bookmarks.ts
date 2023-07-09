import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { GetPublicBookmarks } from '@repositories/modules/bookmarks/domain/usecases/get-public-bookmarks'
import { BookmarksDataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks-data-source-impl'
import { BookmarksRepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks-repository-impl'
import {
  LibraryDispatch,
  LibraryState,
} from '@repositories/stores/other-user/library/library.store'
import { bookmarksActions } from '../bookmarks.slice'

export const getBookmarks = ({
  params,
  apiUrl,
}: {
  params: BookmarksParams.Public
  apiUrl: string
}) => {
  return async (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const state = getState().bookmarks

    const dataSource = new BookmarksDataSourceImpl(apiUrl)
    const repository = new BookmarksRepositoryImpl(dataSource)
    const getBookmarks = new GetPublicBookmarks(repository)

    if (params.after) {
      dispatch(bookmarksActions.setIsGettingMoreBookmarks(true))
    } else {
      dispatch(bookmarksActions.setIsGettingFirstBookmarks(true))
      dispatch(bookmarksActions.setHasMoreBookmarks(null))
    }
    const { bookmarks, pagination } = await getBookmarks.invoke(params)
    if (params.after) {
      if (state.bookmarks == null) {
        throw 'Bookmarks should not be null.'
      }
      dispatch(
        bookmarksActions.setBookmarks([...state.bookmarks, ...bookmarks]),
      )
      dispatch(bookmarksActions.setIsGettingMoreBookmarks(false))
    } else {
      dispatch(bookmarksActions.setBookmarks(bookmarks))
      dispatch(bookmarksActions.setIsGettingFirstBookmarks(false))
    }
    dispatch(bookmarksActions.setHasMoreBookmarks(pagination.hasMore))
  }
}
