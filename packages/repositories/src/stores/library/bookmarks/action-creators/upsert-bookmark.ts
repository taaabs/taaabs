import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { UpsertBookmark_UseCase } from '@repositories/modules/bookmarks/domain/usecases/upsert-bookmark.use-case'
import { bookmarks_actions } from '../bookmarks.slice'
import { months_actions } from '../../months/months.slice'

export const upsert_bookmark = (params: {
  bookmark: UpsertBookmark_Params
  api_url: string
  auth_token: string
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const state = get_state()

    if (params.bookmark.bookmark_id && !state.bookmarks.bookmarks)
      throw new Error('[upsert_bookmark] Bookmarks should be there')

    const data_source = new Bookmarks_DataSourceImpl(
      params.api_url,
      params.auth_token,
    )
    const repository = new Bookmarks_RepositoryImpl(data_source)
    const upsert_bookmark_use_case = new UpsertBookmark_UseCase(repository)

    dispatch(bookmarks_actions.set_is_updating_bookmarks(true))

    await upsert_bookmark_use_case.invoke(params.bookmark)

    dispatch(
      months_actions.refresh_authorized_months({
        api_url: params.api_url,
        auth_token: params.auth_token,
      }),
    )
  }
}
