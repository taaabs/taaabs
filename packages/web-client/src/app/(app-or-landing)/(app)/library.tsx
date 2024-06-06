import { use_library_dispatch } from '@/stores/library'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { useContext, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_filter_view_options } from '@/hooks/library/use-filter-view-options'
import { use_tag_view_options } from '@/hooks/library/use-tag-view-options'
import { use_date_view_options } from '@/hooks/library/use-date-view-options'
import { use_sort_by_view_options } from '@/hooks/library/use-sort-by-view-options'
import { use_order_view_options } from '@/hooks/library/use-order-view-options'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { use_bookmarks } from '@/hooks/library/use-bookmarks'
import { use_counts } from '@/hooks/library/use-counts'
import { use_session_storage_cleanup } from '@/hooks/library/use-session-storage-cleanup'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { browser_storage } from '@/constants/browser-storage'
import { useParams, useSearchParams } from 'next/navigation'
import { upsert_bookmark_modal_setter } from '@/modals/upsert-bookmark-modal-setter'
import { toast } from 'react-toastify'
import { CustomRangeSkeleton as UiAppAtom_CustomRangeSkeleton } from '@web-ui/components/app/atoms/custom-range-skeleton'
import { SwipableColumns as UiAppTemplate_SwipableColumns } from '@web-ui/components/app/templates/swipable-columns'
import { LibrarySearch as UiAppAtom_LibrarySearch } from '@web-ui/components/app/atoms/library-search'
import { LibraryAside as UiAppTemplate_LibraryAside } from '@web-ui/components/app/templates/library-aside'
import { SelectedTags as UiAppAtom_SelectedTags } from '@web-ui/components/app/atoms/selected-tags'
import { Tags as UiAppAtom_Tags } from '@web-ui/components/app/atoms/tags'
import { TagsSkeleton as UiAppAtom_TagsSkeleton } from '@web-ui/components/app/atoms/tags-skeleton'
import { SegmentedButtonsSkeleton as UiAppAtom_SegmentedButtonsSkeleton } from '@web-ui/components/app/atoms/segmented-buttons-skeleton'
import { Toolbar as UiAppAtom_Toolbar } from '@web-ui/components/app/atoms/toolbar'
import {
  TagHierarchies,
  TagHierarchies as UiAppAtom_TagHierarchies,
} from '@web-ui/components/app/atoms/tag-hierarchies'
import { DraggedCursorTag as UiAppAtom_DraggedCursorTag } from '@web-ui/components/app/atoms/dragged-cursor-tag'
import { use_tag_hierarchies } from '@/hooks/library/use-tag-hierarchies'
import { tag_hierarchies_actions } from '@repositories/stores/library/tag-hierarchies/tag-hierarchies.slice'
import { system_values } from '@shared/constants/system-values'
import { Filter } from '@/types/library/filter'
import { UpdateTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/update-tag-hierarchies.params'
import { use_points } from '@/hooks/library/use-points'
import { use_scroll_restore } from '@/hooks/misc/use-scroll-restore'
import { use_pinned } from '@/hooks/library/use-pinned'
import { pinned_actions } from '@repositories/stores/library/pinned/pinned.slice'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { RecordVisit_Params } from '@repositories/modules/bookmarks/domain/types/record-visit.params'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'
import { search_params_keys } from '@/constants/search-params-keys'
import { counts_actions } from '@repositories/stores/library/counts/counts.slice'
import { use_popstate_count } from '@/hooks/misc/pop-state-count'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { BookmarkWrapper as UiAppAtom_BookmarkWrapper } from '@web-ui/components/app/atoms/bookmark-wrapper'
import { SegmentedButton as UiAppAtom_SegmentedButton } from '@web-ui/components/app/atoms/segmented-button'
import { use_is_hydrated } from '@shared/hooks'
import { ModalContext } from '@/providers/modal-provider'
import { AuthContext } from '@/app/auth-provider'
import { use_search } from '@/hooks/library/use-search'
import { LocalDb } from '@/app/local-db-provider'
import { Dictionary } from '@/dictionaries/dictionary'
import { Dropdown as UiCommon_Dropdown } from '@web-ui/components/common/dropdown'
import { StandardItem as UiCommon_Dropdown_StandardItem } from '@web-ui/components/common/dropdown/standard-item'
import { CheckboxItem as UiCommon_Dropdown_CheckboxItem } from '@web-ui/components/common/dropdown/checkbox-item'
import { Separator as UiCommon_Dropdown_Separator } from '@web-ui/components/common/dropdown/separator'
import { Stars as UiCommon_Dropdown_Stars } from '@web-ui/components/common/dropdown/stars'
import { delete_bookmark_modal_setter } from '@/modals/delete-bookmark-modal-setter'
import { rename_tag_modal_setter } from '@/modals/rename-tag-modal-setter'
import { reader_modal_setter } from '@/modals/reader-modal/reader-modal-setter'
import { GetLinksData_Ro } from '@repositories/modules/bookmarks/domain/types/get-links-data.ro'
import { PinnedBookmarks as UiAppLibrary_PinnedBookmarks } from '@web-ui/components/app/library/PinnedBookmarks'

const CustomRange = dynamic(() => import('./dynamic-custom-range'), {
  ssr: false,
  loading: () => <UiAppAtom_CustomRangeSkeleton />,
})

const Library: React.FC<{ dictionary: Dictionary; local_db: LocalDb }> = (
  props,
) => {
  const auth_context = useContext(AuthContext)!
  use_scroll_restore()
  const is_hydrated = use_is_hydrated()
  const popstate_count = use_popstate_count()
  use_session_storage_cleanup()
  const dispatch = use_library_dispatch()
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()
  const modal_context = useContext(ModalContext)!
  const [show_skeletons, set_show_skeletons] = useState(true)
  const search_hook = use_search(props.local_db)
  const bookmarks_hook = use_bookmarks()
  const counts_hook = use_counts()
  const points_hook = use_points()
  const tag_hierarchies_hook = use_tag_hierarchies()
  const pinned_hook = use_pinned()
  const filter_view_options_hook = use_filter_view_options()
  const sort_by_view_options_hook = use_sort_by_view_options()
  const order_view_options_hook = use_order_view_options()
  const tag_view_options_hook = use_tag_view_options()
  const date_view_options_hook = use_date_view_options()
  // START - UI synchronization.
  const [library_updated_at_timestamp, set_library_updated_at_timestamp] =
    useState<number>()
  const [is_pinned_stale, set_is_pinned_stale] = useState<boolean>()
  const [pinned_updated_at, set_pinned_updated_at] = useState<number>()
  const [is_fetching_first_bookmarks, set_is_fetching_first_bookmarks] =
    useState<boolean>()
  // END - UI synchronization.

  const favicon_host = `${process.env.NEXT_PUBLIC_API_URL}/v1/favicons`

  useUpdateEffect(() => {
    if (
      !bookmarks_hook.is_fetching_first_bookmarks &&
      !bookmarks_hook.is_upserting &&
      !counts_hook.is_fetching &&
      !counts_hook.should_refetch &&
      !tag_hierarchies_hook.is_fetching &&
      !tag_hierarchies_hook.is_updating &&
      !pinned_hook.is_fetching &&
      !pinned_hook.should_refetch
    ) {
      dispatch(
        bookmarks_actions.set_bookmarks(bookmarks_hook.incoming_bookmarks),
      )
      if (is_fetching_first_bookmarks) {
        window.scrollTo(0, 0)
      }
      set_is_fetching_first_bookmarks(false)
      set_show_skeletons(false)
      set_library_updated_at_timestamp(Date.now())
      if (is_pinned_stale) {
        set_pinned_updated_at(pinned_hook.fetched_at_timestamp)
        set_is_pinned_stale(false)
      }
      if (search_hook.result) {
        search_hook.set_highlights(search_hook.incoming_highlights)
        search_hook.set_highlights_sites_variants(
          search_hook.incoming_highlights_sites_variants,
        )
      } else if (search_hook.highlights && !search_hook.result) {
        search_hook.set_highlights(undefined)
        search_hook.set_highlights_sites_variants(undefined)
      }
    }
  }, [
    bookmarks_hook.is_fetching_first_bookmarks,
    bookmarks_hook.is_upserting,
    counts_hook.is_fetching,
    counts_hook.should_refetch,
    tag_hierarchies_hook.is_fetching,
    tag_hierarchies_hook.is_updating,
    pinned_hook.is_fetching,
    pinned_hook.should_refetch,
  ])

  const on_tag_rename_click = async (params: {
    old_tag_id: number
    old_tag_name: string
  }) => {
    const new_tag_name = await rename_tag_modal_setter({
      dictionary: props.dictionary,
      modal_context,
      old_tag_name: params.old_tag_name,
    })
    if (new_tag_name) {
      const bookmarks = bookmarks_hook.bookmarks?.map((b) => ({
        ...b,
        tags: b.tags.map((t) => ({
          ...t,
          name: t.name == params.old_tag_name ? new_tag_name : t.name,
        })),
      }))
      dispatch(bookmarks_actions.set_incoming_bookmarks(bookmarks))
      dispatch(bookmarks_actions.set_bookmarks(bookmarks))
      dispatch(
        counts_actions.set_tags({
          ...counts_hook.tags!,
          [params.old_tag_id]: {
            ...counts_hook.tags![params.old_tag_id],
            name: new_tag_name,
          },
        }),
      )
      tag_hierarchies_hook.rename_({
        old_tag_name: params.old_tag_name,
        new_tag_name,
      })
      set_library_updated_at_timestamp(Date.now())
    }
    modal_context.set_modal_content({})
  }

  // UpdateEffect breaks rendering items fetched from session storage.
  useEffect(() => {
    if (!pinned_hook.is_fetching) {
      set_is_pinned_stale(true)
    }
  }, [pinned_hook.is_fetching])

  useUpdateEffect(() => {
    if (
      !bookmarks_hook.is_fetching_first_bookmarks &&
      !counts_hook.is_fetching
    ) {
      dispatch(counts_actions.process_tags())
    }
  }, [bookmarks_hook.is_fetching_first_bookmarks, counts_hook.is_fetching])

  useUpdateEffect(() => {
    if (bookmarks_hook.is_fetching_first_bookmarks) {
      set_is_fetching_first_bookmarks(true)
    }
  }, [bookmarks_hook.is_fetching_first_bookmarks])

  // Close "Create bookmark" modal, refresh counts and tag hierarchies.
  useUpdateEffect(() => {
    if (bookmarks_hook.is_fetching_first_bookmarks) return
    const new_bookmark_results_refetch_trigger = search_params.get(
      search_params_keys.new_bookmark_results_refetch_trigger,
    )
    const counts_reload_requested_by_new_bookmark = sessionStorage.getItem(
      browser_storage.session_storage.library
        .counts_reload_requested_by_new_bookmark,
    )
    if (
      new_bookmark_results_refetch_trigger &&
      counts_reload_requested_by_new_bookmark
    ) {
      sessionStorage.removeItem(
        browser_storage.session_storage.library
          .counts_reload_requested_by_new_bookmark,
      )
      Promise.all([
        tag_hierarchies_hook.get_tag_hierarchies_({
          filter: filter_view_options_hook.current_filter_,
          gte: date_view_options_hook.current_gte_,
          lte: date_view_options_hook.current_lte_,
        }),
        dispatch(
          counts_actions.refresh_authorized_counts({
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
        ),
      ]).then(() => {
        modal_context.set_modal_content({})
      })
    }
  }, [bookmarks_hook.is_fetching_first_bookmarks])

  useUpdateEffect(() => {
    if (counts_hook.should_refetch) {
      counts_hook.get_counts_()
    }
  }, [counts_hook.should_refetch])

  useUpdateEffect(() => {
    if (pinned_hook.should_refetch) {
      pinned_hook.get_pinned_()
    }
  }, [pinned_hook.should_refetch])

  useUpdateEffect(() => {
    search_hook.set_current_filter(filter_view_options_hook.current_filter_)
  }, [filter_view_options_hook.current_filter_])

  // Clear cache when user selects visited at sort_by option or popularity order.
  // Filter is in deps because we want to clear cache when setting to archive.
  // NOTE: Could be reworked to avoid unnecesary invalidations.
  const search_cache_to_be_cleared = useRef(false)
  useUpdateEffect(() => {
    if (
      sort_by_view_options_hook.current_sort_by_ == SortBy.VISITED_AT ||
      sort_by_view_options_hook.current_sort_by_ == SortBy.POPULARITY
    ) {
      search_cache_to_be_cleared.current = true
    } else {
      search_cache_to_be_cleared.current = false
    }
  }, [
    filter_view_options_hook.current_filter_,
    sort_by_view_options_hook.current_sort_by_,
    order_view_options_hook.current_order_,
  ])

  useUpdateEffect(() => {
    if (props.local_db.db || props.local_db.archived_db) {
      search_hook.set_current_filter(filter_view_options_hook.current_filter_)
      search_hook.set_selected_tag_ids(tag_view_options_hook.selected_tags_)
      search_hook.set_selected_tags(
        counts_hook.selected_tags_
          .filter((id) => {
            if (!bookmarks_hook.bookmarks || !bookmarks_hook.bookmarks[0])
              return false
            return (
              bookmarks_hook.bookmarks[0].tags?.findIndex(
                (tag) => tag.id == id,
              ) != -1
            )
          })
          .map((id) => {
            const name = bookmarks_hook.bookmarks![0].tags!.find(
              (tag) => tag.id == id,
            )!.name

            return name
          }),
      )
      search_hook.get_hints()
    }
  }, [props.local_db.db, props.local_db.archived_db])

  useUpdateEffect(() => {
    if (search_hook.result) {
      bookmarks_hook.get_bookmarks_by_ids_({
        all_not_paginated_ids: search_hook.result.hits.map((hit) =>
          parseInt(hit.document.id),
        ),
      })
    }
  }, [search_hook.queried_at_timestamp])

  useUpdateEffect(() => {
    tag_hierarchies_hook.get_tag_hierarchies_({
      filter: filter_view_options_hook.current_filter_,
      gte: date_view_options_hook.current_gte_,
      lte: date_view_options_hook.current_lte_,
    })
  }, [
    is_hydrated,
    date_view_options_hook.current_gte_,
    date_view_options_hook.current_lte_,
    filter_view_options_hook.current_filter_,
  ])

  const is_archived_filter =
    filter_view_options_hook.current_filter_ == Filter.ARCHIVED ||
    filter_view_options_hook.current_filter_ == Filter.ARCHIVED_STARRED ||
    filter_view_options_hook.current_filter_ ==
      Filter.ARCHIVED_STARRED_UNSORTED ||
    filter_view_options_hook.current_filter_ == Filter.ARCHIVED_UNSORTED

  const is_not_interactive =
    is_fetching_first_bookmarks ||
    bookmarks_hook.is_fetching_more_bookmarks ||
    props.local_db.is_initializing

  const slot_search = (
    <UiAppAtom_LibrarySearch
      search_string_={search_hook.search_string}
      is_full_text_={search_hook.is_full_text}
      toggle_full_text_={() =>
        search_hook.set_is_full_text(!search_hook.is_full_text)
      }
      is_loading_={props.local_db.is_initializing || false}
      loading_progress_percentage_={props.local_db.indexed_bookmarks_percentage}
      hints_={
        !props.local_db.is_initializing
          ? search_hook.hints?.map((hint) => ({
              type_: hint.type,
              completion_: hint.completion,
              search_string_: hint.search_string,
            }))
          : undefined
      }
      hints_set_at_timestamp_={search_hook.hints_set_at_timestamp}
      queried_at_timestamp_={search_hook.queried_at_timestamp}
      on_click_hint_={(i) => {
        const search_string =
          search_hook.search_string + search_hook.hints![i].completion
        search_hook.set_search_string(search_string)
        search_hook.get_result({ search_string: search_string })
      }}
      on_click_recent_hint_remove_={(i) => {
        const search_string =
          search_hook.hints![i].search_string + search_hook.hints![i].completion
        search_hook.remove_recent_hint({ search_string_: search_string })
      }}
      is_focused_={search_hook.is_search_focused}
      on_focus_={async () => {
        if (props.local_db.is_initializing) return

        search_hook.set_is_search_focused(true)
        search_hook.set_selected_tag_ids(tag_view_options_hook.selected_tags_)
        search_hook.set_selected_tags(
          counts_hook.selected_tags_
            .filter((id) => {
              if (!bookmarks_hook.bookmarks || !bookmarks_hook.bookmarks[0])
                return false
              return (
                bookmarks_hook.bookmarks[0].tags?.findIndex(
                  (tag) => tag.id == id,
                ) != -1
              )
            })
            .map((id) => {
              const name = bookmarks_hook.bookmarks![0].tags!.find(
                (tag) => tag.id == id,
              )!.name

              return name
            }),
        )

        if (search_cache_to_be_cleared.current) {
          await props.local_db.init({
            is_archived: is_archived_filter,
            force_reinitialization: true,
          })
          search_cache_to_be_cleared.current = false
        } else {
          await props.local_db.init({
            is_archived: is_archived_filter,
          })
        }
        search_hook.get_hints()
      }}
      on_change_={(value) => {
        if (props.local_db.is_initializing) return
        search_hook.set_search_string(value)
      }}
      on_submit_={async () => {
        // if (props.local_db.is_initializing || !search_hook.search_string.trim() || search_hook.count == 0) return
        if (search_hook.is_full_text) {
          await search_hook.get_result_full_text({
            search_string_: search_hook.search_string,
          })
        } else {
          await search_hook.get_result({
            search_string: search_hook.search_string,
          })
        }
      }}
      on_blur_={() => {
        search_hook.clear_hints()
        search_hook.set_is_search_focused(false)
      }}
      results_count_={search_hook.search_string ? search_hook.count : undefined}
      on_clear_click_={() => {
        search_hook.reset()
        clear_library_session_storage({
          username,
          search_params: search_params.toString(),
        })
        window.history.pushState(
          {},
          '',
          window.location.pathname + `?${search_params.toString()}`,
        )
      }}
      is_slash_shortcut_disabled_={modal_context.modal_content !== undefined}
      on_click_get_help_={() => {}}
      translations_={{
        placeholder_: {
          default_: props.dictionary.app.library.search.placeholder.default,
          full_text_: props.dictionary.app.library.search.placeholder.full_text,
        },
        footer_tip_: props.dictionary.app.library.search.footer_tip,
        get_help_link_: props.dictionary.app.library.search.get_help,
        type_: props.dictionary.app.library.search.type,
        to_search_: props.dictionary.app.library.search.to_search,
        one_moment_please_:
          props.dictionary.app.library.search.one_moment_please,
      }}
    />
  )
  const slot_toolbar = (
    <UiAppAtom_Toolbar
      toggleable_buttons_={[
        {
          label_: props.dictionary.app.library.toolbar.starred,
          is_toggled_:
            filter_view_options_hook.current_filter_ == Filter.STARRED ||
            filter_view_options_hook.current_filter_ ==
              Filter.STARRED_UNSORTED ||
            filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_STARRED ||
            filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_STARRED_UNSORTED,
          on_click_: () => {
            if (
              is_fetching_first_bookmarks ||
              bookmarks_hook.is_fetching_more_bookmarks ||
              counts_hook.is_fetching
            )
              return

            let filter = Filter.NONE
            if (filter_view_options_hook.current_filter_ == Filter.NONE) {
              filter = Filter.STARRED
            } else if (
              filter_view_options_hook.current_filter_ == Filter.STARRED
            ) {
              filter = Filter.NONE
            } else if (
              filter_view_options_hook.current_filter_ ==
              Filter.STARRED_UNSORTED
            ) {
              filter = Filter.UNSORTED
            } else if (
              filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_STARRED
            ) {
              filter = Filter.ARCHIVED
            } else if (
              filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_STARRED_UNSORTED
            ) {
              filter = Filter.ARCHIVED_UNSORTED
            } else if (
              filter_view_options_hook.current_filter_ == Filter.UNSORTED
            ) {
              filter = Filter.STARRED_UNSORTED
            } else if (
              filter_view_options_hook.current_filter_ == Filter.ARCHIVED
            ) {
              filter = Filter.ARCHIVED_STARRED
            } else if (
              filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_UNSORTED
            ) {
              filter = Filter.ARCHIVED_STARRED_UNSORTED
            }
            filter_view_options_hook.set_filter_query_param_(filter)
          },
        },
        ...(!username
          ? [
              {
                label_: props.dictionary.app.library.toolbar.unsorted,
                is_toggled_:
                  filter_view_options_hook.current_filter_ == Filter.UNSORTED ||
                  filter_view_options_hook.current_filter_ ==
                    Filter.STARRED_UNSORTED ||
                  filter_view_options_hook.current_filter_ ==
                    Filter.ARCHIVED_UNSORTED ||
                  filter_view_options_hook.current_filter_ ==
                    Filter.ARCHIVED_STARRED_UNSORTED,
                on_click_: () => {
                  if (
                    is_fetching_first_bookmarks ||
                    bookmarks_hook.is_fetching_more_bookmarks ||
                    counts_hook.is_fetching
                  )
                    return

                  let filter = Filter.NONE
                  if (filter_view_options_hook.current_filter_ == Filter.NONE) {
                    filter = Filter.UNSORTED
                  } else if (
                    filter_view_options_hook.current_filter_ == Filter.UNSORTED
                  ) {
                    filter = Filter.NONE
                  } else if (
                    filter_view_options_hook.current_filter_ ==
                    Filter.STARRED_UNSORTED
                  ) {
                    filter = Filter.STARRED
                  } else if (
                    filter_view_options_hook.current_filter_ ==
                    Filter.ARCHIVED_UNSORTED
                  ) {
                    filter = Filter.ARCHIVED
                  } else if (
                    filter_view_options_hook.current_filter_ ==
                    Filter.ARCHIVED_STARRED_UNSORTED
                  ) {
                    filter = Filter.ARCHIVED_STARRED
                  } else if (
                    filter_view_options_hook.current_filter_ == Filter.STARRED
                  ) {
                    filter = Filter.STARRED_UNSORTED
                  } else if (
                    filter_view_options_hook.current_filter_ == Filter.ARCHIVED
                  ) {
                    filter = Filter.ARCHIVED_UNSORTED
                  } else if (
                    filter_view_options_hook.current_filter_ ==
                    Filter.ARCHIVED_STARRED
                  ) {
                    filter = Filter.ARCHIVED_STARRED_UNSORTED
                  }
                  filter_view_options_hook.set_filter_query_param_(filter)
                },
              },
            ]
          : []),
        {
          label_: props.dictionary.app.library.toolbar.archived,
          is_toggled_:
            filter_view_options_hook.current_filter_ == Filter.ARCHIVED ||
            filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_STARRED ||
            filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_UNSORTED ||
            filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_STARRED_UNSORTED,
          on_click_: () => {
            if (
              is_fetching_first_bookmarks ||
              bookmarks_hook.is_fetching_more_bookmarks ||
              counts_hook.is_fetching
            )
              return

            let filter = Filter.NONE

            if (filter_view_options_hook.current_filter_ == Filter.NONE) {
              filter = Filter.ARCHIVED
            } else if (
              filter_view_options_hook.current_filter_ == Filter.STARRED
            ) {
              filter = Filter.ARCHIVED_STARRED
            } else if (
              filter_view_options_hook.current_filter_ == Filter.UNSORTED
            ) {
              filter = Filter.ARCHIVED_UNSORTED
            } else if (
              filter_view_options_hook.current_filter_ ==
              Filter.STARRED_UNSORTED
            ) {
              filter = Filter.ARCHIVED_STARRED_UNSORTED
            } else if (
              filter_view_options_hook.current_filter_ == Filter.ARCHIVED
            ) {
              filter = Filter.NONE
            } else if (
              filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_STARRED
            ) {
              filter = Filter.STARRED
            } else if (
              filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_UNSORTED
            ) {
              filter = Filter.UNSORTED
            } else if (
              filter_view_options_hook.current_filter_ ==
              Filter.ARCHIVED_STARRED_UNSORTED
            ) {
              filter = Filter.STARRED_UNSORTED
            }

            filter_view_options_hook.set_filter_query_param_(filter)
          },
        },
      ]}
      icon_buttons_={[
        {
          icon_variant_:
            bookmarks_hook.density == 'default'
              ? 'DENSITY_DEFAULT'
              : 'DENSITY_COMPACT',
          on_click: () => {
            if (bookmarks_hook.is_fetching) return
            dispatch(
              bookmarks_actions.set_density_of_current_bookmarks(
                bookmarks_hook.density == 'default' ? 'compact' : 'default',
              ),
            )
            window.scrollTo(0, 0)
          },
        },
        { icon_variant_: 'THREE_DOTS', on_click: () => {} },
      ]}
    />
  )
  const slot_pinned = (
    <UiAppLibrary_PinnedBookmarks
      key={`${pinned_updated_at}-${popstate_count}`}
      library_updated_at_timestamp_={library_updated_at_timestamp}
      favicon_host_={favicon_host}
      translations_={{
        nothing_pinned_: props.dictionary.app.library.nothing_pinned,
      }}
      items_={
        pinned_hook.items?.map((item) => ({
          bookmark_id_: item.bookmark_id,
          url_: item.url,
          created_at_: new Date(item.created_at),
          title_: item.title,
          is_unsorted_: item.is_unsorted,
          is_archived_: item.is_archived,
          is_parsed_: item.is_parsed,
          is_public_: item.is_public,
          stars_: item.stars,
          tags_: item.tags,
          open_snapshot_: item.open_snapshot,
          favicon_: item.favicon,
        })) || []
      }
      is_draggable_={!username && !pinned_hook.is_updating}
      on_change_={async (updated_pinned) => {
        await dispatch(
          pinned_actions.update_pinned({
            update_pinned_params: {
              items: updated_pinned.map((item) => ({
                url: item.url_,
                is_public: item.is_public_,
                title: item.title_,
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
      on_click_={async (item) => {
        if (!username) {
          const record_visit_params: RecordVisit_Params = {
            bookmark_id: item.bookmark_id_,
            visited_at: new Date().toISOString(),
          }
          localStorage.setItem(
            browser_storage.local_storage.authorized_library
              .record_visit_params,
            JSON.stringify(record_visit_params),
          )
        }
        window.onbeforeunload = null
        const url = item.open_snapshot_
          ? url_to_wayback({ date: item.created_at_, url: item.url_ })
          : item.url_
        setTimeout(() => {
          location.href = url
        }, 0)
      }}
      on_middle_click_={(item) => {
        if (!username) {
          const data_source = new Bookmarks_DataSourceImpl(
            auth_context.ky_instance,
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          repository.record_visit({
            bookmark_id: item.bookmark_id_,
            visited_at: new Date().toISOString(),
          })
        }
      }}
      selected_tags_={tag_view_options_hook.selected_tags_}
      selected_starred_={
        filter_view_options_hook.current_filter_ == Filter.STARRED ||
        filter_view_options_hook.current_filter_ == Filter.STARRED_UNSORTED ||
        filter_view_options_hook.current_filter_ == Filter.ARCHIVED_STARRED ||
        filter_view_options_hook.current_filter_ ==
          Filter.ARCHIVED_STARRED_UNSORTED
      }
      selected_unsorted_={
        filter_view_options_hook.current_filter_ == Filter.UNSORTED ||
        filter_view_options_hook.current_filter_ == Filter.STARRED_UNSORTED ||
        filter_view_options_hook.current_filter_ == Filter.ARCHIVED_UNSORTED ||
        filter_view_options_hook.current_filter_ ==
          Filter.ARCHIVED_STARRED_UNSORTED
      }
      selected_archived_={is_archived_filter}
      current_gte_={date_view_options_hook.current_gte_}
      current_lte_={date_view_options_hook.current_lte_}
    />
  )
  const slot_tag_hierarchies = (
    <div style={{ pointerEvents: is_not_interactive ? 'none' : undefined }}>
      <UiAppAtom_TagHierarchies
        library_updated_at_timestamp_={library_updated_at_timestamp}
        show_skeleton_={show_skeletons}
        is_read_only_={!!username}
        tree_={tag_hierarchies_hook.tag_hierarchies}
        on_update_={async (tag_hierarchies: TagHierarchies.Node[]) => {
          const filter = filter_view_options_hook.current_filter_

          const update_tag_hierarchies_params: UpdateTagHierarchies_Params = {
            tag_hierarchies,
            gte: date_view_options_hook.current_gte_,
            lte: date_view_options_hook.current_lte_,
            starred_only:
              filter == Filter.STARRED ||
              filter == Filter.STARRED_UNSORTED ||
              filter == Filter.ARCHIVED_STARRED ||
              filter == Filter.ARCHIVED_STARRED_UNSORTED ||
              undefined,
            unsorted_only:
              filter == Filter.UNSORTED ||
              filter == Filter.STARRED_UNSORTED ||
              filter == Filter.ARCHIVED_UNSORTED ||
              filter == Filter.ARCHIVED_STARRED_UNSORTED ||
              undefined,
            is_archived:
              filter == Filter.ARCHIVED ||
              filter == Filter.ARCHIVED_STARRED ||
              filter == Filter.ARCHIVED_UNSORTED ||
              filter == Filter.ARCHIVED_STARRED_UNSORTED ||
              undefined,
          }

          await dispatch(
            tag_hierarchies_actions.update_tag_hierarchies({
              update_tag_hierarchies_params,
              ky: auth_context.ky_instance,
              encryption_key: auth_context.auth_data!.encryption_key,
            }),
          )
          toast.success(props.dictionary.app.library.tag_hierarchies_upated)
        }}
        selected_tag_ids_={tag_view_options_hook.selected_tags_}
        is_updating_={tag_hierarchies_hook.is_updating}
        on_item_click_={(tag_ids: number[]) => {
          tag_view_options_hook.set_many_tags_to_search_params({
            tag_ids,
          })
        }}
        library_url_={username ? `/${username}` : '/library'}
        dragged_tag_={tag_view_options_hook.dragged_tag}
        all_bookmarks_yields_={tag_hierarchies_hook.total}
        is_all_bookmarks_selected_={
          !tag_view_options_hook.selected_tags_.length
        }
        on_click_all_bookmarks_={() => {
          tag_view_options_hook.clear_selected_tags()
          if (bookmarks_hook.showing_bookmarks_fetched_by_ids) {
            search_hook.reset()
            if (filter_view_options_hook.current_filter_ == Filter.NONE) {
              bookmarks_hook.get_bookmarks_({})
            }
          }
        }}
        on_tag_rename_click_={(old_tag_id: number) => {
          const old_tag_name = counts_hook.tags![old_tag_id].name
          on_tag_rename_click({ old_tag_name, old_tag_id })
        }}
        translations_={{
          all_bookmarks_: props.dictionary.app.library.all_bookmarks,
          drag_here_: props.dictionary.app.library.drag_tag_here,
          delete_: props.dictionary.app.library.delete,
          rename_: props.dictionary.app.library.rename,
        }}
      />
    </div>
  )
  const slot_aside = (
    <UiAppTemplate_LibraryAside
      support_label_={props.dictionary.app.library.send_feedback}
      support_href_="https://github.com/taaabs/community/discussions"
      slot_segmented_buttons_={
        is_hydrated ? (
          <>
            <UiAppAtom_SegmentedButton
              key={`1-${popstate_count}`}
              is_not_interactive={is_not_interactive}
              items={[
                {
                  label: props.dictionary.app.library.sort_by_options.date,
                  is_selected:
                    sort_by_view_options_hook.current_sort_by_ !=
                    SortBy.POPULARITY,
                },
                {
                  label:
                    props.dictionary.app.library.sort_by_options.the_huggiest,
                  is_selected:
                    sort_by_view_options_hook.current_sort_by_ ==
                    SortBy.POPULARITY,
                },
              ]}
              on_item_click={(option_idx) => {
                if (
                  option_idx == 0 &&
                  sort_by_view_options_hook.current_sort_by_ ==
                    SortBy.POPULARITY
                ) {
                  sort_by_view_options_hook.set_sort_by_query_param_(
                    SortBy.CREATED_AT,
                  )
                } else if (option_idx == 1) {
                  sort_by_view_options_hook.set_sort_by_query_param_(
                    SortBy.POPULARITY,
                  )
                }
              }}
            />
            {!username ? (
              <UiAppAtom_SegmentedButton
                key={`2-${popstate_count}`}
                is_not_interactive={is_not_interactive}
                is_disabled={
                  sort_by_view_options_hook.current_sort_by_ ==
                  SortBy.POPULARITY
                }
                items={[
                  {
                    label: props.dictionary.app.library.sort_by_options.added,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by_ ==
                      SortBy.CREATED_AT,
                  },
                  {
                    label: props.dictionary.app.library.sort_by_options.edited,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by_ ==
                      SortBy.UPDATED_AT,
                  },
                  {
                    label: props.dictionary.app.library.sort_by_options.visited,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by_ ==
                      SortBy.VISITED_AT,
                  },
                ]}
                on_item_click={(option_idx) => {
                  if (option_idx == 0) {
                    sort_by_view_options_hook.set_sort_by_query_param_(
                      SortBy.CREATED_AT,
                    )
                  } else if (option_idx == 1) {
                    sort_by_view_options_hook.set_sort_by_query_param_(
                      SortBy.UPDATED_AT,
                    )
                  } else if (option_idx == 2) {
                    sort_by_view_options_hook.set_sort_by_query_param_(
                      SortBy.VISITED_AT,
                    )
                  }
                }}
              />
            ) : (
              <UiAppAtom_SegmentedButton
                key={`2-${popstate_count}`}
                is_not_interactive={is_not_interactive}
                is_disabled={
                  sort_by_view_options_hook.current_sort_by_ ==
                  SortBy.POPULARITY
                }
                items={[
                  {
                    label: props.dictionary.app.library.sort_by_options.added,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by_ ==
                      SortBy.CREATED_AT,
                  },
                  {
                    label: props.dictionary.app.library.sort_by_options.edited,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by_ ==
                      SortBy.UPDATED_AT,
                  },
                ]}
                on_item_click={(option_idx) => {
                  if (option_idx == 0) {
                    sort_by_view_options_hook.set_sort_by_query_param_(
                      SortBy.CREATED_AT,
                    )
                  } else if (option_idx == 1) {
                    sort_by_view_options_hook.set_sort_by_query_param_(
                      SortBy.UPDATED_AT,
                    )
                  }
                }}
              />
            )}
            <UiAppAtom_SegmentedButton
              key={`3-${popstate_count}`}
              is_not_interactive={is_not_interactive}
              is_disabled={
                sort_by_view_options_hook.current_sort_by_ == SortBy.POPULARITY
              }
              items={[
                {
                  label: props.dictionary.app.library.order_options.newest,
                  is_selected:
                    order_view_options_hook.current_order_ == Order.DESC,
                },
                {
                  label: props.dictionary.app.library.order_options.oldest,
                  is_selected:
                    order_view_options_hook.current_order_ == Order.ASC,
                },
              ]}
              on_item_click={(option_idx) => {
                if (option_idx == 0) {
                  order_view_options_hook.set_order_query_param_(Order.DESC)
                } else if (option_idx == 1) {
                  order_view_options_hook.set_order_query_param_(Order.ASC)
                }
              }}
            />
          </>
        ) : (
          <UiAppAtom_SegmentedButtonsSkeleton />
        )
      }
      slot_custom_range_={
        !show_skeletons ? (
          <div
            style={{
              pointerEvents: is_fetching_first_bookmarks ? 'none' : undefined,
            }}
          >
            <CustomRange
              locale={props.dictionary.locale}
              library_updated_at_timestamp={library_updated_at_timestamp}
              counts={counts_hook.months || undefined}
              on_yyyymm_change={
                date_view_options_hook.set_gte_lte_search_params_
              }
              clear_date_range={
                date_view_options_hook.clear_gte_lte_search_params_
              }
              current_gte={date_view_options_hook.current_gte_}
              current_lte={date_view_options_hook.current_lte_}
              selected_tags={tag_view_options_hook.selected_tags_}
              is_range_selector_disabled={
                sort_by_view_options_hook.current_sort_by_ ==
                  SortBy.UPDATED_AT ||
                sort_by_view_options_hook.current_sort_by_ ==
                  SortBy.VISITED_AT ||
                sort_by_view_options_hook.current_sort_by_ == SortBy.POPULARITY
              }
              translations={{
                custom_range: props.dictionary.app.library.range_of_months,
                range_not_available:
                  props.dictionary.app.library.range_not_available,
                nothing_to_plot: props.dictionary.app.library.nothing_to_plot,
                results_fit_in_one_month:
                  props.dictionary.app.library.results_fit_in_one_month,
              }}
            />
          </div>
        ) : (
          <UiAppAtom_CustomRangeSkeleton />
        )
      }
      slot_tags_={
        <div
          style={{
            opacity:
              is_fetching_first_bookmarks && !search_hook.search_string
                ? 'var(--dimmed-opacity)'
                : undefined,
            pointerEvents: is_not_interactive ? 'none' : undefined,
          }}
        >
          {!show_skeletons ? (
            <>
              <UiAppAtom_SelectedTags
                key={`selected-tags-${library_updated_at_timestamp}-${popstate_count}`}
                selected_tags={tag_view_options_hook.selected_tags_
                  .filter((id) =>
                    !counts_hook.tags ? false : counts_hook.tags[id],
                  )
                  .map((id) => {
                    return {
                      id,
                      name: counts_hook.tags ? counts_hook.tags![id].name : '',
                    }
                  })}
                on_selected_tag_click={(tag_id) =>
                  tag_view_options_hook.remove_tags_from_search_params_([
                    tag_id,
                  ])
                }
                on_tag_rename_click_={(old_tag_id: number) => {
                  const old_tag_name = counts_hook.tags![old_tag_id].name
                  on_tag_rename_click({ old_tag_name, old_tag_id })
                }}
                translations_={{
                  rename_: props.dictionary.app.library.rename,
                }}
              />
              <UiAppAtom_Tags
                key={`tags-${library_updated_at_timestamp}-${popstate_count}`}
                library_url_={username ? `/${username}` : '/library'}
                tags_={
                  counts_hook.tags
                    ? Object.entries(counts_hook.tags)
                        .filter(
                          (tag) =>
                            !tag_view_options_hook.selected_tags_.includes(
                              parseInt(tag[0]),
                            ),
                        )
                        .map((tag) => ({
                          id: parseInt(tag[0]),
                          name: tag[1].name,
                          yields: tag[1].yields,
                        }))
                    : []
                }
                on_click_={tag_view_options_hook.add_tag_to_search_params_}
                on_tag_drag_start_={
                  !username ? tag_view_options_hook.set_dragged_tag : undefined
                }
                on_tag_rename_click_={(old_tag_id: number) => {
                  const old_tag_name = counts_hook.tags![old_tag_id].name
                  on_tag_rename_click({ old_tag_name, old_tag_id })
                }}
                translations_={{
                  rename_: props.dictionary.app.library.rename,
                }}
              />
            </>
          ) : (
            <UiAppAtom_TagsSkeleton />
          )}
        </div>
      }
    />
  )
  const slot_bookmarks = bookmarks_hook.bookmarks?.map((bookmark, i) => (
    <UiAppAtom_BookmarkWrapper
      key={`${bookmark.id}-${i}-${library_updated_at_timestamp}-${popstate_count}`}
      created_at_={new Date(bookmark.created_at)}
      locale={props.dictionary.locale}
      search_queried_at_timestamp_={search_hook.queried_at_timestamp}
      bookmark_id_={bookmark.id}
      library_url_={username ? `/${username}` : '/library'}
      on_tag_drag_start_={
        !username ? tag_view_options_hook.set_dragged_tag : undefined
      }
      density_={bookmarks_hook.density}
      is_search_result_={bookmarks_hook.showing_bookmarks_fetched_by_ids}
      is_compact_={bookmark.is_compact}
      updated_at_={bookmark.updated_at}
      is_public_={bookmark.is_public}
      points_given_={points_hook.points_given_[bookmark.id]}
      points_={bookmark.points}
      cover_={bookmark.cover}
      on_get_points_given_click_={
        auth_context.auth_data
          ? () => {
              points_hook.get_points_given_on_bookmark_({
                bookmark_id: bookmark.id,
              })
            }
          : undefined
      }
      on_give_point_click_={
        auth_context.auth_data
          ? (points: number) => {
              points_hook.give_points_({ bookmark_id: bookmark.id, points })
            }
          : undefined
      }
      title_={bookmark.title}
      note_={bookmark.note}
      on_click_={() => {
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
      }}
      date_={
        sort_by_view_options_hook.current_sort_by_ == SortBy.CREATED_AT
          ? new Date(bookmark.created_at)
          : sort_by_view_options_hook.current_sort_by_ == SortBy.UPDATED_AT
          ? new Date(bookmark.updated_at)
          : sort_by_view_options_hook.current_sort_by_ == SortBy.VISITED_AT
          ? new Date(bookmark.visited_at)
          : new Date(bookmark.created_at)
      }
      search_params_={search_params.toString()}
      tags_={
        bookmark.tags
          ? bookmark.tags.map((tag) => {
              const is_selected = is_fetching_first_bookmarks
                ? counts_hook.selected_tags_.find((t) => t == tag.id) !=
                  undefined
                : tag_view_options_hook.selected_tags_.find(
                    (t) => t == tag.id,
                  ) !== undefined

              return {
                name_: tag.name,
                is_selected_: is_selected,
                id: tag.id,
                yields_:
                  !is_selected && counts_hook.tags && counts_hook.tags[tag.id]
                    ? counts_hook.tags[tag.id].yields
                    : undefined,
                is_public_: tag.is_public,
              }
            })
          : []
      }
      is_unsorted_={
        !username && bookmark.is_unsorted === undefined
          ? true
          : bookmark.is_unsorted
      }
      stars_={bookmark.stars}
      on_tag_click_={tag_view_options_hook.add_tag_to_search_params_}
      on_selected_tag_click_={(tag_id) =>
        tag_view_options_hook.remove_tags_from_search_params_([tag_id])
      }
      render_height_={bookmark.render_height}
      set_render_height_={(height) => {
        dispatch(
          bookmarks_actions.set_bookmark_render_height({
            index: i,
            height,
          }),
        )
      }}
      on_link_click_={async (url) => {
        if (!username) {
          const record_visit_params: RecordVisit_Params = {
            bookmark_id: bookmark.id,
            visited_at: new Date().toISOString(),
          }
          localStorage.setItem(
            browser_storage.local_storage.authorized_library
              .record_visit_params,
            JSON.stringify(record_visit_params),
          )
        }
        window.onbeforeunload = null
        // Timeout is there so updated by cache_data values of search_data_awaits_caching,
        // archived_search_data_awaits_caching can be seen by "beforeunload" event handler.
        setTimeout(() => {
          location.href = url
        }, 0)
      }}
      on_is_visible={() => {
        // Prefetch links data.
        if (bookmark.links.find((link) => link.is_parsed)) {
          const data_source = new Bookmarks_DataSourceImpl(
            auth_context.ky_instance,
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          if (username) {
            repository.get_links_data_public({
              bookmark_id: bookmark.id,
              bookmark_updated_at: new Date(bookmark.updated_at),
              username,
            })
          } else {
            repository.get_links_data_authorized(
              {
                bookmark_id: bookmark.id,
                bookmark_updated_at: new Date(bookmark.updated_at),
              },
              auth_context.auth_data!.encryption_key,
            )
          }
        }
      }}
      on_reading_mode_click_={async (url) => {
        const data_source = new Bookmarks_DataSourceImpl(
          auth_context.ky_instance,
        )
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
          await reader_modal_setter({
            reader_data: link_data.reader_data,
            dictionary: props.dictionary,
            modal_context: modal_context,
          })
        }
      }}
      on_link_middle_click_={() => {
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
      on_new_tab_link_click_={(url) => {
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
      favicon_host_={favicon_host}
      // We pass dragged tag so on_mouse_up has access to current state (memoized component is refreshed).
      dragged_tag_={tag_view_options_hook.dragged_tag}
      on_mouse_up_={async () => {
        if (!tag_view_options_hook.dragged_tag) return
        if (bookmark.tags.length == system_values.bookmark.tags.limit) {
          toast.error(props.dictionary.app.library.errors.tag_limit_reached)
          return
        }
        if (
          bookmark.tags.findIndex(
            (tag) => tag.id == tag_view_options_hook.dragged_tag!.id_,
          ) != -1
        ) {
          return
        }
        dispatch(bookmarks_actions.set_is_upserting(true))
        const modified_bookmark: UpsertBookmark_Params = {
          bookmark_id: bookmark.id,
          is_public: bookmark.is_public,
          created_at: new Date(bookmark.created_at),
          title: bookmark.title,
          note: bookmark.note,
          is_archived: is_archived_filter,
          is_unsorted: bookmark.is_unsorted,
          stars: bookmark.stars,
          links: bookmark.links.map((link) => ({
            url: link.url,
            site_path: link.site_path,
            is_public: link.is_public,
            is_pinned: link.is_pinned,
            pin_title: link.pin_title,
            open_snapshot: link.open_snapshot,
            favicon: link.favicon,
          })),
          tags: [
            ...bookmark.tags.map((tag) => ({
              name: tag.name,
              is_public: tag.is_public,
            })),
            {
              name: tag_view_options_hook.dragged_tag.name_,
              is_public: bookmark.is_public,
            },
          ],
          cover: bookmark.cover,
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
              tag_hierarchies_hook.get_authorized_request_params_({
                filter: filter_view_options_hook.current_filter_,
                gte: date_view_options_hook.current_gte_,
                lte: date_view_options_hook.current_lte_,
              }),
            ky: auth_context.ky_instance,
            encryption_key: auth_context.auth_data!.encryption_key,
          }),
        )
        if (search_hook.result?.hits.length) {
          await search_hook.get_result({
            search_string: search_hook.search_string,
            refresh_highlights_only: true,
          })
        }
        dispatch(bookmarks_actions.set_is_upserting(false))
        toast.success(props.dictionary.app.library.bookmark_updated)
      }}
      on_tags_order_change_={
        !username
          ? async (tags) => {
              dispatch(bookmarks_actions.set_is_upserting(true))
              const modified_bookmark: UpsertBookmark_Params = {
                bookmark_id: bookmark.id,
                is_public: bookmark.is_public,
                created_at: new Date(bookmark.created_at),
                title: bookmark.title,
                note: bookmark.note,
                is_archived: is_archived_filter,
                is_unsorted: bookmark.is_unsorted,
                stars: bookmark.stars,
                links: bookmark.links.map((link) => ({
                  url: link.url,
                  site_path: link.site_path,
                  is_public: link.is_public,
                  is_pinned: link.is_pinned,
                  pin_title: link.pin_title,
                  open_snapshot: link.open_snapshot,
                  favicon: link.favicon,
                })),
                tags: tags.map((tag) => ({
                  name: tag.name_,
                  is_public: tag.is_public_ || false,
                })),
                cover: bookmark.cover,
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
              if (search_hook.result?.hits.length) {
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
      on_tag_rename_click_={(old_tag_id: number) => {
        const old_tag_name = counts_hook.tags![old_tag_id].name
        on_tag_rename_click({ old_tag_name, old_tag_id })
      }}
      on_tag_delete_click_={async (tag_id) => {
        dispatch(bookmarks_actions.set_is_upserting(true))
        const modified_bookmark: UpsertBookmark_Params = {
          bookmark_id: bookmark.id,
          is_public: bookmark.is_public,
          created_at: new Date(bookmark.created_at),
          title: bookmark.title,
          note: bookmark.note,
          is_archived: is_archived_filter,
          is_unsorted: bookmark.is_unsorted,
          stars: bookmark.stars,
          links: bookmark.links.map((link) => ({
            url: link.url,
            site_path: link.site_path,
            is_public: link.is_public,
            is_pinned: link.is_pinned,
            pin_title: link.pin_title,
            open_snapshot: link.open_snapshot,
            favicon: link.favicon,
          })),
          tags: bookmark.tags
            .filter((tag) => tag.id !== tag_id)
            .map((tag) => ({
              name: tag.name,
              is_public: tag.is_public,
            })),
          cover: bookmark.cover,
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
              tag_hierarchies_hook.get_authorized_request_params_({
                filter: filter_view_options_hook.current_filter_,
                gte: date_view_options_hook.current_gte_,
                lte: date_view_options_hook.current_lte_,
              }),
            ky: auth_context.ky_instance,
            encryption_key: auth_context.auth_data!.encryption_key,
          }),
        )
        if (search_hook.result?.hits.length) {
          await search_hook.get_result({
            search_string: search_hook.search_string,
            refresh_highlights_only: true,
          })
        }
        const updated_tag_ids = updated_bookmark.tags.map((t) => t.id)
        if (
          !tag_view_options_hook.selected_tags_.every((t) =>
            updated_tag_ids.includes(t),
          )
        ) {
          // We filter out bookmark when there are other bookmarks still matching with selected tags.
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
          tag_view_options_hook.selected_tags_.includes(tag_id) &&
          counts_hook.tags![tag_id].yields == 1
        ) {
          dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(true))
          tag_view_options_hook.remove_tags_from_search_params_([tag_id])
        }
        dispatch(bookmarks_actions.set_is_upserting(false))
        toast.success(props.dictionary.app.library.bookmark_updated)
      }}
      links_={bookmark.links.map((link) => ({
        url_: link.url,
        saves_: link.saves,
        site_path_: link.site_path,
        is_pinned_: link.is_pinned,
        is_public_: link.is_public,
        favicon_: link.favicon,
        open_snapshot_: link.open_snapshot,
        is_parsed_: link.is_parsed,
        menu_slot_: !username ? (
          <UiCommon_Dropdown>
            {link.open_snapshot ? (
              <UiCommon_Dropdown_StandardItem
                icon_variant="LINK"
                label={props.dictionary.app.library.bookmark.open_original_url}
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
              <UiCommon_Dropdown_StandardItem
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
            <UiCommon_Dropdown_Separator />
            <UiCommon_Dropdown_CheckboxItem
              is_checked={link.is_pinned || false}
              label={props.dictionary.app.library.bookmark.pinned_to_sidebar}
              on_click={async () => {
                const is_pinned = !link.is_pinned
                dispatch(bookmarks_actions.set_is_upserting(true))
                const modified_bookmark: UpsertBookmark_Params = {
                  bookmark_id: bookmark.id,
                  is_public: bookmark.is_public,
                  created_at: new Date(bookmark.created_at),
                  title: bookmark.title,
                  note: bookmark.note,
                  is_archived: is_archived_filter,
                  is_unsorted: bookmark.is_unsorted,
                  stars: bookmark.stars,
                  links: bookmark.links.map((l) => ({
                    url: l.url,
                    site_path: l.site_path,
                    is_public: l.is_public,
                    is_pinned: link.url == l.url ? is_pinned : l.is_pinned,
                    pin_title: l.pin_title,
                    open_snapshot: l.open_snapshot,
                    favicon: link.favicon,
                  })),
                  tags: bookmark.tags.map((tag) => ({
                    name: tag.name,
                    is_public: tag.is_public,
                  })),
                  cover: bookmark.cover,
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
                dispatch(bookmarks_actions.set_is_upserting(false))
                toast.success(
                  is_pinned
                    ? props.dictionary.app.library.link_is_now_pinned
                    : props.dictionary.app.library.pin_has_been_removed,
                )
              }}
            />
            <UiCommon_Dropdown_CheckboxItem
              is_checked={link.open_snapshot || false}
              label={props.dictionary.app.library.bookmark.use_snapshot}
              on_click={async () => {
                const open_snapshot = !link.open_snapshot
                dispatch(bookmarks_actions.set_is_upserting(true))
                const modified_bookmark: UpsertBookmark_Params = {
                  bookmark_id: bookmark.id,
                  is_public: bookmark.is_public,
                  created_at: new Date(bookmark.created_at),
                  title: bookmark.title,
                  note: bookmark.note,
                  is_archived: is_archived_filter,
                  is_unsorted: bookmark.is_unsorted,
                  stars: bookmark.stars,
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
                  tags: bookmark.tags.map((tag) => ({
                    name: tag.name,
                    is_public: tag.is_public,
                  })),
                  cover: bookmark.cover,
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
                dispatch(bookmarks_actions.set_is_upserting(false))
                toast.success(
                  open_snapshot
                    ? props.dictionary.app.library.use_snapshot
                    : props.dictionary.app.library.use_original,
                )
              }}
            />
          </UiCommon_Dropdown>
        ) : (
          <UiCommon_Dropdown>
            {link.open_snapshot ? (
              <UiCommon_Dropdown_StandardItem
                icon_variant="LINK"
                label={'Open original URL'}
                on_click={() => {
                  window.onbeforeunload = null
                  location.href = link.url
                }}
              />
            ) : (
              <UiCommon_Dropdown_StandardItem
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
          </UiCommon_Dropdown>
        ),
      }))}
      menu_slot_={
        !username ? (
          <UiCommon_Dropdown>
            <UiCommon_Dropdown_Stars
              no_selected={bookmark.stars}
              on_click={async (no_stars) => {
                dispatch(bookmarks_actions.set_is_upserting(true))
                const modified_bookmark: UpsertBookmark_Params = {
                  bookmark_id: bookmark.id,
                  is_public: bookmark.is_public,
                  created_at: new Date(bookmark.created_at),
                  title: bookmark.title,
                  note: bookmark.note,
                  is_archived: is_archived_filter,
                  is_unsorted: bookmark.is_unsorted,
                  stars: bookmark.stars == no_stars ? 0 : no_stars,
                  links: bookmark.links.map((link) => ({
                    url: link.url,
                    site_path: link.site_path,
                    is_public: link.is_public,
                    is_pinned: link.is_pinned,
                    pin_title: link.pin_title,
                    open_snapshot: link.open_snapshot,
                    favicon: link.favicon,
                  })),
                  tags: bookmark.tags.map((tag) => ({
                    name: tag.name,
                    is_public: tag.is_public,
                  })),
                  cover: bookmark.cover,
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
                      tag_hierarchies_hook.get_authorized_request_params_({
                        filter: filter_view_options_hook.current_filter_,
                        gte: date_view_options_hook.current_gte_,
                        lte: date_view_options_hook.current_lte_,
                      }),
                    ky: auth_context.ky_instance,
                    encryption_key: auth_context.auth_data!.encryption_key,
                  }),
                )
                if (
                  search_hook.count &&
                  (filter_view_options_hook.current_filter_ == Filter.STARRED ||
                    filter_view_options_hook.current_filter_ ==
                      Filter.STARRED_UNSORTED ||
                    filter_view_options_hook.current_filter_ ==
                      Filter.ARCHIVED_STARRED ||
                    filter_view_options_hook.current_filter_ ==
                      Filter.ARCHIVED_STARRED_UNSORTED) &&
                  bookmark.stars == 1
                ) {
                  search_hook.set_count(search_hook.count - 1)
                }
                dispatch(bookmarks_actions.set_is_upserting(false))
                toast.success(props.dictionary.app.library.bookmark_updated)
              }}
            />
            <UiCommon_Dropdown_CheckboxItem
              is_checked={
                bookmark.is_unsorted === undefined ? true : bookmark.is_unsorted
              }
              label={props.dictionary.app.library.bookmark.unsorted}
              on_click={async () => {
                dispatch(bookmarks_actions.set_is_upserting(true))
                const modified_bookmark: UpsertBookmark_Params = {
                  bookmark_id: bookmark.id,
                  is_public: bookmark.is_public,
                  created_at: new Date(bookmark.created_at),
                  title: bookmark.title,
                  note: bookmark.note,
                  is_archived: is_archived_filter,
                  is_unsorted: !(bookmark.is_unsorted === undefined
                    ? true
                    : bookmark.is_unsorted),
                  stars: bookmark.stars,
                  links: bookmark.links.map((link) => ({
                    url: link.url,
                    site_path: link.site_path,
                    is_public: link.is_public,
                    is_pinned: link.is_pinned,
                    pin_title: link.pin_title,
                    open_snapshot: link.open_snapshot,
                    favicon: link.favicon,
                  })),
                  tags: bookmark.tags.map((tag) => ({
                    name: tag.name,
                    is_public: tag.is_public,
                  })),
                  cover: bookmark.cover,
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
                      tag_hierarchies_hook.get_authorized_request_params_({
                        filter: filter_view_options_hook.current_filter_,
                        gte: date_view_options_hook.current_gte_,
                        lte: date_view_options_hook.current_lte_,
                      }),
                    ky: auth_context.ky_instance,
                    encryption_key: auth_context.auth_data!.encryption_key,
                  }),
                )
                if (
                  search_hook.count &&
                  (filter_view_options_hook.current_filter_ ==
                    Filter.UNSORTED ||
                    filter_view_options_hook.current_filter_ ==
                      Filter.STARRED_UNSORTED ||
                    filter_view_options_hook.current_filter_ ==
                      Filter.ARCHIVED_STARRED_UNSORTED) &&
                  bookmark.is_unsorted
                ) {
                  search_hook.set_count(search_hook.count! - 1)
                }
                dispatch(bookmarks_actions.set_is_upserting(false))
                toast.success(props.dictionary.app.library.bookmark_updated)
              }}
            />
            <UiCommon_Dropdown_Separator />
            <UiCommon_Dropdown_StandardItem
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
                  modal_context.set_modal_content({})
                  return
                }
                dispatch(bookmarks_actions.set_is_upserting(true))
                let should_refetch_links_reader_data = false
                if (bookmark.is_public != modified_bookmark.is_public) {
                  should_refetch_links_reader_data = true
                }
                if (!should_refetch_links_reader_data) {
                  modified_bookmark.links.forEach((link) => {
                    const old_link = bookmark.links.find(
                      (l) => l.url == link.url,
                    )
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
                      tag_hierarchies_hook.get_authorized_request_params_({
                        filter: filter_view_options_hook.current_filter_,
                        gte: date_view_options_hook.current_gte_,
                        lte: date_view_options_hook.current_lte_,
                      }),
                    ky: auth_context.ky_instance,
                    encryption_key: auth_context.auth_data!.encryption_key,
                  }),
                )
                const updated_tag_ids = updated_bookmark.tags.map((t) => t.id)
                if (
                  !tag_view_options_hook.selected_tags_.every((t) =>
                    updated_tag_ids.includes(t),
                  )
                ) {
                  // We filter out bookmark when there are other bookmarks still matching with selected tags.
                  dispatch(
                    bookmarks_actions.filter_out_bookmark({
                      bookmark_id: updated_bookmark.id,
                    }),
                  )
                  if (search_hook.count) {
                    search_hook.set_count(search_hook.count - 1)
                  }
                }
                // Unselect removed tags when there is no more bookmarks with them.
                const tags_to_remove_from_search_params =
                  tag_view_options_hook.selected_tags_.filter((t) => {
                    const yields = Object.entries(counts_hook.tags!).find(
                      (tag) => parseInt(tag[0]) == t,
                    )![1].yields
                    return !updated_tag_ids.includes(t) && yields == 1
                  })
                if (tags_to_remove_from_search_params.length) {
                  dispatch(
                    bookmarks_actions.set_is_fetching_first_bookmarks(true),
                  )
                  tag_view_options_hook.remove_tags_from_search_params_(
                    tags_to_remove_from_search_params,
                  )
                }
                if (search_hook.result?.hits.length) {
                  await search_hook.get_result({
                    search_string: search_hook.search_string,
                    refresh_highlights_only: true,
                  })
                }
                dispatch(bookmarks_actions.set_is_upserting(false))
                modal_context.set_modal_content({})
                toast.success(props.dictionary.app.library.bookmark_updated)
              }}
            />
            <UiCommon_Dropdown_StandardItem
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
                  is_public: bookmark.is_public,
                  created_at: new Date(bookmark.created_at),
                  title: bookmark.title,
                  is_archived: !is_archived_filter,
                  is_unsorted: bookmark.is_unsorted,
                  stars: bookmark.stars,
                  links: bookmark.links.map((link) => ({
                    url: link.url,
                    site_path: link.site_path,
                    is_public: link.is_public,
                    is_pinned: link.is_pinned,
                    pin_title: link.pin_title,
                    open_snapshot: link.open_snapshot,
                    favicon: link.favicon,
                  })),
                  tags: bookmark.tags.map((tag) => ({
                    name: tag.name,
                    is_public: tag.is_public,
                  })),
                  cover: bookmark.cover,
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
                      tag_hierarchies_hook.get_authorized_request_params_({
                        filter: filter_view_options_hook.current_filter_,
                        gte: date_view_options_hook.current_gte_,
                        lte: date_view_options_hook.current_lte_,
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
            <UiCommon_Dropdown_StandardItem
              icon_variant="DELETE"
              label={props.dictionary.app.library.bookmark.delete}
              on_click={async () => {
                const is_deletion_confirmed =
                  await delete_bookmark_modal_setter({
                    dictionary: props.dictionary,
                    modal_context,
                    title: bookmark.title,
                  })
                if (!is_deletion_confirmed) {
                  modal_context.set_modal_content({})
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
                      tag_hierarchies_hook.get_authorized_request_params_({
                        filter: filter_view_options_hook.current_filter_,
                        gte: date_view_options_hook.current_gte_,
                        lte: date_view_options_hook.current_lte_,
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
                modal_context.set_modal_content({})
                toast.success(props.dictionary.app.library.bookmark_deleted)
              }}
            />
          </UiCommon_Dropdown>
        ) : auth_context.auth_data ? (
          <UiCommon_Dropdown>
            <UiCommon_Dropdown_StandardItem
              icon_variant="COPY"
              label={'Copy to mine'}
              on_click={async () => {}}
            />
          </UiCommon_Dropdown>
        ) : undefined
      }
      highlights_={search_hook.highlights?.[bookmark.id.toString()]}
      highlights_site_variants_={search_hook.highlights_sites_variants}
      orama_db_id_={
        is_archived_filter
          ? props.local_db.archived_db?.id || ''
          : props.local_db.db?.id || ''
      }
      should_dim_visited_links_={username !== undefined}
      // It's important to wait until filter is set to search hook's state.
      current_filter_={search_hook.current_filter}
      translations_={{
        delete_: props.dictionary.app.library.delete,
        rename_: props.dictionary.app.library.rename,
      }}
    />
  ))

  return (
    <>
      <UiAppAtom_DraggedCursorTag
        tag_name={tag_view_options_hook.dragged_tag?.name_}
      />
      <UiAppTemplate_SwipableColumns
        is_following_={undefined}
        welcome_text_={
          !username && auth_context.auth_data
            ? `${props.dictionary.app.library.welcome}, ${auth_context.auth_data.username}`
            : undefined
        }
        on_follow_click_={username ? () => {} : undefined}
        show_skeletons_={show_skeletons}
        slot_search_={slot_search}
        slot_toolbar_={slot_toolbar}
        slot_column_left_={slot_tag_hierarchies}
        slot_column_right_={slot_aside}
        are_bookmarks_dimmed_={
          is_fetching_first_bookmarks || bookmarks_hook.is_upserting || false
        }
        slot_main_={
          <>
            {slot_pinned}
            {slot_bookmarks}
          </>
        }
        on_page_bottom_reached_={() => {
          if (bookmarks_hook.is_fetching || !bookmarks_hook.bookmarks?.length)
            return
          if (!search_hook.search_string && bookmarks_hook.has_more_bookmarks) {
            bookmarks_hook.get_bookmarks_({ should_get_next_page: true })
          } else if (
            search_hook.search_string &&
            search_hook.count &&
            bookmarks_hook.bookmarks &&
            bookmarks_hook.bookmarks.length &&
            bookmarks_hook.bookmarks.length < search_hook.count
          ) {
            bookmarks_hook.get_bookmarks_by_ids_({
              all_not_paginated_ids: search_hook.result!.hits.map((hit) =>
                parseInt(hit.document.id),
              ),
              should_get_next_page: true,
            })
          }
        }}
        clear_selected_tags_={
          !is_fetching_first_bookmarks &&
          !search_hook.result &&
          (!bookmarks_hook.bookmarks || bookmarks_hook.bookmarks.length == 0) &&
          tag_view_options_hook.selected_tags_.length
            ? tag_view_options_hook.clear_selected_tags
            : undefined
        }
        clear_date_range_={
          !is_fetching_first_bookmarks &&
          !search_hook.result &&
          (!bookmarks_hook.bookmarks || bookmarks_hook.bookmarks.length == 0) &&
          (date_view_options_hook.current_gte_ ||
            date_view_options_hook.current_lte_)
            ? date_view_options_hook.clear_gte_lte_search_params_
            : undefined
        }
        info_text_={
          is_fetching_first_bookmarks ||
          bookmarks_hook.is_fetching_more_bookmarks
            ? props.dictionary.app.library.loading
            : (!search_hook.search_string.length &&
                !is_fetching_first_bookmarks &&
                (!bookmarks_hook.bookmarks ||
                  bookmarks_hook.bookmarks.length == 0)) ||
              (search_hook.search_string.length &&
                (!bookmarks_hook.bookmarks ||
                  bookmarks_hook.bookmarks.length == 0))
            ? props.dictionary.app.library.no_results
            : !bookmarks_hook.has_more_bookmarks ||
              bookmarks_hook.bookmarks?.length == search_hook.count
            ? props.dictionary.app.library.end_of_resutls
            : undefined
        }
        translations_={{
          mobile_title_bar_: props.dictionary.app.menu_items.library,
          collapse_alt_: props.dictionary.app.library.collapse_sidebar,
          follow_: props.dictionary.app.library.follow,
          unfollow_: props.dictionary.app.library.unfollow,
          folders_: props.dictionary.app.library.folders,
          clear_selected_tags_:
            props.dictionary.app.library.clear_selected_tags,
        }}
      />
    </>
  )
}

export default Library
