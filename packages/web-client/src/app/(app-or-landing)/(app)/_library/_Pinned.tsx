import { use_library_dispatch } from '@/stores/library'
import { useContext } from 'react'
import { browser_storage } from '@/constants/browser-storage'
import { toast } from 'react-toastify'
import { Filter } from '@/types/library/filter'
import { pinned_actions } from '@repositories/stores/library/pinned/pinned.slice'
import { RecordVisit_Params } from '@repositories/modules/bookmarks/domain/types/record-visit.params'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { ModalContext } from '@/providers/modal-provider'
import { AuthContext } from '@/app/auth-provider'
import { LocalDb } from '@/app/local-db-provider'
import { Dictionary } from '@/dictionaries/dictionary'
import { reader_modal_setter } from '@/modals/reader-modal/reader-modal-setter'
import { GetLinksData_Ro } from '@repositories/modules/bookmarks/domain/types/get-links-data.ro'
import { PinnedBookmarks as UiAppLibrary_PinnedBookmarks } from '@web-ui/components/app/library/PinnedBookmarks'
import { LibraryContext } from './Library'

namespace _Pinned {
  export type Props = {
    local_db: LocalDb
    dictionary: Dictionary
  }
}

export const _Pinned: React.FC<_Pinned.Props> = (props) => {
  const auth_context = useContext(AuthContext)!
  const modal_context = useContext(ModalContext)!
  const {
    tag_view_options_hook,
    date_view_options_hook,
    filter_view_options_hook,
    pinned_hook,

    username,
    is_archived_filter,
    library_updated_at_timestamp,
    pinned_updated_at,
    popstate_count,
  } = useContext(LibraryContext)!
  const dispatch = use_library_dispatch()

  return (
    <UiAppLibrary_PinnedBookmarks
      key={`${pinned_updated_at}-${popstate_count}`}
      library_updated_at_timestamp={library_updated_at_timestamp}
      favicon_host={`${process.env.NEXT_PUBLIC_API_URL}/v1/favicons`}
      translations={{
        nothing_pinned: props.dictionary.app.library.nothing_pinned,
        open_original_url:
          props.dictionary.app.library.bookmark.open_original_url,
        open_snapshot: props.dictionary.app.library.bookmark.open_snapshot,
      }}
      items={
        pinned_hook.items?.map((item) => ({
          bookmark_id: item.bookmark_id,
          url: item.url,
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at),
          title: item.title,
          is_unsorted: item.is_unsorted,
          is_archived: item.is_archived,
          is_parsed: item.is_parsed,
          is_public: item.is_public,
          stars: item.stars,
          tags: item.tags,
          open_snapshot: item.open_snapshot,
          favicon: item.favicon,
        })) || []
      }
      is_draggable={!username && !pinned_hook.is_updating}
      on_change={async (updated_pinned) => {
        await dispatch(
          pinned_actions.update_pinned({
            update_pinned_params: {
              items: updated_pinned.map((item) => ({
                url: item.url,
                is_public: item.is_public,
                title: item.title,
              })),
            },
            ky: auth_context.ky_instance,
            encryption_key: auth_context.auth_data!.encryption_key,
          }),
        )
        toast.success(
          props.dictionary.app.library.pinned_links_has_beed_updated,
        )
      }}
      on_link_click={async (item) => {
        if (!username) {
          const record_visit_params: RecordVisit_Params = {
            bookmark_id: item.bookmark_id,
            visited_at: new Date().toISOString(),
          }
          localStorage.setItem(
            browser_storage.local_storage.authorized_library
              .record_visit_params,
            JSON.stringify(record_visit_params),
          )
        }
        window.onbeforeunload = null
        const url = item.open_snapshot
          ? url_to_wayback({ date: item.created_at, url: item.url })
          : item.url
        setTimeout(() => {
          location.href = url
        }, 0)
      }}
      on_link_middle_click={(item) => {
        if (!username) {
          const data_source = new Bookmarks_DataSourceImpl(
            auth_context.ky_instance,
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          repository.record_visit({
            bookmark_id: item.bookmark_id,
            visited_at: new Date().toISOString(),
          })
        }
      }}
      on_new_tab_click={(item) => {
        if (!username) {
          const data_source = new Bookmarks_DataSourceImpl(
            auth_context.ky_instance,
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          repository.record_visit({
            bookmark_id: item.bookmark_id,
            visited_at: new Date().toISOString(),
          })
        }
        const url = item.open_snapshot
          ? url_to_wayback({ date: item.created_at, url: item.url })
          : item.url
        window.open(url, '_blank')
      }}
      on_reading_mode_click={async (item) => {
        const data_source = new Bookmarks_DataSourceImpl(
          auth_context.ky_instance,
        )
        const repository = new Bookmarks_RepositoryImpl(data_source)
        let links_data: GetLinksData_Ro | undefined = undefined
        if (!username) {
          links_data = await repository.get_links_data_authorized(
            {
              bookmark_id: item.bookmark_id,
              bookmark_updated_at: item.updated_at,
            },
            auth_context.auth_data!.encryption_key,
          )
        } else {
          links_data = await repository.get_links_data_public({
            bookmark_id: item.bookmark_id,
            bookmark_updated_at: item.updated_at,
            username,
          })
        }
        const link_data = links_data.find((link) => link.url == item.url)
        if (link_data && link_data.reader_data) {
          reader_modal_setter({
            reader_data: link_data.reader_data,
            dictionary: props.dictionary,
            modal_context,
          })
        }
        if (!username) {
          const data_source = new Bookmarks_DataSourceImpl(
            auth_context.ky_instance,
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          repository.record_visit({
            bookmark_id: item.bookmark_id,
            visited_at: new Date().toISOString(),
          })
        }
      }}
      on_is_visible={(item) => {
        if (item.is_parsed) {
          const data_source = new Bookmarks_DataSourceImpl(
            auth_context.ky_instance,
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          if (!username) {
            repository.get_links_data_authorized(
              {
                bookmark_id: item.bookmark_id,
                bookmark_updated_at: item.updated_at,
              },
              auth_context.auth_data!.encryption_key,
            )
          } else {
            repository.get_links_data_public({
              bookmark_id: item.bookmark_id,
              bookmark_updated_at: item.updated_at,
              username,
            })
          }
        }
      }}
      selected_tags={tag_view_options_hook.selected_tags}
      selected_starred={
        filter_view_options_hook.current_filter == Filter.STARRED ||
        filter_view_options_hook.current_filter == Filter.STARRED_UNSORTED ||
        filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED ||
        filter_view_options_hook.current_filter ==
          Filter.ARCHIVED_STARRED_UNSORTED
      }
      selected_unsorted={
        filter_view_options_hook.current_filter == Filter.UNSORTED ||
        filter_view_options_hook.current_filter == Filter.STARRED_UNSORTED ||
        filter_view_options_hook.current_filter == Filter.ARCHIVED_UNSORTED ||
        filter_view_options_hook.current_filter ==
          Filter.ARCHIVED_STARRED_UNSORTED
      }
      selected_archived={is_archived_filter}
      current_gte={date_view_options_hook.current_gte}
      current_lte={date_view_options_hook.current_lte}
    />
  )
}