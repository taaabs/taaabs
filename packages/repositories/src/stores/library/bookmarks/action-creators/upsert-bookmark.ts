import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { UpsertBookmark_UseCase } from '@repositories/modules/bookmarks/domain/usecases/upsert-bookmark.use-case'
import { bookmarks_actions } from '../bookmarks.slice'
import { months_actions } from '../../months/months.slice'
import { Months_Params } from '@repositories/modules/months/domain/types/months.params'
import { LibraryFilter } from '@shared/types/common/library-filter'

export const upsert_bookmark = (params: {
  bookmark: UpsertBookmark_Params
  last_authorized_months_params?: Months_Params.Authorized
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

    await upsert_bookmark_use_case.invoke(params.bookmark)

    const state = get_state()

    if (params.bookmark.bookmark_id) {
      if (!state.bookmarks.bookmarks)
        throw new Error('[upsert_bookmark] Bookmarks should be there')
      if (!params.last_authorized_months_params)
        throw new Error(
          '[upsert_bookmark] Last authorized months params should be there',
        )

      const is_archived_toggled =
        (!params.bookmark.is_archived &&
          (params.last_authorized_months_params.filter ==
            LibraryFilter.Archived ||
            params.last_authorized_months_params.filter ==
              LibraryFilter.ArchivedNsfwExcluded)) ||
        (params.bookmark.is_archived &&
          !(
            params.last_authorized_months_params.filter ==
              LibraryFilter.Archived ||
            params.last_authorized_months_params.filter ==
              LibraryFilter.ArchivedNsfwExcluded
          ))

      const is_nsfw_toggled =
        params.bookmark.is_nsfw &&
        (params.last_authorized_months_params.filter ==
          LibraryFilter.AllNsfwExcluded ||
          params.last_authorized_months_params.filter ==
            LibraryFilter.ArchivedNsfwExcluded ||
          params.last_authorized_months_params.filter ==
            LibraryFilter.StarredOnlyNsfwExcluded)

      const is_starred_toggled =
        !params.bookmark.is_starred &&
        (params.last_authorized_months_params.filter ==
          LibraryFilter.StarredOnly ||
          params.last_authorized_months_params.filter ==
            LibraryFilter.StarredOnlyNsfwExcluded)

      if (is_archived_toggled || is_nsfw_toggled || is_starred_toggled) {
        dispatch(
          bookmarks_actions.set_incoming_bookmarks(
            state.bookmarks.bookmarks.filter(
              (bookmark) => bookmark.id != params.bookmark.bookmark_id,
            ),
          ),
        )
        dispatch(
          months_actions.refresh_authorized_months({
            last_authorized_months_params: params.last_authorized_months_params,
            api_url: params.api_url,
            auth_token: params.auth_token,
          }),
        )
      }
    }
  }
}
