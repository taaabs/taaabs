import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { browser_storage } from '@/constants/browser-storage'
import { upsert_bookmark_modal_setter } from '@/modals/upsert-bookmark/upsert-bookmark-modal-setter'
import { toast } from 'react-toastify'
import { system_values } from '@shared/constants/system-values'
import { Filter } from '@/types/library/filter'
import { RecordVisit_Params } from '@repositories/modules/bookmarks/domain/types/record-visit.params'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { Dropdown as Ui_Dropdown } from '@web-ui/components/Dropdown'
import { StandardItem as Ui_Dropdown_StandardItem } from '@web-ui/components/Dropdown/StandardItem'
import { CheckboxItem as Ui_Dropdown_CheckboxItem } from '@web-ui/components/Dropdown/CheckboxItem'
import { Separator as Ui_Dropdown_Separator } from '@web-ui/components/Dropdown/Separator'
import { Stars as Ui_Dropdown_Stars } from '@web-ui/components/Dropdown/Stars'
import { delete_bookmark_modal_setter } from '@/modals/delete-bookmark/delete-bookmark-modal-setter'
import { reader_modal_setter } from '@/modals/reader-modal/reader-modal-setter'
import { GetLinksData_Ro } from '@repositories/modules/bookmarks/domain/types/get-links-data.ro'
import { useContext, useRef, useState } from 'react'
import { LibraryContext } from './Library'
import { Dictionary } from '@/dictionaries/dictionary'
import { use_library_dispatch } from '@/stores/library'
import { useSearchParams } from 'next/navigation'
import { ModalContext } from '@/providers/ModalProvider'
import { LocalDb } from '@/providers/LocalDbProvider'
import { _Bookmark } from './_bookmarks/_Bookmark'
import { edit_tags_modal_setter } from '@/modals/edit-tags/edit-tags-modal-setter'
import { saves_modal_setter } from '@/modals/saves/saves-modal-setter'
import { AuthContext } from '@/providers/AuthProvider'
import { video_embed_setter } from '@/modals/video-embed/video-embed-modal-setter'
import { PopstateCountContext } from '@/providers/PopstateCountProvider'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

namespace _Bookmarks {
  export type Props = {
    local_db: LocalDb
    dictionary: Dictionary
  }
}

export const _Bookmarks: React.FC<_Bookmarks.Props> = (props) => {
  const auth_context = useContext(AuthContext)
  const modal_context = useContext(ModalContext)
  const {
    bookmarks_hook,
    counts_hook,
    search_hook,
    points_hook,
    tag_view_options_hook,
    sort_by_view_options_hook,
    tag_hierarchies_hook,
    filter_view_options_hook,
    date_view_options_hook,

    username,
    library_updated_at_timestamp,
    is_fetching_first_bookmarks,
    is_archived_filter,
    on_tag_rename_click,
  } = useContext(LibraryContext)
  const dispatch = use_library_dispatch()
  const search_params = useSearchParams()

  // Handling back navigation.
  // "popstate_count" changes before "search_params".
  const { popstate_count } = useContext(PopstateCountContext)
  const is_rerender_trigger_update_enabled = useRef(false)
  const [rerender_trigger, set_rerender_trigger] = useState<number>()
  useUpdateEffect(() => {
    is_rerender_trigger_update_enabled.current = true
  }, [popstate_count])
  useUpdateEffect(() => {
    if (is_rerender_trigger_update_enabled.current) {
      set_rerender_trigger(Date.now())
      is_rerender_trigger_update_enabled.current = false
    }
  }, [search_params])

  return bookmarks_hook.bookmarks?.map((bookmark, i) => {
    const render_menu = () => {
      return !username ? (
        <Ui_Dropdown>
          <Ui_Dropdown_Stars
            no_selected={bookmark.stars}
            on_click={async (no_stars) => {
              dispatch(bookmarks_actions.set_is_upserting(true))
              const modified_bookmark: UpsertBookmark_Params = {
                bookmark_id: bookmark.id,
                stars: bookmark.stars == no_stars ? 0 : no_stars,
              }
              await dispatch(
                bookmarks_actions.upsert_bookmark({
                  bookmark: modified_bookmark,
                  last_authorized_counts_params:
                    JSON.parse(
                      sessionStorage.getItem(
                        browser_storage.session_storage.library
                          .last_authorized_counts_params,
                      ) || 'null',
                    ) || undefined,
                  get_tag_hierarchies_request_params:
                    tag_hierarchies_hook.get_authorized_request_params({
                      filter: filter_view_options_hook.current_filter,
                      gte: date_view_options_hook.current_gte,
                      lte: date_view_options_hook.current_lte,
                    }),
                  ky: auth_context.ky_instance,
                  encryption_key: auth_context.auth_data!.encryption_key,
                }),
              )
              if (
                search_hook.count &&
                (filter_view_options_hook.current_filter == Filter.STARRED ||
                  filter_view_options_hook.current_filter ==
                    Filter.STARRED_UNSORTED ||
                  filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED ||
                  filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED_UNSORTED) &&
                bookmark.stars == 1
              ) {
                search_hook.set_count(search_hook.count - 1)
              }
              dispatch(bookmarks_actions.set_is_upserting(false))
              toast.success(props.dictionary.app.library.bookmark_updated)
            }}
          />
          <Ui_Dropdown_CheckboxItem
            is_checked={
              bookmark.is_unsorted === undefined ? true : bookmark.is_unsorted
            }
            label={props.dictionary.app.library.bookmark.unsorted}
            on_click={async () => {
              dispatch(bookmarks_actions.set_is_upserting(true))
              const modified_bookmark: UpsertBookmark_Params = {
                bookmark_id: bookmark.id,
                is_unsorted: !(bookmark.is_unsorted === undefined
                  ? true
                  : bookmark.is_unsorted),
              }
              await dispatch(
                bookmarks_actions.upsert_bookmark({
                  bookmark: modified_bookmark,
                  last_authorized_counts_params:
                    JSON.parse(
                      sessionStorage.getItem(
                        browser_storage.session_storage.library
                          .last_authorized_counts_params,
                      ) || 'null',
                    ) || undefined,
                  get_tag_hierarchies_request_params:
                    tag_hierarchies_hook.get_authorized_request_params({
                      filter: filter_view_options_hook.current_filter,
                      gte: date_view_options_hook.current_gte,
                      lte: date_view_options_hook.current_lte,
                    }),
                  ky: auth_context.ky_instance,
                  encryption_key: auth_context.auth_data!.encryption_key,
                }),
              )
              if (
                search_hook.count &&
                (filter_view_options_hook.current_filter == Filter.UNSORTED ||
                  filter_view_options_hook.current_filter ==
                    Filter.STARRED_UNSORTED ||
                  filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED_UNSORTED) &&
                bookmark.is_unsorted
              ) {
                search_hook.set_count(search_hook.count! - 1)
              }
              dispatch(bookmarks_actions.set_is_upserting(false))
              toast.success(props.dictionary.app.library.bookmark_updated)
            }}
          />
          <Ui_Dropdown_Separator />
          <Ui_Dropdown_StandardItem
            icon_variant="EDIT"
            label={props.dictionary.app.library.bookmark.edit}
            on_click={async () => {
              const modified_bookmark = await upsert_bookmark_modal_setter({
                modal_context,
                bookmark,
                is_archived: is_archived_filter,
                dictionary: props.dictionary,
              })
              if (!modified_bookmark) {
                modal_context.close()
                return
              }
              dispatch(bookmarks_actions.set_is_upserting(true))
              let should_refetch_links_reader_data = false
              if (bookmark.is_public != modified_bookmark.is_public) {
                should_refetch_links_reader_data = true
              }
              if (
                !should_refetch_links_reader_data &&
                modified_bookmark.links
              ) {
                modified_bookmark.links.forEach((link) => {
                  const old_link = bookmark.links.find((l) => l.url == link.url)
                  if (old_link && old_link.is_public != link.is_public) {
                    should_refetch_links_reader_data = true
                  }
                })
              }
              const updated_bookmark = await dispatch(
                bookmarks_actions.upsert_bookmark({
                  bookmark: modified_bookmark,
                  should_refetch_links_reader_data,
                  last_authorized_counts_params:
                    JSON.parse(
                      sessionStorage.getItem(
                        browser_storage.session_storage.library
                          .last_authorized_counts_params,
                      ) || 'null',
                    ) || undefined,
                  get_tag_hierarchies_request_params:
                    tag_hierarchies_hook.get_authorized_request_params({
                      filter: filter_view_options_hook.current_filter,
                      gte: date_view_options_hook.current_gte,
                      lte: date_view_options_hook.current_lte,
                    }),
                  ky: auth_context.ky_instance,
                  encryption_key: auth_context.auth_data!.encryption_key,
                }),
              )
              const updated_tag_ids = updated_bookmark.tags.map((t) => t.id)
              // Filter out bookmark
              if (
                !tag_view_options_hook.selected_tags.every((t) =>
                  updated_tag_ids.includes(t),
                ) ||
                (updated_bookmark.is_unsorted == false &&
                  (filter_view_options_hook.current_filter ==
                    Filter.STARRED_UNSORTED ||
                    filter_view_options_hook.current_filter ==
                      Filter.UNSORTED ||
                    filter_view_options_hook.current_filter ==
                      Filter.ARCHIVED_UNSORTED ||
                    filter_view_options_hook.current_filter ==
                      Filter.ARCHIVED_STARRED_UNSORTED))
              ) {
                dispatch(
                  bookmarks_actions.filter_out_bookmark({
                    bookmark_id: updated_bookmark.id,
                  }),
                )
                if (search_hook.count) {
                  search_hook.set_count(search_hook.count - 1)
                }
              }
              // Unselect removed tags when there is no more bookmarks with them
              const tags_to_remove_from_search_params =
                tag_view_options_hook.selected_tags.filter((t) => {
                  const yields = Object.entries(counts_hook.tags!).find(
                    (tag) => parseInt(tag[0]) == t,
                  )![1].yields
                  return !updated_tag_ids.includes(t) && yields == 1
                })
              if (tags_to_remove_from_search_params.length) {
                dispatch(
                  bookmarks_actions.set_is_fetching_first_bookmarks(true),
                )
                tag_view_options_hook.remove_tags_from_search_params(
                  tags_to_remove_from_search_params,
                )
              }
              // Update highlights
              if (search_hook.result?.hits.length) {
                if (updated_bookmark.id != modified_bookmark.bookmark_id) {
                  await props.local_db.delete_bookmark({
                    db: (is_archived_filter
                      ? props.local_db.archived_db
                      : props.local_db.db)!,
                    bookmark_id: modified_bookmark.bookmark_id!,
                  })
                }
                await props.local_db.upsert_bookmark({
                  db: (is_archived_filter
                    ? props.local_db.archived_db
                    : props.local_db.db)!,
                  bookmark: {
                    id: updated_bookmark.id!,
                    is_archived: is_archived_filter,
                    is_unsorted: updated_bookmark.is_unsorted,
                    title: updated_bookmark.title,
                    note: updated_bookmark.note,
                    tags: updated_bookmark.tags.map((tag) => ({
                      name: tag.name,
                      id: tag.id,
                    })),
                    links: updated_bookmark.links.map((link) => ({
                      url: link.url,
                      site_path: link.site_path,
                    })),
                    created_at: updated_bookmark.created_at,
                    visited_at: bookmark.visited_at,
                    updated_at: updated_bookmark.updated_at,
                    stars: updated_bookmark.stars,
                    tag_ids: updated_bookmark.tags.map((tag) => tag.id),
                  },
                })
                await search_hook.get_result({
                  search_string: search_hook.search_string,
                  refresh_highlights_only: true,
                })
              }
              dispatch(bookmarks_actions.set_is_upserting(false))
              modal_context.close()
              toast.success(props.dictionary.app.library.bookmark_updated)
            }}
          />
          <Ui_Dropdown_StandardItem
            icon_variant="ARCHIVE"
            label={
              is_archived_filter
                ? props.dictionary.app.library.bookmark.restore
                : props.dictionary.app.library.bookmark.archive
            }
            on_click={async () => {
              dispatch(bookmarks_actions.set_is_upserting(true))
              const modified_bookmark: UpsertBookmark_Params = {
                bookmark_id: bookmark.id,
                is_archived: !is_archived_filter,
              }
              await dispatch(
                bookmarks_actions.upsert_bookmark({
                  bookmark: modified_bookmark,
                  last_authorized_counts_params:
                    JSON.parse(
                      sessionStorage.getItem(
                        browser_storage.session_storage.library
                          .last_authorized_counts_params,
                      ) || 'null',
                    ) || undefined,
                  get_tag_hierarchies_request_params:
                    tag_hierarchies_hook.get_authorized_request_params({
                      filter: filter_view_options_hook.current_filter,
                      gte: date_view_options_hook.current_gte,
                      lte: date_view_options_hook.current_lte,
                    }),
                  ky: auth_context.ky_instance,
                  encryption_key: auth_context.auth_data!.encryption_key,
                }),
              )
              if (search_hook.count) {
                search_hook.set_count(search_hook.count - 1)
              }
              dispatch(bookmarks_actions.set_is_upserting(false))
              toast.success(
                is_archived_filter
                  ? props.dictionary.app.library.bookmark_restored
                  : props.dictionary.app.library.bookmark_archived,
              )
              if (
                bookmarks_hook.bookmarks &&
                bookmarks_hook.bookmarks.length == 1 &&
                bookmarks_hook.showing_bookmarks_fetched_by_ids
              ) {
                search_hook.reset()
              }
            }}
          />
          <Ui_Dropdown_StandardItem
            icon_variant="DELETE"
            is_danger={true}
            label={props.dictionary.app.library.bookmark.delete}
            on_click={async () => {
              const is_deletion_confirmed = await delete_bookmark_modal_setter({
                dictionary: props.dictionary,
                modal_context,
                title: bookmark.title,
              })
              if (!is_deletion_confirmed) {
                modal_context.close()
                return
              }
              dispatch(bookmarks_actions.set_is_upserting(true))
              await dispatch(
                bookmarks_actions.delete_bookmark({
                  last_authorized_counts_params:
                    JSON.parse(
                      sessionStorage.getItem(
                        browser_storage.session_storage.library
                          .last_authorized_counts_params,
                      ) || 'null',
                    ) || undefined,
                  get_tag_hierarchies_request_params:
                    tag_hierarchies_hook.get_authorized_request_params({
                      filter: filter_view_options_hook.current_filter,
                      gte: date_view_options_hook.current_gte,
                      lte: date_view_options_hook.current_lte,
                    }),
                  bookmark_id: bookmark.id,
                  ky: auth_context.ky_instance,
                  encryption_key: auth_context.auth_data!.encryption_key,
                }),
              )
              if (search_hook.count) {
                search_hook.set_count(search_hook.count - 1)
              }
              dispatch(bookmarks_actions.set_is_upserting(false))
              modal_context.close()
              toast.success(props.dictionary.app.library.bookmark_deleted)
            }}
          />
        </Ui_Dropdown>
      ) : auth_context.auth_data ? (
        <Ui_Dropdown>
          <Ui_Dropdown_StandardItem
            icon_variant="COPY"
            label={'Copy to mine'}
            on_click={async () => {}}
          />
        </Ui_Dropdown>
      ) : undefined
    }

    const handle_modify_tags_click = async () => {
      const updated_tags = await edit_tags_modal_setter({
        modal_context,
        dictionary: props.dictionary,
        is_visibility_toggleable: bookmark.is_public,
        tags: bookmark.tags,
      })
      if (!updated_tags) {
        modal_context.close()
        return
      }
      const modified_bookmark: UpsertBookmark_Params = {
        bookmark_id: bookmark.id,
        tags: updated_tags.map((tag) => ({
          name: tag.name,
          is_public: tag.is_public,
        })),
      }
      const updated_bookmark = await dispatch(
        bookmarks_actions.upsert_bookmark({
          bookmark: modified_bookmark,
          last_authorized_counts_params:
            JSON.parse(
              sessionStorage.getItem(
                browser_storage.session_storage.library
                  .last_authorized_counts_params,
              ) || 'null',
            ) || undefined,
          get_tag_hierarchies_request_params:
            tag_hierarchies_hook.get_authorized_request_params({
              filter: filter_view_options_hook.current_filter,
              gte: date_view_options_hook.current_gte,
              lte: date_view_options_hook.current_lte,
            }),
          ky: auth_context.ky_instance,
          encryption_key: auth_context.auth_data!.encryption_key,
        }),
      )
      const updated_tag_ids = updated_bookmark.tags.map((t) => t.id)
      // Filter out bookmark
      if (
        !tag_view_options_hook.selected_tags.every((t) =>
          updated_tag_ids.includes(t),
        ) ||
        (updated_bookmark.is_unsorted == false &&
          (filter_view_options_hook.current_filter == Filter.STARRED_UNSORTED ||
            filter_view_options_hook.current_filter == Filter.UNSORTED ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_UNSORTED ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED_UNSORTED))
      ) {
        dispatch(
          bookmarks_actions.filter_out_bookmark({
            bookmark_id: updated_bookmark.id,
          }),
        )
        if (search_hook.count) {
          search_hook.set_count(search_hook.count - 1)
        }
      }
      // Unselect removed tags when there is no more bookmarks with them
      const tags_to_remove_from_search_params =
        tag_view_options_hook.selected_tags.filter((t) => {
          const yields = Object.entries(counts_hook.tags!).find(
            (tag) => parseInt(tag[0]) == t,
          )![1].yields
          return !updated_tag_ids.includes(t) && yields == 1
        })
      if (tags_to_remove_from_search_params.length) {
        dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(true))
        tag_view_options_hook.remove_tags_from_search_params(
          tags_to_remove_from_search_params,
        )
      }
      dispatch(bookmarks_actions.set_is_upserting(false))
      modal_context.close()
      toast.success(props.dictionary.app.library.bookmark_updated)
    }

    const handle_reading_mode_click = async (url: string) => {
      const data_source = new Bookmarks_DataSourceImpl(auth_context.ky_instance)
      const repository = new Bookmarks_RepositoryImpl(data_source)
      let links_data: GetLinksData_Ro | undefined = undefined
      if (username) {
        links_data = await repository.get_links_data_public({
          bookmark_id: bookmark.id,
          bookmark_updated_at: new Date(bookmark.updated_at),
          username,
        })
      } else {
        links_data = await repository.get_links_data_authorized(
          {
            bookmark_id: bookmark.id,
            bookmark_updated_at: new Date(bookmark.updated_at),
          },
          auth_context.auth_data!.encryption_key,
        )
      }
      const link_data = links_data.find((link) => link.url == url)
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
          bookmark_id: bookmark.id,
          visited_at: new Date().toISOString(),
        })
      }
    }

    const handle_bookmark_click = () => {
      if (bookmarks_hook.density == 'compact') {
        if (bookmark.is_compact || bookmark.is_compact === undefined) {
          dispatch(
            bookmarks_actions.set_bookmark_is_compact({
              index: i,
              is_compact: false,
            }),
          )
        } else {
          dispatch(
            bookmarks_actions.set_bookmark_is_compact({
              index: i,
              is_compact: true,
            }),
          )
        }
      }
    }

    const handle_link_click = async (url: string) => {
      if (!username) {
        const record_visit_params: RecordVisit_Params = {
          bookmark_id: bookmark.id,
          visited_at: new Date().toISOString(),
        }
        localStorage.setItem(
          browser_storage.local_storage.authorized_library.record_visit_params,
          JSON.stringify(record_visit_params),
        )
      }
      window.onbeforeunload = null
      location.href = url
    }

    const handle_mouse_up = async () => {
      if (!tag_view_options_hook.dragged_tag) return
      if (bookmark.tags.length == system_values.bookmark.tags.limit) {
        toast.error(props.dictionary.app.library.errors.tag_limit_reached)
        return
      }
      if (
        bookmark.tags.findIndex(
          (tag) => tag.id == tag_view_options_hook.dragged_tag!.id,
        ) != -1
      ) {
        return
      }
      dispatch(bookmarks_actions.set_is_upserting(true))
      const modified_bookmark: UpsertBookmark_Params = {
        bookmark_id: bookmark.id,
        tags: [
          ...bookmark.tags.map((tag) => ({
            name: tag.name,
            is_public: tag.is_public,
          })),
          {
            name: tag_view_options_hook.dragged_tag.name,
            is_public: bookmark.is_public,
          },
        ],
      }
      const updated_bookmark = await dispatch(
        bookmarks_actions.upsert_bookmark({
          bookmark: modified_bookmark,
          last_authorized_counts_params:
            JSON.parse(
              sessionStorage.getItem(
                browser_storage.session_storage.library
                  .last_authorized_counts_params,
              ) || 'null',
            ) || undefined,
          get_tag_hierarchies_request_params:
            tag_hierarchies_hook.get_authorized_request_params({
              filter: filter_view_options_hook.current_filter,
              gte: date_view_options_hook.current_gte,
              lte: date_view_options_hook.current_lte,
            }),
          ky: auth_context.ky_instance,
          encryption_key: auth_context.auth_data!.encryption_key,
        }),
      )
      // Update highlights
      if (search_hook.result?.hits.length) {
        await props.local_db.upsert_bookmark({
          db: (is_archived_filter
            ? props.local_db.archived_db
            : props.local_db.db)!,
          bookmark: {
            id: bookmark.id,
            is_archived: is_archived_filter,
            is_unsorted: updated_bookmark.is_unsorted,
            title: updated_bookmark.title,
            note: updated_bookmark.note,
            tags: updated_bookmark.tags.map((tag) => ({
              name: tag.name,
              id: tag.id,
            })),
            links: updated_bookmark.links.map((link) => ({
              url: link.url,
              site_path: link.site_path,
            })),
            created_at: updated_bookmark.created_at,
            visited_at: bookmark.visited_at,
            updated_at: updated_bookmark.updated_at,
            stars: updated_bookmark.stars,
            tag_ids: updated_bookmark.tags.map((tag) => tag.id),
          },
        })
        await search_hook.get_result({
          search_string: search_hook.search_string,
          refresh_highlights_only: true,
        })
      }
      dispatch(bookmarks_actions.set_is_upserting(false))
      toast.success(props.dictionary.app.library.bookmark_updated)
    }

    const handle_tag_delete_click = async (tag_id: number) => {
      dispatch(bookmarks_actions.set_is_upserting(true))
      const modified_bookmark: UpsertBookmark_Params = {
        bookmark_id: bookmark.id,
        tags: bookmark.tags
          .filter((tag) => tag.id != tag_id)
          .map((tag) => ({
            name: tag.name,
            is_public: tag.is_public,
          })),
      }
      const updated_bookmark = await dispatch(
        bookmarks_actions.upsert_bookmark({
          bookmark: modified_bookmark,
          last_authorized_counts_params:
            JSON.parse(
              sessionStorage.getItem(
                browser_storage.session_storage.library
                  .last_authorized_counts_params,
              ) || 'null',
            ) || undefined,
          get_tag_hierarchies_request_params:
            tag_hierarchies_hook.get_authorized_request_params({
              filter: filter_view_options_hook.current_filter,
              gte: date_view_options_hook.current_gte,
              lte: date_view_options_hook.current_lte,
            }),
          ky: auth_context.ky_instance,
          encryption_key: auth_context.auth_data!.encryption_key,
        }),
      )
      // Update highlights
      if (search_hook.result?.hits.length) {
        await props.local_db.upsert_bookmark({
          db: (is_archived_filter
            ? props.local_db.archived_db
            : props.local_db.db)!,
          bookmark: {
            id: bookmark.id,
            is_archived: is_archived_filter,
            is_unsorted: updated_bookmark.is_unsorted,
            title: updated_bookmark.title,
            note: updated_bookmark.note,
            tags: updated_bookmark.tags.map((tag) => ({
              name: tag.name,
              id: tag.id,
            })),
            links: updated_bookmark.links.map((link) => ({
              url: link.url,
              site_path: link.site_path,
            })),
            created_at: updated_bookmark.created_at,
            visited_at: bookmark.visited_at,
            updated_at: updated_bookmark.updated_at,
            stars: updated_bookmark.stars,
            tag_ids: updated_bookmark.tags.map((tag) => tag.id),
          },
        })
        await search_hook.get_result({
          search_string: search_hook.search_string,
          refresh_highlights_only: true,
        })
      }
      const updated_tag_ids = updated_bookmark.tags.map((t) => t.id)
      if (
        !tag_view_options_hook.selected_tags.every((t) =>
          updated_tag_ids.includes(t),
        )
      ) {
        // We filter out bookmark when there are other bookmarks still matching with selected tags
        dispatch(
          bookmarks_actions.filter_out_bookmark({
            bookmark_id: updated_bookmark.id,
          }),
        )
        if (search_hook.count) {
          search_hook.set_count(search_hook.count - 1)
        }
      }
      if (
        tag_view_options_hook.selected_tags.includes(tag_id) &&
        counts_hook.tags![tag_id].yields == 1
      ) {
        dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(true))
        tag_view_options_hook.remove_tags_from_search_params([tag_id])
      }
      dispatch(bookmarks_actions.set_is_upserting(false))
      toast.success(props.dictionary.app.library.bookmark_updated)
    }

    return (
      <_Bookmark
        key={`${bookmark.id}${i}${library_updated_at_timestamp}${rerender_trigger}`}
        created_at={new Date(bookmark.created_at)}
        locale={props.dictionary.locale}
        search_queried_at_timestamp={search_hook.queried_at_timestamp}
        bookmark_id={bookmark.id}
        library_url={username ? `/${username}` : '/library'}
        on_tag_drag_start={
          !username ? tag_view_options_hook.set_dragged_tag : undefined
        }
        on_modify_tags_click={!username ? handle_modify_tags_click : undefined}
        density={bookmarks_hook.density}
        is_search_result={bookmarks_hook.showing_bookmarks_fetched_by_ids}
        is_compact={bookmark.is_compact}
        updated_at={bookmark.updated_at}
        is_public={bookmark.is_public}
        points_given={points_hook.points_given[bookmark.id]}
        points={bookmark.points}
        has_cover={!!(bookmark.has_cover_aes || bookmark.cover_hash)}
        has_cover_aes={bookmark.has_cover_aes}
        cover_hash={bookmark.cover_hash}
        blurhash={bookmark.blurhash}
        on_get_points_given_click={
          auth_context.auth_data
            ? () => {
                points_hook.get_points_given_on_bookmark({
                  bookmark_id: bookmark.id,
                })
              }
            : undefined
        }
        on_give_point_click={
          auth_context.auth_data
            ? (points: number) => {
                points_hook.give_points({ bookmark_id: bookmark.id, points })
              }
            : undefined
        }
        title={bookmark.title}
        note={bookmark.note}
        on_click={handle_bookmark_click}
        date={
          sort_by_view_options_hook.current_sort_by == SortBy.CREATED_AT
            ? new Date(bookmark.created_at)
            : sort_by_view_options_hook.current_sort_by == SortBy.UPDATED_AT
            ? new Date(bookmark.updated_at)
            : sort_by_view_options_hook.current_sort_by == SortBy.VISITED_AT
            ? new Date(bookmark.visited_at)
            : new Date(bookmark.created_at)
        }
        search_params={search_params.toString()}
        tags={
          bookmark.tags
            ? bookmark.tags.map((tag) => {
                const is_selected = is_fetching_first_bookmarks
                  ? counts_hook.selected_tags.find((t) => t == tag.id) !=
                    undefined
                  : tag_view_options_hook.selected_tags.find(
                      (t) => t == tag.id,
                    ) !== undefined

                return {
                  name: tag.name,
                  is_selected: is_selected,
                  id: tag.id,
                  yields:
                    !is_selected && counts_hook.tags && counts_hook.tags[tag.id]
                      ? counts_hook.tags[tag.id].yields
                      : undefined,
                  is_public: tag.is_public,
                }
              })
            : []
        }
        is_unsorted={
          !username && bookmark.is_unsorted === undefined
            ? true
            : bookmark.is_unsorted
        }
        stars={bookmark.stars}
        on_tag_click={tag_view_options_hook.add_tag_to_search_params}
        on_selected_tag_click={(tag_id) =>
          tag_view_options_hook.remove_tags_from_search_params([tag_id])
        }
        render_height={bookmark.render_height}
        set_render_height={(height) => {
          dispatch(
            bookmarks_actions.set_bookmark_render_height({
              index: i,
              height,
            }),
          )
        }}
        on_link_click={handle_link_click}
        on_reading_mode_click={handle_reading_mode_click}
        on_video_player_click={(url) => {
          video_embed_setter({
            url,
            dictionary: props.dictionary,
            modal_context,
          })
          if (!username) {
            const data_source = new Bookmarks_DataSourceImpl(
              auth_context.ky_instance,
            )
            const repository = new Bookmarks_RepositoryImpl(data_source)
            repository.record_visit({
              bookmark_id: bookmark.id,
              visited_at: new Date().toISOString(),
            })
          }
        }}
        on_link_middle_click={() => {
          if (!username) {
            const data_source = new Bookmarks_DataSourceImpl(
              auth_context.ky_instance,
            )
            const repository = new Bookmarks_RepositoryImpl(data_source)
            repository.record_visit({
              bookmark_id: bookmark.id,
              visited_at: new Date().toISOString(),
            })
          }
        }}
        on_new_tab_click={(url) => {
          if (!username) {
            const data_source = new Bookmarks_DataSourceImpl(
              auth_context.ky_instance,
            )
            const repository = new Bookmarks_RepositoryImpl(data_source)
            repository.record_visit({
              bookmark_id: bookmark.id,
              visited_at: new Date().toISOString(),
            })
          }
          window.open(url, '_blank')
        }}
        on_saves_click={({ url, saves }) => {
          saves_modal_setter({
            modal_context,
            url,
            saves,
            dictionary: props.dictionary,
          })
        }}
        favicon_host={`${process.env.NEXT_PUBLIC_API_URL}/v1/favicons`}
        // We pass dragged tag so on_mouse_up has access to current state (memoized component is refreshed)
        dragged_tag={tag_view_options_hook.dragged_tag}
        on_mouse_up={handle_mouse_up}
        on_tags_order_change={
          !username
            ? async (tags) => {
                dispatch(bookmarks_actions.set_is_upserting(true))
                const modified_bookmark: UpsertBookmark_Params = {
                  bookmark_id: bookmark.id,
                  tags: tags.map((tag) => ({
                    name: tag.name,
                    is_public: tag.is_public || false,
                  })),
                }
                const updated_bookmark = await dispatch(
                  bookmarks_actions.upsert_bookmark({
                    bookmark: modified_bookmark,
                    last_authorized_counts_params:
                      JSON.parse(
                        sessionStorage.getItem(
                          browser_storage.session_storage.library
                            .last_authorized_counts_params,
                        ) || 'null',
                      ) || undefined,
                    ky: auth_context.ky_instance,
                    encryption_key: auth_context.auth_data!.encryption_key,
                  }),
                )
                // Update highlights
                if (search_hook.result?.hits.length) {
                  await props.local_db.upsert_bookmark({
                    db: (is_archived_filter
                      ? props.local_db.archived_db
                      : props.local_db.db)!,
                    bookmark: {
                      id: bookmark.id,
                      is_archived: is_archived_filter,
                      is_unsorted: updated_bookmark.is_unsorted,
                      title: updated_bookmark.title,
                      note: updated_bookmark.note,
                      tags: updated_bookmark.tags.map((tag) => ({
                        name: tag.name,
                        id: tag.id,
                      })),
                      links: updated_bookmark.links.map((link) => ({
                        url: link.url,
                        site_path: link.site_path,
                      })),
                      created_at: updated_bookmark.created_at,
                      visited_at: bookmark.visited_at,
                      updated_at: updated_bookmark.updated_at,
                      stars: updated_bookmark.stars,
                      tag_ids: updated_bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  await search_hook.get_result({
                    search_string: search_hook.search_string,
                    refresh_highlights_only: true,
                  })
                }
                dispatch(bookmarks_actions.set_is_upserting(false))
                toast.success(props.dictionary.app.library.bookmark_updated)
              }
            : undefined
        }
        on_tag_rename_click={(id: number) => {
          const name = counts_hook.tags![id].name
          on_tag_rename_click({ name, id })
        }}
        on_tag_delete_click={handle_tag_delete_click}
        links={bookmark.links.map((link) => ({
          url: link.url,
          saves: link.saves,
          site_path: link.site_path,
          is_pinned: link.is_pinned,
          is_public: link.is_public,
          favicon: link.favicon,
          open_snapshot: link.open_snapshot,
          is_parsed: link.is_parsed,
          menu_slot: !username ? (
            <Ui_Dropdown>
              {link.open_snapshot ? (
                <Ui_Dropdown_StandardItem
                  icon_variant="LINK"
                  label={
                    props.dictionary.app.library.bookmark.open_original_url
                  }
                  on_click={() => {
                    const record_visit_params: RecordVisit_Params = {
                      bookmark_id: bookmark.id,
                      visited_at: new Date().toISOString(),
                    }
                    localStorage.setItem(
                      browser_storage.local_storage.authorized_library
                        .record_visit_params,
                      JSON.stringify(record_visit_params),
                    )
                    window.onbeforeunload = null
                    location.href = link.url
                  }}
                />
              ) : (
                <Ui_Dropdown_StandardItem
                  icon_variant="LINK"
                  label={props.dictionary.app.library.bookmark.open_snapshot}
                  on_click={() => {
                    const record_visit_params: RecordVisit_Params = {
                      bookmark_id: bookmark.id,
                      visited_at: new Date().toISOString(),
                    }
                    localStorage.setItem(
                      browser_storage.local_storage.authorized_library
                        .record_visit_params,
                      JSON.stringify(record_visit_params),
                    )
                    window.onbeforeunload = null
                    location.href = url_to_wayback({
                      date: new Date(bookmark.created_at),
                      url: link.url,
                    })
                  }}
                />
              )}
              <Ui_Dropdown_Separator />
              <Ui_Dropdown_CheckboxItem
                is_checked={link.is_pinned || false}
                label={props.dictionary.app.library.bookmark.pinned_to_sidebar}
                on_click={async () => {
                  const is_pinned = !link.is_pinned
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const modified_bookmark: UpsertBookmark_Params = {
                    bookmark_id: bookmark.id,
                    links: bookmark.links.map((l) => ({
                      url: l.url,
                      site_path: l.site_path,
                      is_public: l.is_public,
                      is_pinned: link.url == l.url ? is_pinned : l.is_pinned,
                      pin_title: l.pin_title,
                      open_snapshot: l.open_snapshot,
                      favicon: link.favicon,
                    })),
                  }
                  await dispatch(
                    bookmarks_actions.upsert_bookmark({
                      bookmark: modified_bookmark,
                      last_authorized_counts_params:
                        JSON.parse(
                          sessionStorage.getItem(
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: auth_context.ky_instance,
                      encryption_key: auth_context.auth_data!.encryption_key,
                    }),
                  )
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(
                    is_pinned
                      ? props.dictionary.app.library.link_is_now_pinned
                      : props.dictionary.app.library.pin_has_been_removed,
                  )
                }}
              />
              <Ui_Dropdown_CheckboxItem
                is_checked={link.open_snapshot || false}
                label={props.dictionary.app.library.bookmark.use_snapshot}
                on_click={async () => {
                  const open_snapshot = !link.open_snapshot
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const modified_bookmark: UpsertBookmark_Params = {
                    bookmark_id: bookmark.id,
                    links: bookmark.links.map((l) => ({
                      url: l.url,
                      site_path: l.site_path,
                      is_public: l.is_public,
                      is_pinned: l.is_pinned,
                      pin_title: l.pin_title,
                      open_snapshot:
                        link.url == l.url ? open_snapshot : l.open_snapshot,
                      favicon: link.favicon,
                    })),
                  }
                  await dispatch(
                    bookmarks_actions.upsert_bookmark({
                      bookmark: modified_bookmark,
                      last_authorized_counts_params:
                        JSON.parse(
                          sessionStorage.getItem(
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: auth_context.ky_instance,
                      encryption_key: auth_context.auth_data!.encryption_key,
                    }),
                  )
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(
                    open_snapshot
                      ? props.dictionary.app.library.use_snapshot
                      : props.dictionary.app.library.use_original,
                  )
                }}
              />
            </Ui_Dropdown>
          ) : (
            <Ui_Dropdown>
              {link.open_snapshot ? (
                <Ui_Dropdown_StandardItem
                  icon_variant="LINK"
                  label={'Open original URL'}
                  on_click={() => {
                    window.onbeforeunload = null
                    location.href = link.url
                  }}
                />
              ) : (
                <Ui_Dropdown_StandardItem
                  icon_variant="LINK"
                  label={'Open snapshot'}
                  on_click={() => {
                    window.onbeforeunload = null
                    location.href = url_to_wayback({
                      date: new Date(bookmark.created_at),
                      url: link.url,
                    })
                  }}
                />
              )}
            </Ui_Dropdown>
          ),
        }))}
        menu_slot={render_menu()}
        highlights={search_hook.highlights?.[bookmark.id.toString()]}
        highlights_site_variants={search_hook.highlights_sites_variants}
        orama_db_id={
          is_archived_filter
            ? props.local_db.archived_db?.id || ''
            : props.local_db.db?.id || ''
        }
        should_dim_visited_links={username !== undefined}
        // It's important to wait until filter is set to search hook's state
        current_filter={search_hook.current_filter}
        translations={{
          delete: props.dictionary.app.library.delete,
          rename: props.dictionary.app.library.rename,
        }}
      />
    )
  })
}
