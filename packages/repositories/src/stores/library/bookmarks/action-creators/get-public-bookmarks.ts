import { bookmarks_actions } from '../bookmarks.slice'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { counts_actions } from '../../counts/counts.slice'
import { GetBookmarksOnPublicUser_UseCase } from '@repositories/modules/bookmarks/domain/usecases/get-bookmarks-on-public-user.use-case'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { GetBookmarks_Params } from '@repositories/modules/bookmarks/domain/types/get-bookmarks.params'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { backOff } from 'exponential-backoff'
import { backoff_options } from '@repositories/core/backoff-options'
import { KyInstance } from 'ky'
import { tag_hierarchies_actions } from '../../tag-hierarchies/tag-hierarchies.slice'
import { pinned_actions } from '../../pinned/pinned.slice'

export const get_public_bookmarks = (params: {
  request_params: GetBookmarks_Params.Public
  ky: KyInstance
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const data_source = new Bookmarks_DataSourceImpl(params.ky)
    const repository = new Bookmarks_RepositoryImpl(data_source)
    const get_bookmarks = new GetBookmarksOnPublicUser_UseCase(repository)

    dispatch(bookmarks_actions.set_is_fetching(true))

    if (params.request_params.after) {
      dispatch(bookmarks_actions.set_is_fetching_more_bookmarks(true))
    } else {
      dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(true))
    }

    let should_refetch_counts = false
    let should_refetch_pinned = false

    const get_result = async () => {
      const result = await get_bookmarks.invoke(params.request_params)
      const state = get_state()
      if (
        state.bookmarks.processing_progress !== undefined &&
        result.processing_progress === undefined
      ) {
        // Refresh tag hierarchies so they can have newly generated counts.
        dispatch(
          tag_hierarchies_actions.get_tag_hierarchies_authorized({
            request_params: {
              gte: params.request_params.yyyymm_gte,
              lte: params.request_params.yyyymm_lte,
              is_archived: params.request_params.is_archived,
              starred_only: params.request_params.starred_only,
            },
            ky: params.ky,
          }),
        )
      }
      dispatch(
        bookmarks_actions.set_processing_progress(result.processing_progress),
      )
      dispatch(bookmarks_actions.set_import_progress(result.import_progress))
      if (
        result.processing_progress !== undefined ||
        result.import_progress !== undefined
      ) {
        if (result.import_progress !== undefined) {
          should_refetch_pinned = true
        }
        should_refetch_counts = true
        throw new Error()
      } else {
        return result
      }
    }

    const result = await backOff(get_result, backoff_options)

    if (should_refetch_counts) {
      dispatch(counts_actions.set_should_refetch(true))
    }
    if (should_refetch_pinned) {
      dispatch(pinned_actions.set_should_refetch(true))
    }

    let bookmarks_with_density: Bookmark_Entity[] = []

    if (get_state().bookmarks.density == 'compact') {
      bookmarks_with_density = result.bookmarks
        ? result.bookmarks.map((bookmark) => ({
            ...bookmark,
            is_compact: true,
          }))
        : []
    } else {
      bookmarks_with_density = result.bookmarks || []
    }

    dispatch(bookmarks_actions.set_is_fetching(false))
    dispatch(bookmarks_actions.set_showing_bookmarks_fetched_by_ids(false))
    dispatch(
      bookmarks_actions.set_has_more_bookmarks(
        result.pagination?.has_more || false,
      ),
    )

    if (params.request_params.after) {
      dispatch(bookmarks_actions.set_more_bookmarks(bookmarks_with_density))
      dispatch(bookmarks_actions.set_is_fetching_more_bookmarks(false))
    } else {
      dispatch(bookmarks_actions.set_incoming_bookmarks(bookmarks_with_density))
      dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(false))
      dispatch(
        bookmarks_actions.set_first_bookmarks_fetched_at_timestamp(Date.now()),
      )
    }
  }
}
