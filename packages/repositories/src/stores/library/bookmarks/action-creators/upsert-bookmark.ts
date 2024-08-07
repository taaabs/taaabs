import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { bookmarks_actions } from '../bookmarks.slice'
import { counts_actions } from '../../counts/counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'
import { KyInstance } from 'ky'
import { Pinned_DataSourceImpl } from '@repositories/modules/pinned/infrastructure/data-sources/pinned.data-source-impl'
import { Pinned_RepositoryImpl } from '@repositories/modules/pinned/infrastructure/repositories/pinned.repository-impl'
import { pinned_actions } from '../../pinned/pinned.slice'
import { tag_hierarchies_actions } from '../../tag-hierarchies/tag-hierarchies.slice'
import { GetTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/get-tag-hierarchies.params'
import { GetLinksData_Ro } from '@repositories/modules/bookmarks/domain/types/get-links-data.ro'

export const upsert_bookmark = (params: {
  bookmark: UpsertBookmark_Params
  should_refetch_links_reader_data?: boolean
  last_authorized_counts_params?: Counts_Params.Authorized
  get_tag_hierarchies_request_params?: GetTagHierarchies_Params.Authorized
  ky: KyInstance
  encryption_key: Uint8Array
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) =>
    new Promise<Bookmark_Entity>(async (resolve) => {
      const data_source = new Bookmarks_DataSourceImpl(params.ky)
      const repository = new Bookmarks_RepositoryImpl(data_source)
      let links_data: GetLinksData_Ro | undefined = undefined
      if (
        params.bookmark.bookmark_id &&
        params.should_refetch_links_reader_data
      ) {
        links_data = await repository.get_links_data_authorized(
          {
            bookmark_id: params.bookmark.bookmark_id,
          },
          params.encryption_key,
        )
      }
      const result = await repository.upsert_bookmark(
        {
          ...params.bookmark,
          ...(links_data
            ? {
                links: params.bookmark.links.map((link) => ({
                  ...link,
                  reader_data: links_data.find(
                    (link_data) => link_data.url == link.url,
                  )?.reader_data,
                })),
              }
            : {}),
        },
        params.encryption_key,
      )

      const state = get_state()

      if (params.bookmark.bookmark_id) {
        if (!state.bookmarks.incoming_bookmarks)
          throw new Error(
            '[upsert_bookmark] Incoming bookmarks should be there.',
          )
        if (!params.last_authorized_counts_params)
          throw new Error(
            '[upsert_bookmark] Last authorized counts params should be there.',
          )

        const is_archived_toggled_should_remove =
          params.bookmark.is_archived &&
          !params.last_authorized_counts_params.is_archived

        const is_restored_toggled_should_remove =
          !params.bookmark.is_archived &&
          params.last_authorized_counts_params.is_archived

        const is_starred_toggled_should_remove =
          params.bookmark.stars == 0 &&
          params.last_authorized_counts_params.starred_only

        const is_unsorted_toggled_should_remove =
          (!params.bookmark.is_unsorted &&
            params.bookmark.is_unsorted !== undefined) &&
          params.last_authorized_counts_params.unsorted_only

        if (
          is_archived_toggled_should_remove ||
          is_restored_toggled_should_remove ||
          is_unsorted_toggled_should_remove ||
          is_starred_toggled_should_remove
        ) {
          dispatch(
            bookmarks_actions.set_incoming_bookmarks(
              state.bookmarks.incoming_bookmarks.filter(
                (bookmark) => bookmark.id != params.bookmark.bookmark_id,
              ),
            ),
          )
        } else {
          dispatch(
            bookmarks_actions.set_incoming_bookmarks(
              state.bookmarks.incoming_bookmarks.map((bookmark) => {
                if (bookmark.id == params.bookmark.bookmark_id) {
                  return {
                    ...result,
                    is_compact: false,
                  }
                } else {
                  return bookmark
                }
              }),
            ),
          )
        }

        // We refetch additional required things here to have those requests running in parallel.
        const pinned_data_source = new Pinned_DataSourceImpl(params.ky)
        const pinned_repository = new Pinned_RepositoryImpl(pinned_data_source)
        dispatch(pinned_actions.set_is_fetching(true))
        const pinned_result = (
          await Promise.all([
            pinned_repository.get_pinned_authorized(params.encryption_key),
            dispatch(
              counts_actions.refresh_authorized_counts({
                last_authorized_counts_params:
                  params.last_authorized_counts_params,
                ky: params.ky,
                encryption_key: params.encryption_key,
              }),
            ),
            params.get_tag_hierarchies_request_params &&
              dispatch(
                tag_hierarchies_actions.get_tag_hierarchies_authorized({
                  request_params: params.get_tag_hierarchies_request_params,
                  ky: params.ky,
                  encryption_key: params.encryption_key,
                }),
              ),
          ])
        )[0]
        dispatch(pinned_actions.set_is_fetching(false))
        dispatch(pinned_actions.set_items(pinned_result))
        dispatch(pinned_actions.set_fetched_at_timestamp(Date.now()))
      }

      resolve(result)
    })
}
