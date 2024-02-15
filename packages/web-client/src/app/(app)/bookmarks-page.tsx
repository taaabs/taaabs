import useToggle from 'beautiful-react-hooks/useToggle'
import { use_library_dispatch, use_library_selector } from '@/stores/library'
import OutsideClickHandler from 'react-outside-click-handler'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { useContext, useEffect, useState } from 'react'
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
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { RecordVisit_UseCase } from '@repositories/modules/bookmarks/domain/usecases/record-visit.use-case'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { BrowserStorage, browser_storage } from '@/constants/browser-storage'
import { use_is_hydrated } from '@shared/hooks'
import { use_search } from '@/hooks/library/use-search'
import { ModalContext } from './modal-provider'
import { useParams, useSearchParams } from 'next/navigation'
import { upsert_bookmark_modal } from '@/modals/upsert-bookmark-modal'
import { toast } from 'react-toastify'
import { CustomRangeSkeleton as UiAppAtom_CustomRangeSkeleton } from '@web-ui/components/app/atoms/custom-range-skeleton'
import { Library as UiAppTemplate_Library } from '@web-ui/components/app/templates/library'
import { LibrarySearch as UiAppAtom_LibrarySearch } from '@web-ui/components/app/atoms/library-search'
import { LibraryAside as UiAppTemplate_LibraryAside } from '@web-ui/components/app/templates/library-aside'
import { ButtonSelect as UiAppAtom_ButtonSelect } from '@web-ui/components/app/atoms/button-select'
import { ButtonSelectSkeleton as UiAppAtom_ButtonSelectSkeleton } from '@web-ui/components/app/atoms/button-select-skeleton'
import { DropdownMenu as UiAppAtom_DropdownMenu } from '@web-ui/components/app/atoms/dropdown-menu'
import { SelectedTags as UiAppAtom_SelectedTags } from '@web-ui/components/app/atoms/selected-tags'
import { Tags as UiAppAtom_Tags } from '@web-ui/components/app/atoms/tags'
import { TagsSkeleton as UiAppAtom_TagsSkeleton } from '@web-ui/components/app/atoms/tags-skeleton'
import { StarsForDropdown as UiAppAtom_StarsForDropdown } from '@web-ui/components/app/atoms/stars-for-dropdown'
import { Bookmark as UiAppAtom_Bookmark } from '@web-ui/components/app/atoms/bookmark'
import { Icon as UiCommonParticles_Icon } from '@web-ui/components/common/particles/icon'
import { Toolbar as UiAppAtom_Toolbar } from '@web-ui/components/app/atoms/toolbar'
import { TagHierarchiesSkeleton as UiAppAtom_TagHierarchiesSkeleton } from '@web-ui/components/app/atoms/tag-hierarchies-skeleton'
import { use_has_focus } from '@/hooks/misc/use-has-focus'
import { TagHierarchies as UiAppAtom_TagHierarchies } from '@web-ui/components/app/atoms/tag-hierarchies'
import { DraggedCursorTag as UiAppAtom_DraggedCursorTag } from '@web-ui/components/app/atoms/dragged-cursor-tag'
import { use_tag_hierarchies } from '@/hooks/library/use-tag-hierarchies'
import { tag_hierarchies_actions } from '@repositories/stores/library/tag-hierarchies/tag-hierarchies.slice'
import { system_values } from '@shared/constants/system-values'
import { Filter } from '@/types/library/filter'
import { UpdateTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/update-tag-hierarchies.params'
import { counts_actions } from '@repositories/stores/library/counts/counts.slice'
import { use_points } from '@/hooks/library/use-points'

const CustomRange = dynamic(() => import('./dynamic-custom-range'), {
  ssr: false,
  loading: () => <UiAppAtom_CustomRangeSkeleton />,
})

const BookmarksPage: React.FC = () => {
  const is_hydrated = use_is_hydrated()
  use_session_storage_cleanup()
  const dispatch = use_library_dispatch()
  const query_params = useSearchParams()
  const { username } = useParams()
  const modal_context = useContext(ModalContext)
  const [show_custom_range, set_show_custom_range] = useState(false)
  const [show_tags_skeleton, set_show_tags_skeleton] = useState(true)
  const [show_bookmarks_skeleton, set_show_bookmarks_skeleton] = useState(true)
  const bookmarks_slice_state = use_library_selector((state) => state.bookmarks)
  const counts_slice_state = use_library_selector((state) => state.counts)
  const search = use_search()
  const bookmarks = use_bookmarks({
    is_in_search_mode: !!search.search_string,
  })
  const counts = use_counts()
  const points_hook = use_points()
  const tag_hierarchies = use_tag_hierarchies()
  const filter_view_options = use_filter_view_options()
  const sort_by_view_options = use_sort_by_view_options()
  const order_view_options = use_order_view_options()
  const tag_view_options = use_tag_view_options()
  const date_view_options = use_date_view_options()
  const [close_aside_count, set_close_aside_count] = useState(0)
  const [is_sort_by_dropdown_visible, toggle_sort_by_dropdown] =
    useToggle(false)
  const [is_order_dropdown_visible, toggle_order_dropdown] = useToggle(false)
  const [are_bookmark_menu_items_locked, set_are_bookmarks_menu_items_locked] =
    useState(false)

  // Upload deferred recent visit - START
  const has_focus = use_has_focus()

  useUpdateEffect(() => {
    if (username) return
    if (has_focus) {
      const recent_visit: BrowserStorage.LocalStorage.AuthorizedLibrary.RecentVisit | null =
        JSON.parse(
          localStorage.getItem(
            browser_storage.local_storage.authorized_library.recent_visit,
          ) || 'null',
        )
      if (recent_visit) {
        // Timeout prevents white screen when navigating back.
        setTimeout(() => {
          localStorage.removeItem(
            browser_storage.local_storage.authorized_library.recent_visit,
          )
          const data_source = new Bookmarks_DataSourceImpl(
            process.env.NEXT_PUBLIC_API_URL,
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
          )
          const repository = new Bookmarks_RepositoryImpl(data_source)
          const record_visit = new RecordVisit_UseCase(repository)
          record_visit.invoke({
            bookmark_id: recent_visit.bookmark.id,
            visited_at: new Date(recent_visit.visited_at),
          })
        }, 0)
      }
    }
  }, [has_focus])
  // Upload deferred recent visit - END

  useUpdateEffect(() => {
    if (bookmarks_slice_state.bookmarks == null) return
    set_show_custom_range(true)
    set_show_tags_skeleton(false)
    set_show_bookmarks_skeleton(false)
    modal_context?.set_modal()
    sort_by_view_options.set_commited_sort_by(
      sort_by_view_options.current_sort_by,
    )
  }, [bookmarks_slice_state.bookmarks])

  useUpdateEffect(() => {
    search.reset()
  }, [
    filter_view_options.current_filter,
    order_view_options.current_order,
    sort_by_view_options.current_sort_by,
    tag_view_options.selected_tags,
    date_view_options.current_gte,
    date_view_options.current_lte,
  ])

  useUpdateEffect(() => {
    search.set_current_filter(filter_view_options.current_filter)
  }, [filter_view_options.current_filter])

  // Clear cache when user selects visited at sort_by option.
  // Filter is in deps because we want to clear cache when setting to archive.
  // NOTE: Could be reworked to avoid unnecesary invalidations.
  const [search_cache_to_be_cleared, set_search_cache_to_be_cleared] =
    useState(false)
  useUpdateEffect(() => {
    if (
      sort_by_view_options.current_sort_by == SortBy.VISITED_AT ||
      order_view_options.current_order == Order.POPULARITY
    ) {
      set_search_cache_to_be_cleared(true)
    } else {
      set_search_cache_to_be_cleared(false)
    }
  }, [
    filter_view_options.current_filter,
    sort_by_view_options.current_sort_by,
    order_view_options.current_order,
  ])

  useUpdateEffect(() => {
    if (search.db || search.archived_db) {
      search.set_current_filter(filter_view_options.current_filter)
      search.set_selected_tags(
        counts.selected_tags
          .filter((id) => {
            if (
              !bookmarks_slice_state.bookmarks ||
              !bookmarks_slice_state.bookmarks[0]
            )
              return false
            return (
              bookmarks_slice_state.bookmarks[0].tags?.findIndex(
                (tag) => tag.id == id,
              ) != -1
            )
          })
          .map((id) => {
            const name = bookmarks_slice_state.bookmarks![0].tags!.find(
              (tag) => tag.id == id,
            )!.name

            return name
          }),
      )
    }
  }, [search.db, search.archived_db])

  // We don't refetch bookmarks on back/forward navigation, therefore we need
  // to clear "searching" state this way.
  useEffect(() => {
    const handleEvent = () => {
      dispatch(bookmarks_actions.set_showing_bookmarks_fetched_by_ids(false))
    }
    window.addEventListener('popstate', handleEvent)
    return () => window.removeEventListener('popstate', handleEvent)
  }, [])

  useEffect(() => {
    tag_hierarchies.get_tag_hierarchies({
      filter: filter_view_options.current_filter,
      gte: date_view_options.current_gte,
      lte: date_view_options.current_lte,
    })
  }, [
    date_view_options.current_gte,
    date_view_options.current_lte,
    filter_view_options.current_filter,
  ])

  const is_archived_filter =
    filter_view_options.current_filter == Filter.ARCHIVED ||
    filter_view_options.current_filter == Filter.ARCHIVED_STARRED ||
    filter_view_options.current_filter == Filter.ARCHIVED_STARRED_UNREAD ||
    filter_view_options.current_filter == Filter.ARCHIVED_UNREAD

  return (
    <>
      <UiAppAtom_DraggedCursorTag
        tag_name={tag_view_options.dragged_tag?.name}
        sibling_tag_name={tag_view_options.dragged_tag?.over_sibling_tag_name}
      />
      <UiAppTemplate_Library
        translations={{
          collapse_alt: 'Collapse sidebar',
          subscribe: 'Subscribe',
          unsubscribe: 'Unsubscribe',
        }}
        is_subscribed={undefined}
        welcome_text={!username ? `Howdy, username` : undefined}
        on_subscribe_click={username ? () => {} : undefined}
        show_bookmarks_skeleton={show_bookmarks_skeleton}
        close_aside_count={close_aside_count}
        mobile_title_bar={'Bookmarks'}
        slot_search={
          <UiAppAtom_LibrarySearch
            search_string={search.search_string}
            is_loading={search.is_initializing}
            loading_progress_percentage={search.indexed_bookmarks_percentage}
            placeholder={'Search in titles, notes, tags and links...'}
            hints={!search.is_initializing ? search.hints : undefined}
            on_click_hint={(i) => {
              const search_string =
                search.search_string + search.hints![i].completion
              search.set_search_string(search_string)
              search.query_db({ search_string })
            }}
            on_click_recent_hint_remove={(i) => {
              const search_string =
                search.hints![i].search_string + search.hints![i].completion
              search.remove_recent_hint({ search_string })
              search.clear_hints()
              search.set_is_search_focused(false)
            }}
            is_focused={search.is_search_focused}
            on_focus={async () => {
              if (!search.is_initializing) {
                search.set_is_search_focused(true)

                search.set_selected_tags(
                  counts.selected_tags
                    .filter((id) => {
                      if (
                        !bookmarks_slice_state.bookmarks ||
                        !bookmarks_slice_state.bookmarks[0]
                      )
                        return false
                      return (
                        bookmarks_slice_state.bookmarks[0].tags?.findIndex(
                          (tag) => tag.id == id,
                        ) != -1
                      )
                    })
                    .map((id) => {
                      const name =
                        bookmarks_slice_state.bookmarks![0].tags!.find(
                          (tag) => tag.id == id,
                        )!.name

                      return name
                    }),
                )

                if (search_cache_to_be_cleared) {
                  await search.clear_cached_data({
                    is_archived: is_archived_filter,
                  })
                  set_search_cache_to_be_cleared(false)
                }

                const is_cache_stale = await search.check_is_cache_stale({
                  api_url: process.env.NEXT_PUBLIC_API_URL,
                  auth_token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                  is_archived: is_archived_filter,
                })

                if (
                  (!is_archived_filter
                    ? search.db === undefined
                    : search.archived_db === undefined) ||
                  is_cache_stale
                ) {
                  search.reset()
                  await search.init({
                    is_archived: is_archived_filter,
                  })
                }
              }
            }}
            on_change={(value) => {
              if (search.is_initializing) return
              search.set_search_string(value)
              if (!value) {
                bookmarks.get_bookmarks({})
              }
            }}
            on_submit={() => {
              if (search.is_initializing || search.count == 0) return
              if (search.search_string.trim()) {
                search.query_db({ search_string: search.search_string })
              }
            }}
            on_blur={() => {
              search.clear_hints()
              search.set_is_search_focused(false)
            }}
            results_count={search.search_string ? search.count : undefined}
            on_clear_click={() => {
              search.reset()
              bookmarks.get_bookmarks({})
            }}
            is_slash_shortcut_disabled={modal_context?.modal !== undefined}
            on_click_get_help={() => {}}
            translations={{
              footer_tip: 'Tags, filters and custom range affect results.',
              get_help_link: 'Get help',
            }}
          />
        }
        slot_toolbar={
          <UiAppAtom_Toolbar
            toggleable_buttons={[
              {
                label: 'Starred',
                is_toggled:
                  filter_view_options.current_filter == Filter.STARRED ||
                  filter_view_options.current_filter == Filter.STARRED_UNREAD ||
                  filter_view_options.current_filter ==
                    Filter.ARCHIVED_STARRED ||
                  filter_view_options.current_filter ==
                    Filter.ARCHIVED_STARRED_UNREAD,
                on_click: () => {
                  if (
                    bookmarks_slice_state.is_fetching_first_bookmarks ||
                    bookmarks_slice_state.is_fetching_more_bookmarks ||
                    counts.is_fetching_counts_data
                  )
                    return

                  let filter = Filter.NONE
                  if (filter_view_options.current_filter == Filter.NONE) {
                    filter = Filter.STARRED
                  } else if (
                    filter_view_options.current_filter == Filter.STARRED
                  ) {
                    filter = Filter.NONE
                  } else if (
                    filter_view_options.current_filter == Filter.STARRED_UNREAD
                  ) {
                    filter = Filter.UNREAD
                  } else if (
                    filter_view_options.current_filter ==
                    Filter.ARCHIVED_STARRED
                  ) {
                    filter = Filter.ARCHIVED
                  } else if (
                    filter_view_options.current_filter ==
                    Filter.ARCHIVED_STARRED_UNREAD
                  ) {
                    filter = Filter.ARCHIVED_UNREAD
                  } else if (
                    filter_view_options.current_filter == Filter.UNREAD
                  ) {
                    filter = Filter.STARRED_UNREAD
                  } else if (
                    filter_view_options.current_filter == Filter.ARCHIVED
                  ) {
                    filter = Filter.ARCHIVED_STARRED
                  } else if (
                    filter_view_options.current_filter == Filter.ARCHIVED_UNREAD
                  ) {
                    filter = Filter.ARCHIVED_STARRED_UNREAD
                  }
                  filter_view_options.set_filter_query_param(filter)
                },
              },
              ...(!username
                ? [
                    {
                      label: 'Unread',
                      is_toggled:
                        filter_view_options.current_filter == Filter.UNREAD ||
                        filter_view_options.current_filter ==
                          Filter.STARRED_UNREAD ||
                        filter_view_options.current_filter ==
                          Filter.ARCHIVED_UNREAD ||
                        filter_view_options.current_filter ==
                          Filter.ARCHIVED_STARRED_UNREAD,
                      on_click: () => {
                        if (
                          bookmarks_slice_state.is_fetching_first_bookmarks ||
                          bookmarks_slice_state.is_fetching_more_bookmarks ||
                          counts.is_fetching_counts_data
                        )
                          return

                        let filter = Filter.NONE
                        if (filter_view_options.current_filter == Filter.NONE) {
                          filter = Filter.UNREAD
                        } else if (
                          filter_view_options.current_filter == Filter.UNREAD
                        ) {
                          filter = Filter.NONE
                        } else if (
                          filter_view_options.current_filter ==
                          Filter.STARRED_UNREAD
                        ) {
                          filter = Filter.STARRED
                        } else if (
                          filter_view_options.current_filter ==
                          Filter.ARCHIVED_UNREAD
                        ) {
                          filter = Filter.ARCHIVED
                        } else if (
                          filter_view_options.current_filter ==
                          Filter.ARCHIVED_STARRED_UNREAD
                        ) {
                          filter = Filter.ARCHIVED_STARRED
                        } else if (
                          filter_view_options.current_filter == Filter.STARRED
                        ) {
                          filter = Filter.STARRED_UNREAD
                        } else if (
                          filter_view_options.current_filter == Filter.ARCHIVED
                        ) {
                          filter = Filter.ARCHIVED_UNREAD
                        } else if (
                          filter_view_options.current_filter ==
                          Filter.ARCHIVED_STARRED
                        ) {
                          filter = Filter.ARCHIVED_STARRED_UNREAD
                        }
                        filter_view_options.set_filter_query_param(filter)
                      },
                    },
                  ]
                : []),
              {
                label: 'Archived',
                is_toggled:
                  filter_view_options.current_filter == Filter.ARCHIVED ||
                  filter_view_options.current_filter ==
                    Filter.ARCHIVED_STARRED ||
                  filter_view_options.current_filter ==
                    Filter.ARCHIVED_UNREAD ||
                  filter_view_options.current_filter ==
                    Filter.ARCHIVED_STARRED_UNREAD,
                on_click: () => {
                  if (
                    bookmarks_slice_state.is_fetching_first_bookmarks ||
                    bookmarks_slice_state.is_fetching_more_bookmarks ||
                    counts.is_fetching_counts_data
                  )
                    return

                  let filter = Filter.NONE

                  if (filter_view_options.current_filter == Filter.NONE) {
                    filter = Filter.ARCHIVED
                  } else if (
                    filter_view_options.current_filter == Filter.STARRED
                  ) {
                    filter = Filter.ARCHIVED_STARRED
                  } else if (
                    filter_view_options.current_filter == Filter.UNREAD
                  ) {
                    filter = Filter.ARCHIVED_UNREAD
                  } else if (
                    filter_view_options.current_filter == Filter.STARRED_UNREAD
                  ) {
                    filter = Filter.ARCHIVED_STARRED_UNREAD
                  } else if (
                    filter_view_options.current_filter == Filter.ARCHIVED
                  ) {
                    filter = Filter.NONE
                  } else if (
                    filter_view_options.current_filter ==
                    Filter.ARCHIVED_STARRED
                  ) {
                    filter = Filter.STARRED
                  } else if (
                    filter_view_options.current_filter == Filter.ARCHIVED_UNREAD
                  ) {
                    filter = Filter.UNREAD
                  } else if (
                    filter_view_options.current_filter ==
                    Filter.ARCHIVED_STARRED_UNREAD
                  ) {
                    filter = Filter.STARRED_UNREAD
                  }

                  filter_view_options.set_filter_query_param(filter)
                },
              },
            ]}
            icon_buttons={[
              {
                icon_variant:
                  bookmarks_slice_state.density == 'default'
                    ? 'DENSITY_DEFAULT'
                    : 'DENSITY_COMPACT',
                on_click: () => {
                  if (bookmarks_slice_state.is_fetching_data) return
                  set_close_aside_count(close_aside_count + 1)
                  dispatch(
                    bookmarks_actions.set_density_of_current_bookmarks(
                      bookmarks_slice_state.density == 'default'
                        ? 'compact'
                        : 'default',
                    ),
                  )
                  window.scrollTo(0, 0)
                },
              },
              { icon_variant: 'THREE_DOTS', on_click: () => {} },
            ]}
          />
        }
        slot_tag_hierarchies={
          tag_hierarchies.is_initialized ? (
            <UiAppAtom_TagHierarchies
              is_draggable={!username}
              tree={tag_hierarchies.tree}
              on_update={async (tree) => {
                const filter = filter_view_options.current_filter

                const update_tag_hierarchies_params: UpdateTagHierarchies_Params =
                  {
                    tree,
                    gte: date_view_options.current_gte,
                    lte: date_view_options.current_lte,
                    starred_only:
                      filter == Filter.STARRED ||
                      filter == Filter.STARRED_UNREAD ||
                      filter == Filter.ARCHIVED_STARRED ||
                      filter == Filter.ARCHIVED_STARRED_UNREAD ||
                      undefined,
                    unread_only:
                      filter == Filter.UNREAD ||
                      filter == Filter.STARRED_UNREAD ||
                      filter == Filter.ARCHIVED_UNREAD ||
                      filter == Filter.ARCHIVED_STARRED_UNREAD ||
                      undefined,
                    is_archived:
                      filter == Filter.ARCHIVED ||
                      filter == Filter.ARCHIVED_STARRED ||
                      filter == Filter.ARCHIVED_UNREAD ||
                      filter == Filter.ARCHIVED_STARRED_UNREAD ||
                      undefined,
                  }

                await dispatch(
                  tag_hierarchies_actions.update_tag_hierarchies({
                    update_tag_hierarchies_params,
                    api_url: process.env.NEXT_PUBLIC_API_URL,
                    auth_token:
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                  }),
                )
                toast.success('Tag hierarchies has been updated')
              }}
              selected_tag_ids={tag_view_options.selected_tags}
              is_updating={tag_hierarchies.is_updating || false}
              on_item_click={(tag_ids) => {
                tag_view_options.set_many_tags_to_query_params({
                  tag_ids,
                })
                set_close_aside_count(close_aside_count + 1)
              }}
              dragged_tag={tag_view_options.dragged_tag}
              query_params={query_params.toString()}
              all_bookmarks_yields={tag_hierarchies.total}
              is_all_bookmarks_selected={!tag_view_options.selected_tags.length}
              on_click_all_bookmarks={() => {
                if (
                  bookmarks_slice_state.is_fetching_first_bookmarks ||
                  bookmarks_slice_state.is_updating_bookmarks
                )
                  return
                tag_view_options.clear_selected_tags()
                if (bookmarks_slice_state.showing_bookmarks_fetched_by_ids) {
                  search.reset()
                  if (filter_view_options.current_filter == Filter.NONE) {
                    bookmarks.get_bookmarks({})
                  }
                }
                set_close_aside_count(close_aside_count + 1)
              }}
              translations={{
                all_bookmarks: 'All bookmarks',
                drag_here:
                  'Organize  your tags by dragging & dropping - build a visual hierarchy!',
              }}
            />
          ) : (
            <UiAppAtom_TagHierarchiesSkeleton />
          )
        }
        slot_aside={
          <UiAppTemplate_LibraryAside
            feedback_label="Send feedback"
            on_feedback_click={() => {}}
            slot_sort_by={{
              button: is_hydrated ? (
                <UiAppAtom_ButtonSelect
                  label="Sort by"
                  current_value={_sort_by_option_to_label(
                    sort_by_view_options.current_sort_by,
                  )}
                  is_active={is_sort_by_dropdown_visible}
                  on_click={toggle_sort_by_dropdown}
                />
              ) : (
                <UiAppAtom_ButtonSelectSkeleton />
              ),
              is_dropdown_visible: is_sort_by_dropdown_visible,
              dropdown: is_hydrated && (
                <OutsideClickHandler
                  onOutsideClick={toggle_sort_by_dropdown}
                  disabled={!is_sort_by_dropdown_visible}
                >
                  <UiAppAtom_DropdownMenu
                    items={[
                      {
                        label: _sort_by_option_to_label(SortBy.CREATED_AT),
                        on_click: () => {
                          toggle_sort_by_dropdown()
                          if (
                            sort_by_view_options.current_sort_by ==
                              SortBy.CREATED_AT ||
                            bookmarks_slice_state.is_fetching_first_bookmarks ||
                            bookmarks_slice_state.is_fetching_more_bookmarks ||
                            counts.is_fetching_counts_data
                          )
                            return
                          sort_by_view_options.set_sort_by_query_param(
                            SortBy.CREATED_AT,
                          )
                        },
                        is_selected:
                          sort_by_view_options.current_sort_by ==
                          SortBy.CREATED_AT,
                      },
                      {
                        label: _sort_by_option_to_label(SortBy.UPDATED_AT),
                        on_click: () => {
                          toggle_sort_by_dropdown()
                          if (
                            sort_by_view_options.current_sort_by ==
                              SortBy.UPDATED_AT ||
                            bookmarks_slice_state.is_fetching_first_bookmarks ||
                            bookmarks_slice_state.is_fetching_more_bookmarks ||
                            counts.is_fetching_counts_data
                          )
                            return
                          sort_by_view_options.set_sort_by_query_param(
                            SortBy.UPDATED_AT,
                          )
                        },
                        is_selected:
                          sort_by_view_options.current_sort_by ==
                          SortBy.UPDATED_AT,
                      },
                      ...(!username
                        ? [
                            {
                              label: _sort_by_option_to_label(
                                SortBy.VISITED_AT,
                              ),
                              on_click: () => {
                                toggle_sort_by_dropdown()
                                if (
                                  sort_by_view_options.current_sort_by ==
                                    SortBy.VISITED_AT ||
                                  bookmarks_slice_state.is_fetching_first_bookmarks ||
                                  bookmarks_slice_state.is_fetching_more_bookmarks ||
                                  counts.is_fetching_counts_data
                                )
                                  return
                                sort_by_view_options.set_sort_by_query_param(
                                  SortBy.VISITED_AT,
                                )
                              },
                              is_selected:
                                sort_by_view_options.current_sort_by ==
                                SortBy.VISITED_AT,
                            },
                          ]
                        : []),
                    ]}
                  />
                </OutsideClickHandler>
              ),
            }}
            slot_order={{
              button: is_hydrated ? (
                <UiAppAtom_ButtonSelect
                  label="Order"
                  current_value={_order_option_to_label(
                    order_view_options.current_order,
                  )}
                  is_active={is_order_dropdown_visible}
                  on_click={toggle_order_dropdown}
                />
              ) : (
                <UiAppAtom_ButtonSelectSkeleton />
              ),
              is_dropdown_visible: is_order_dropdown_visible,
              dropdown: is_hydrated && (
                <OutsideClickHandler
                  onOutsideClick={toggle_order_dropdown}
                  disabled={!is_order_dropdown_visible}
                >
                  <UiAppAtom_DropdownMenu
                    items={[
                      {
                        label: _order_option_to_label(Order.DESC),
                        on_click: () => {
                          toggle_order_dropdown()
                          if (
                            order_view_options.current_order == Order.DESC ||
                            bookmarks_slice_state.is_fetching_first_bookmarks ||
                            bookmarks_slice_state.is_fetching_more_bookmarks ||
                            counts.is_fetching_counts_data
                          )
                            return
                          order_view_options.set_order_query_param(Order.DESC)
                        },

                        is_selected:
                          order_view_options.current_order == Order.DESC,
                      },
                      {
                        label: _order_option_to_label(Order.POPULARITY),
                        on_click: () => {
                          toggle_order_dropdown()
                          if (
                            order_view_options.current_order ==
                              Order.POPULARITY ||
                            bookmarks_slice_state.is_fetching_first_bookmarks ||
                            bookmarks_slice_state.is_fetching_more_bookmarks ||
                            counts.is_fetching_counts_data
                          )
                            return
                          order_view_options.set_order_query_param(
                            Order.POPULARITY,
                          )
                        },
                        is_selected:
                          order_view_options.current_order == Order.POPULARITY,
                      },
                      {
                        label: _order_option_to_label(Order.ASC),
                        on_click: () => {
                          toggle_order_dropdown()
                          if (
                            order_view_options.current_order == Order.ASC ||
                            bookmarks_slice_state.is_fetching_first_bookmarks ||
                            bookmarks_slice_state.is_fetching_more_bookmarks ||
                            counts.is_fetching_counts_data
                          )
                            return
                          order_view_options.set_order_query_param(Order.ASC)
                        },
                        is_selected:
                          order_view_options.current_order == Order.ASC,
                      },
                    ]}
                  />
                </OutsideClickHandler>
              ),
            }}
            slot_custom_range={
              show_custom_range ? (
                <div
                  style={{
                    pointerEvents:
                      bookmarks_slice_state.is_fetching_first_bookmarks ||
                      bookmarks_slice_state.is_fetching_more_bookmarks ||
                      counts.is_fetching_counts_data
                        ? 'none'
                        : 'all',
                  }}
                >
                  <CustomRange
                    counts={counts.months || undefined}
                    on_yyyymm_change={
                      date_view_options.set_gte_lte_query_params
                    }
                    clear_date_range={
                      date_view_options.clear_gte_lte_query_params
                    }
                    current_gte={
                      parseInt(query_params.get('gte') || '0') || undefined
                    }
                    current_lte={
                      parseInt(query_params.get('lte') || '0') || undefined
                    }
                    selected_tags={query_params.get('t') || undefined}
                    has_results={
                      bookmarks_slice_state.bookmarks &&
                      !bookmarks_slice_state.is_fetching_first_bookmarks
                        ? bookmarks_slice_state.bookmarks.length > 0
                        : undefined
                    }
                    is_fetching_data={
                      bookmarks_slice_state.is_fetching_first_bookmarks
                    }
                    is_fetching_counts_data={
                      counts_slice_state.is_fetching_counts_data
                    }
                    is_range_selector_disabled={
                      sort_by_view_options.current_sort_by ==
                        SortBy.UPDATED_AT ||
                      sort_by_view_options.current_sort_by == SortBy.VISITED_AT
                    }
                  />
                </div>
              ) : (
                <UiAppAtom_CustomRangeSkeleton />
              )
            }
            slot_tags={
              <>
                {!show_tags_skeleton ? (
                  <div
                    style={{
                      pointerEvents:
                        bookmarks_slice_state.is_fetching_first_bookmarks ||
                        bookmarks_slice_state.is_fetching_more_bookmarks ||
                        counts.is_fetching_counts_data
                          ? 'none'
                          : undefined,
                    }}
                  >
                    {(bookmarks_slice_state.is_fetching_first_bookmarks
                      ? counts.selected_tags.length > 0
                      : tag_view_options.selected_tags.length > 0) && (
                      <UiAppAtom_SelectedTags
                        selected_tags={(bookmarks_slice_state.is_fetching_first_bookmarks
                          ? counts.selected_tags
                          : tag_view_options.selected_tags
                        )
                          .filter((id) => {
                            if (
                              !bookmarks_slice_state.bookmarks ||
                              !bookmarks_slice_state.bookmarks[0]
                            )
                              return false
                            return (
                              bookmarks_slice_state.bookmarks[0].tags?.findIndex(
                                (tag) => tag.id == id,
                              ) != -1
                            )
                          })
                          .map((id) => {
                            const name =
                              bookmarks_slice_state.bookmarks![0].tags!.find(
                                (tag) => tag.id == id,
                              )!.name

                            return {
                              id,
                              name,
                            }
                          })}
                        on_selected_tag_click={(tag_id) =>
                          tag_view_options.remove_tags_from_query_params([
                            tag_id,
                          ])
                        }
                      />
                    )}
                    <UiAppAtom_Tags
                      tags={
                        counts.tags
                          ? Object.fromEntries(
                              Object.entries(counts.tags).filter((tag) =>
                                bookmarks_slice_state.is_fetching_first_bookmarks
                                  ? !counts.selected_tags.includes(tag[1].id)
                                  : !tag_view_options.selected_tags.includes(
                                      tag[1].id,
                                    ),
                              ),
                            )
                          : {}
                      }
                      on_click={tag_view_options.add_tag_to_query_params}
                      on_tag_drag_start={
                        !username ? tag_view_options.set_dragged_tag : undefined
                      }
                    />
                  </div>
                ) : (
                  <UiAppAtom_TagsSkeleton />
                )}
              </>
            }
          />
        }
        is_updating_bookmarks={bookmarks_slice_state.is_updating_bookmarks}
        is_fetching_first_bookmarks={
          bookmarks_slice_state.is_fetching_first_bookmarks
        }
        is_fetching_more_bookmarks={
          bookmarks_slice_state.is_fetching_more_bookmarks
        }
        has_more_bookmarks={
          (!search.search_string && bookmarks_slice_state.has_more_bookmarks) ||
          (search.search_string &&
            bookmarks_slice_state.bookmarks &&
            search.result !== undefined &&
            bookmarks_slice_state.bookmarks.length <
              search.result.hits.length) ||
          false
        }
        get_more_bookmarks={() => {
          if (search.hints || !bookmarks_slice_state.bookmarks?.length) return
          if (search.search_string) {
            search.get_bookmarks({ should_get_next_page: true })
          } else {
            bookmarks.get_bookmarks({ should_get_next_page: true })
          }
        }}
        slot_bookmarks={
          bookmarks_slice_state.bookmarks
            ? bookmarks_slice_state.bookmarks.map((bookmark, i) => (
                <UiAppAtom_Bookmark
                  bookmark_id={bookmark.id}
                  on_tag_drag_start={
                    !username ? tag_view_options.set_dragged_tag : undefined
                  }
                  key={bookmark.id}
                  density={bookmarks_slice_state.density}
                  is_compact={bookmark.is_compact}
                  updated_at={bookmark.updated_at}
                  is_public={bookmark.is_public}
                  points={bookmark.points}
                  on_give_point_click={() => {
                    points_hook.give_point({
                      bookmark_id: bookmark.id,
                    })
                  }}
                  title={bookmark.title}
                  note={bookmark.note}
                  on_click={() => {
                    if (bookmarks_slice_state.density == 'compact') {
                      if (
                        bookmark.is_compact ||
                        bookmark.is_compact === undefined
                      ) {
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
                  is_fetching_bookmarks={
                    bookmarks_slice_state.is_fetching_first_bookmarks
                  }
                  is_not_interactive={
                    search.is_initializing || are_bookmark_menu_items_locked
                  }
                  date={
                    !bookmarks_slice_state.is_fetching_first_bookmarks
                      ? sort_by_view_options.current_sort_by ==
                        SortBy.CREATED_AT
                        ? new Date(bookmark.created_at)
                        : sort_by_view_options.current_sort_by ==
                          SortBy.UPDATED_AT
                        ? new Date(bookmark.updated_at)
                        : sort_by_view_options.current_sort_by ==
                          SortBy.VISITED_AT
                        ? new Date(bookmark.visited_at)
                        : new Date(bookmark.created_at)
                      : sort_by_view_options.commited_sort_by ==
                        SortBy.CREATED_AT
                      ? new Date(bookmark.created_at)
                      : sort_by_view_options.commited_sort_by ==
                        SortBy.UPDATED_AT
                      ? new Date(bookmark.updated_at)
                      : sort_by_view_options.commited_sort_by ==
                        SortBy.VISITED_AT
                      ? new Date(bookmark.visited_at)
                      : new Date(bookmark.created_at)
                  }
                  counts_refreshed_at_timestamp={
                    counts_slice_state.refreshed_at_timestamp
                  }
                  links={bookmark.links.map((link) => ({
                    url: link.url,
                    saves: link.saves,
                    site_path: link.site_path,
                  }))}
                  number_of_selected_tags={
                    bookmarks_slice_state.is_fetching_first_bookmarks
                      ? counts.selected_tags.length
                      : tag_view_options.selected_tags.length
                  }
                  query_params={query_params.toString()}
                  tags={
                    bookmark.tags
                      ? bookmark.tags.map((tag) => {
                          const isSelected =
                            bookmarks_slice_state.is_fetching_first_bookmarks
                              ? counts.selected_tags.find((t) => t == tag.id) !=
                                undefined
                              : tag_view_options.selected_tags.find(
                                  (t) => t == tag.id,
                                ) !== undefined

                          return {
                            name: tag.name,
                            isSelected,
                            id: tag.id,
                            yields:
                              !isSelected &&
                              counts.tags &&
                              counts.tags[tag.name]
                                ? counts.tags[tag.name].yields
                                : undefined,
                          }
                        })
                      : []
                  }
                  is_unread={bookmark.is_unread}
                  stars={bookmark.stars}
                  on_tag_click={tag_view_options.add_tag_to_query_params}
                  on_selected_tag_click={(tag_id) =>
                    tag_view_options.remove_tags_from_query_params([tag_id])
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
                  on_link_click={() => {
                    if (username) return
                    const recent_visit: BrowserStorage.LocalStorage.AuthorizedLibrary.RecentVisit =
                      {
                        bookmark: {
                          id: bookmark.id,
                          created_at: bookmark.created_at,
                          visited_at: bookmark.visited_at,
                          updated_at: bookmark.updated_at,
                          title: bookmark.title,
                          note: bookmark.note,
                          is_archived: is_archived_filter,
                          is_unread: bookmark.is_unread,
                          stars: bookmark.stars,
                          links: bookmark.links.map((link) => ({
                            url: link.url,
                            site_path: link.site_path,
                            is_public: link.is_public,
                          })),
                          tags: bookmark.tags.map((tag) => tag.name),
                          tag_ids: bookmark.tags.map((tag) => tag.id),
                        },
                        visited_at: new Date().toISOString(),
                      }
                    localStorage.setItem(
                      browser_storage.local_storage.authorized_library
                        .recent_visit,
                      JSON.stringify(recent_visit),
                    )
                  }}
                  favicon_host={`${process.env.NEXT_PUBLIC_API_URL}/v1/favicons`}
                  on_menu_click={async () => {
                    if (username) return
                    set_are_bookmarks_menu_items_locked(true)
                    const is_cache_stale = await search.check_is_cache_stale({
                      api_url: process.env.NEXT_PUBLIC_API_URL,
                      auth_token:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                      is_archived: is_archived_filter,
                    })
                    if (
                      !is_cache_stale &&
                      (filter_view_options.current_filter != Filter.ARCHIVED
                        ? !search.db
                        : !search.archived_db)
                    ) {
                      await search.init({
                        is_archived: is_archived_filter,
                      })
                    } else if (is_cache_stale) {
                      await search.clear_cached_data({
                        is_archived: is_archived_filter,
                      })
                    }
                    set_are_bookmarks_menu_items_locked(false)
                  }}
                  // We pass dragged tag so on_mouse_up has access to current state (memoized component is refreshed).
                  dragged_tag={tag_view_options.dragged_tag}
                  on_mouse_up={async () => {
                    if (
                      !tag_view_options.dragged_tag ||
                      tag_view_options.dragged_tag.source_bookmark_id ==
                        bookmark.id
                    )
                      return
                    if (
                      bookmark.tags.length == system_values.bookmark.tags.limit
                    ) {
                      toast.error(
                        `Bookmark can have at most ${system_values.bookmark.tags.limit} tags`,
                      )
                      return
                    }
                    if (
                      bookmark.tags.findIndex(
                        (tag) => tag.id == tag_view_options.dragged_tag!.id,
                      ) != -1
                    ) {
                      return
                    }
                    const modified_bookmark: UpsertBookmark_Params = {
                      bookmark_id: bookmark.id,
                      is_public: bookmark.is_public,
                      created_at: new Date(bookmark.created_at),
                      title: bookmark.title,
                      note: bookmark.note,
                      is_archived: is_archived_filter,
                      is_unread: bookmark.is_unread,
                      stars: bookmark.stars,
                      links: bookmark.links.map((link) => ({
                        url: link.url,
                        site_path: link.site_path,
                        is_public: link.is_public,
                      })),
                      tags: [
                        ...bookmark.tags.map((tag) => ({
                          name: tag.name,
                          is_public: tag.is_public,
                        })),
                        {
                          name: tag_view_options.dragged_tag.name,
                          is_public: bookmark.is_public,
                        },
                      ],
                    }
                    const updated_bookmark = await dispatch(
                      bookmarks_actions.upsert_bookmark({
                        bookmark: modified_bookmark,
                        last_authorized_counts_params:
                          get_last_authorized_counts_params(),
                        api_url: process.env.NEXT_PUBLIC_API_URL,
                        auth_token:
                          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                      }),
                    )
                    await search.update_searchable_bookmark({
                      bookmark: {
                        id: bookmark.id,
                        created_at: bookmark.created_at,
                        visited_at: bookmark.visited_at,
                        updated_at: updated_bookmark.updated_at,
                        title: bookmark.title,
                        note: bookmark.note,
                        is_archived: is_archived_filter,
                        is_unread: bookmark.is_unread,
                        stars: bookmark.stars,
                        links: bookmark.links.map((link) => ({
                          url: link.url,
                          site_path: link.site_path,
                        })),
                        tags: updated_bookmark.tags.map((tag) => tag.name),
                        tag_ids: bookmark.tags.map((tag) => tag.id),
                      },
                    })
                    tag_hierarchies.get_tag_hierarchies({
                      filter: filter_view_options.current_filter,
                      gte: date_view_options.current_gte,
                      lte: date_view_options.current_lte,
                    })
                    toast.success('Bookmark has been updated')
                  }}
                  // Changes tag order by swapping them.
                  on_mouse_up_on_tag={async (tag_id) => {
                    if (
                      !tag_view_options.dragged_tag ||
                      tag_view_options.dragged_tag.source_bookmark_id !=
                        bookmark.id
                    )
                      return

                    const index_a = bookmark.tags.findIndex(
                      (tag) => tag.id == tag_id,
                    )
                    const index_b = bookmark.tags.findIndex(
                      (tag) => tag.id == tag_view_options.dragged_tag!.id,
                    )

                    if (index_a == index_b) return

                    const tags = [...bookmark.tags]

                    ;[tags[index_a], tags[index_b]] = [
                      tags[index_b],
                      tags[index_a],
                    ]

                    const modified_bookmark: UpsertBookmark_Params = {
                      bookmark_id: bookmark.id,
                      is_public: bookmark.is_public,
                      created_at: new Date(bookmark.created_at),
                      title: bookmark.title,
                      note: bookmark.note,
                      is_archived: is_archived_filter,
                      is_unread: bookmark.is_unread,
                      stars: bookmark.stars,
                      links: bookmark.links.map((link) => ({
                        url: link.url,
                        site_path: link.site_path,
                        is_public: link.is_public,
                      })),
                      tags: tags.map((tag) => ({
                        name: tag.name,
                        is_public: tag.is_public,
                      })),
                    }
                    const updated_bookmark = await dispatch(
                      bookmarks_actions.upsert_bookmark({
                        bookmark: modified_bookmark,
                        last_authorized_counts_params:
                          get_last_authorized_counts_params(),
                        api_url: process.env.NEXT_PUBLIC_API_URL,
                        auth_token:
                          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                      }),
                    )
                    await search.update_searchable_bookmark({
                      bookmark: {
                        id: bookmark.id,
                        created_at: bookmark.created_at,
                        visited_at: bookmark.visited_at,
                        updated_at: updated_bookmark.updated_at,
                        title: bookmark.title,
                        note: bookmark.note,
                        is_archived: is_archived_filter,
                        is_unread: bookmark.is_unread,
                        stars: bookmark.stars,
                        links: bookmark.links.map((link) => ({
                          url: link.url,
                          site_path: link.site_path,
                        })),
                        tags: updated_bookmark.tags.map((tag) => tag.name),
                        tag_ids: bookmark.tags.map((tag) => tag.id),
                      },
                    })
                    toast.success('Bookmark has been updated')
                  }}
                  on_tag_delete_click={async (tag_id) => {
                    const modified_bookmark: UpsertBookmark_Params = {
                      bookmark_id: bookmark.id,
                      is_public: bookmark.is_public,
                      created_at: new Date(bookmark.created_at),
                      title: bookmark.title,
                      note: bookmark.note,
                      is_archived: is_archived_filter,
                      is_unread: bookmark.is_unread,
                      stars: bookmark.stars,
                      links: bookmark.links.map((link) => ({
                        url: link.url,
                        site_path: link.site_path,
                        is_public: link.is_public,
                      })),
                      tags: bookmark.tags
                        .filter((tag) => tag.id !== tag_id)
                        .map((tag) => ({
                          name: tag.name,
                          is_public: tag.is_public,
                        })),
                    }
                    const updated_bookmark = await dispatch(
                      bookmarks_actions.upsert_bookmark({
                        bookmark: modified_bookmark,
                        last_authorized_counts_params:
                          get_last_authorized_counts_params(),
                        api_url: process.env.NEXT_PUBLIC_API_URL,
                        auth_token:
                          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                      }),
                    )
                    await search.update_searchable_bookmark({
                      bookmark: {
                        id: bookmark.id,
                        created_at: bookmark.created_at,
                        visited_at: bookmark.visited_at,
                        updated_at: updated_bookmark.updated_at,
                        title: bookmark.title,
                        note: bookmark.note,
                        is_archived: is_archived_filter,
                        is_unread: bookmark.is_unread,
                        stars: bookmark.stars,
                        links: bookmark.links.map((link) => ({
                          url: link.url,
                          site_path: link.site_path,
                        })),
                        tags: updated_bookmark.tags.map((tag) => tag.name),
                        tag_ids: bookmark.tags.map((tag) => tag.id),
                      },
                    })
                    const updated_tag_ids = updated_bookmark.tags.map(
                      (t) => t.id,
                    )
                    if (
                      !tag_view_options.selected_tags.every((t) =>
                        updated_tag_ids.includes(t),
                      )
                    ) {
                      // We filter out bookmark when there are other bookmarks still matching with selected tags.
                      dispatch(
                        bookmarks_actions.filter_out_bookmark({
                          bookmark_id: updated_bookmark.id,
                        }),
                      )
                      if (search.count) {
                        search.set_count(search.count - 1)
                      }
                    }
                    // Unselect removed tags when there is no more bookmarks with them.
                    tag_view_options.remove_tags_from_query_params(
                      tag_view_options.selected_tags.filter((t) => {
                        const yields = Object.values(
                          counts_slice_state.tags!,
                        ).find((tag) => tag.id == t)!.yields
                        return !updated_tag_ids.includes(t) && yields == 1
                      }),
                    )
                    tag_hierarchies.get_tag_hierarchies({
                      filter: filter_view_options.current_filter,
                      gte: date_view_options.current_gte,
                      lte: date_view_options.current_lte,
                    })
                    toast.success('Bookmark has been updated')
                  }}
                  menu_slot={
                    <UiAppAtom_DropdownMenu
                      items={[
                        ...(username
                          ? [
                              {
                                label: 'Copy to mine',
                                on_click: () => {},
                                other_icon: (
                                  <UiCommonParticles_Icon variant="COPY" />
                                ),
                              },
                            ]
                          : []),
                        ...(!username
                          ? [
                              {
                                label: 'Mark as unread',
                                is_checked: bookmark.is_unread,
                                is_disabled: are_bookmark_menu_items_locked,
                                on_click: async () => {
                                  const is_unread = !bookmark.is_unread
                                  const modified_bookmark: UpsertBookmark_Params =
                                    {
                                      bookmark_id: bookmark.id,
                                      is_public: bookmark.is_public,
                                      created_at: new Date(bookmark.created_at),
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread,
                                      stars: bookmark.stars,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                        is_public: link.is_public,
                                      })),
                                      tags: bookmark.tags.map((tag) => ({
                                        name: tag.name,
                                        is_public: tag.is_public,
                                      })),
                                    }
                                  const updated_bookmark = await dispatch(
                                    bookmarks_actions.upsert_bookmark({
                                      bookmark: modified_bookmark,
                                      last_authorized_counts_params:
                                        get_last_authorized_counts_params(),
                                      api_url: process.env.NEXT_PUBLIC_API_URL,
                                      auth_token:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                    }),
                                  )
                                  await search.update_searchable_bookmark({
                                    bookmark: {
                                      id: bookmark.id,
                                      created_at: bookmark.created_at,
                                      visited_at: bookmark.visited_at,
                                      updated_at: updated_bookmark.updated_at,
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread,
                                      stars: bookmark.stars,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                        is_public: link.is_public,
                                      })),
                                      tags: bookmark.tags.map(
                                        (tag) => tag.name,
                                      ),
                                      tag_ids: bookmark.tags.map(
                                        (tag) => tag.id,
                                      ),
                                    },
                                  })
                                  if (
                                    search.count &&
                                    (filter_view_options.current_filter ==
                                      Filter.UNREAD ||
                                      filter_view_options.current_filter ==
                                        Filter.STARRED_UNREAD ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED_UNREAD) &&
                                    bookmark.is_unread
                                  ) {
                                    search.set_count(search.count! - 1)
                                  }
                                  if (
                                    bookmarks_slice_state.bookmarks &&
                                    bookmarks_slice_state.bookmarks.length ==
                                      1 &&
                                    search.search_string.length
                                  ) {
                                    if (
                                      !is_unread &&
                                      (filter_view_options.current_filter ==
                                        Filter.UNREAD ||
                                        filter_view_options.current_filter ==
                                          Filter.STARRED_UNREAD)
                                    ) {
                                      search.reset()
                                    }
                                  }
                                  tag_hierarchies.get_tag_hierarchies({
                                    filter: filter_view_options.current_filter,
                                    gte: date_view_options.current_gte,
                                    lte: date_view_options.current_lte,
                                  })
                                  toast.success('Bookmark has been updated')
                                },
                              },
                              {
                                label: <UiAppAtom_StarsForDropdown stars={1} />,
                                is_checked: bookmark.stars == 1,
                                is_disabled: are_bookmark_menu_items_locked,
                                on_click: async () => {
                                  const modified_bookmark: UpsertBookmark_Params =
                                    {
                                      bookmark_id: bookmark.id,
                                      is_public: bookmark.is_public,
                                      created_at: new Date(bookmark.created_at),
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars == 1 ? 0 : 1,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                        is_public: link.is_public,
                                      })),
                                      tags: bookmark.tags.map((tag) => ({
                                        name: tag.name,
                                        is_public: tag.is_public,
                                      })),
                                    }
                                  const updated_bookmark = await dispatch(
                                    bookmarks_actions.upsert_bookmark({
                                      bookmark: modified_bookmark,
                                      last_authorized_counts_params:
                                        get_last_authorized_counts_params(),
                                      api_url: process.env.NEXT_PUBLIC_API_URL,
                                      auth_token:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                    }),
                                  )
                                  await search.update_searchable_bookmark({
                                    bookmark: {
                                      id: bookmark.id,
                                      created_at: bookmark.created_at,
                                      visited_at: bookmark.visited_at,
                                      updated_at: updated_bookmark.updated_at,
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars == 1 ? 0 : 1,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                        is_public: link.is_public,
                                      })),
                                      tags: bookmark.tags.map(
                                        (tag) => tag.name,
                                      ),
                                      tag_ids: bookmark.tags.map(
                                        (tag) => tag.id,
                                      ),
                                    },
                                  })
                                  if (
                                    search.count &&
                                    (filter_view_options.current_filter ==
                                      Filter.STARRED ||
                                      filter_view_options.current_filter ==
                                        Filter.STARRED_UNREAD ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED_UNREAD) &&
                                    bookmark.stars == 1
                                  ) {
                                    search.set_count(search.count - 1)
                                  }
                                  if (
                                    bookmarks_slice_state.bookmarks &&
                                    bookmarks_slice_state.bookmarks.length ==
                                      1 &&
                                    search.search_string.length
                                  ) {
                                    search.reset()
                                  }
                                  tag_hierarchies.get_tag_hierarchies({
                                    filter: filter_view_options.current_filter,
                                    gte: date_view_options.current_gte,
                                    lte: date_view_options.current_lte,
                                  })
                                  toast.success('Bookmark has been updated')
                                },
                              },
                              {
                                label: <UiAppAtom_StarsForDropdown stars={2} />,
                                is_checked: bookmark.stars == 2,
                                is_disabled: are_bookmark_menu_items_locked,
                                on_click: async () => {
                                  const modified_bookmark: UpsertBookmark_Params =
                                    {
                                      bookmark_id: bookmark.id,
                                      is_public: bookmark.is_public,
                                      created_at: new Date(bookmark.created_at),
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars == 2 ? 0 : 2,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                        is_public: link.is_public,
                                      })),
                                      tags: bookmark.tags.map((tag) => ({
                                        name: tag.name,
                                        is_public: tag.is_public,
                                      })),
                                    }
                                  const updated_bookmark = await dispatch(
                                    bookmarks_actions.upsert_bookmark({
                                      bookmark: modified_bookmark,
                                      last_authorized_counts_params:
                                        get_last_authorized_counts_params(),
                                      api_url: process.env.NEXT_PUBLIC_API_URL,
                                      auth_token:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                    }),
                                  )
                                  await search.update_searchable_bookmark({
                                    bookmark: {
                                      id: bookmark.id,
                                      created_at: bookmark.created_at,
                                      visited_at: bookmark.visited_at,
                                      updated_at: updated_bookmark.updated_at,
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars == 2 ? 0 : 2,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                      })),
                                      tags: bookmark.tags.map(
                                        (tag) => tag.name,
                                      ),
                                      tag_ids: bookmark.tags.map(
                                        (tag) => tag.id,
                                      ),
                                    },
                                  })
                                  if (
                                    search.count &&
                                    (filter_view_options.current_filter ==
                                      Filter.STARRED ||
                                      filter_view_options.current_filter ==
                                        Filter.STARRED_UNREAD ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED_UNREAD) &&
                                    bookmark.stars == 2
                                  ) {
                                    search.set_count(search.count - 1)
                                  }
                                  if (
                                    bookmarks_slice_state.bookmarks &&
                                    bookmarks_slice_state.bookmarks.length ==
                                      1 &&
                                    search.search_string.length
                                  ) {
                                    search.reset()
                                  }
                                  tag_hierarchies.get_tag_hierarchies({
                                    filter: filter_view_options.current_filter,
                                    gte: date_view_options.current_gte,
                                    lte: date_view_options.current_lte,
                                  })
                                  toast.success('Bookmark has been updated')
                                },
                              },
                              {
                                label: <UiAppAtom_StarsForDropdown stars={3} />,
                                is_checked: bookmark.stars == 3,
                                is_disabled: are_bookmark_menu_items_locked,
                                on_click: async () => {
                                  const modified_bookmark: UpsertBookmark_Params =
                                    {
                                      bookmark_id: bookmark.id,
                                      is_public: bookmark.is_public,
                                      created_at: new Date(bookmark.created_at),
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars == 3 ? 0 : 3,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                        is_public: link.is_public,
                                      })),
                                      tags: bookmark.tags.map((tag) => ({
                                        name: tag.name,
                                        is_public: tag.is_public,
                                      })),
                                    }
                                  const updated_bookmark = await dispatch(
                                    bookmarks_actions.upsert_bookmark({
                                      bookmark: modified_bookmark,
                                      last_authorized_counts_params:
                                        get_last_authorized_counts_params(),
                                      api_url: process.env.NEXT_PUBLIC_API_URL,
                                      auth_token:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                    }),
                                  )
                                  await search.update_searchable_bookmark({
                                    bookmark: {
                                      id: bookmark.id,
                                      created_at: bookmark.created_at,
                                      visited_at: bookmark.visited_at,
                                      updated_at: updated_bookmark.updated_at,
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars == 3 ? 0 : 3,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                      })),
                                      tags: bookmark.tags.map(
                                        (tag) => tag.name,
                                      ),
                                      tag_ids: bookmark.tags.map(
                                        (tag) => tag.id,
                                      ),
                                    },
                                  })
                                  if (
                                    search.count &&
                                    (filter_view_options.current_filter ==
                                      Filter.STARRED ||
                                      filter_view_options.current_filter ==
                                        Filter.STARRED_UNREAD ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED_UNREAD) &&
                                    bookmark.stars == 3
                                  ) {
                                    search.set_count(search.count - 1)
                                  }
                                  if (
                                    bookmarks_slice_state.bookmarks &&
                                    bookmarks_slice_state.bookmarks.length ==
                                      1 &&
                                    search.search_string.length
                                  ) {
                                    search.reset()
                                  }
                                  tag_hierarchies.get_tag_hierarchies({
                                    filter: filter_view_options.current_filter,
                                    gte: date_view_options.current_gte,
                                    lte: date_view_options.current_lte,
                                  })
                                  toast.success('Bookmark has been updated')
                                },
                              },
                              {
                                label: <UiAppAtom_StarsForDropdown stars={4} />,
                                is_checked: bookmark.stars == 4,
                                is_disabled: are_bookmark_menu_items_locked,
                                on_click: async () => {
                                  const modified_bookmark: UpsertBookmark_Params =
                                    {
                                      bookmark_id: bookmark.id,
                                      is_public: bookmark.is_public,
                                      created_at: new Date(bookmark.created_at),
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars == 4 ? 0 : 4,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                        is_public: link.is_public,
                                      })),
                                      tags: bookmark.tags.map((tag) => ({
                                        name: tag.name,
                                        is_public: tag.is_public,
                                      })),
                                    }
                                  const updated_bookmark = await dispatch(
                                    bookmarks_actions.upsert_bookmark({
                                      bookmark: modified_bookmark,
                                      last_authorized_counts_params:
                                        get_last_authorized_counts_params(),
                                      api_url: process.env.NEXT_PUBLIC_API_URL,
                                      auth_token:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                    }),
                                  )
                                  await search.update_searchable_bookmark({
                                    bookmark: {
                                      id: bookmark.id,
                                      created_at: bookmark.created_at,
                                      visited_at: bookmark.visited_at,
                                      updated_at: updated_bookmark.updated_at,
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars == 4 ? 0 : 4,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                      })),
                                      tags: bookmark.tags.map(
                                        (tag) => tag.name,
                                      ),
                                      tag_ids: bookmark.tags.map(
                                        (tag) => tag.id,
                                      ),
                                    },
                                  })
                                  if (
                                    search.count &&
                                    (filter_view_options.current_filter ==
                                      Filter.STARRED ||
                                      filter_view_options.current_filter ==
                                        Filter.STARRED_UNREAD ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED_UNREAD) &&
                                    bookmark.stars == 4
                                  ) {
                                    search.set_count(search.count - 1)
                                  }
                                  if (
                                    bookmarks_slice_state.bookmarks &&
                                    bookmarks_slice_state.bookmarks.length ==
                                      1 &&
                                    search.search_string.length
                                  ) {
                                    search.reset()
                                  }
                                  tag_hierarchies.get_tag_hierarchies({
                                    filter: filter_view_options.current_filter,
                                    gte: date_view_options.current_gte,
                                    lte: date_view_options.current_lte,
                                  })
                                  toast.success('Bookmark has been updated')
                                },
                              },
                              {
                                label: <UiAppAtom_StarsForDropdown stars={5} />,
                                is_checked: bookmark.stars == 5,
                                is_disabled: are_bookmark_menu_items_locked,
                                on_click: async () => {
                                  const modified_bookmark: UpsertBookmark_Params =
                                    {
                                      bookmark_id: bookmark.id,
                                      is_public: bookmark.is_public,
                                      created_at: new Date(bookmark.created_at),
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars == 5 ? 0 : 5,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                        is_public: link.is_public,
                                      })),
                                      tags: bookmark.tags.map((tag) => ({
                                        name: tag.name,
                                        is_public: tag.is_public,
                                      })),
                                    }
                                  const updated_bookmark = await dispatch(
                                    bookmarks_actions.upsert_bookmark({
                                      bookmark: modified_bookmark,
                                      last_authorized_counts_params:
                                        get_last_authorized_counts_params(),
                                      api_url: process.env.NEXT_PUBLIC_API_URL,
                                      auth_token:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                    }),
                                  )
                                  await search.update_searchable_bookmark({
                                    bookmark: {
                                      id: bookmark.id,
                                      created_at: bookmark.created_at,
                                      visited_at: bookmark.visited_at,
                                      updated_at: updated_bookmark.updated_at,
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars == 4 ? 0 : 4,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                      })),
                                      tags: bookmark.tags.map(
                                        (tag) => tag.name,
                                      ),
                                      tag_ids: bookmark.tags.map(
                                        (tag) => tag.id,
                                      ),
                                    },
                                  })
                                  if (
                                    search.count &&
                                    (filter_view_options.current_filter ==
                                      Filter.STARRED ||
                                      filter_view_options.current_filter ==
                                        Filter.STARRED_UNREAD ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED ||
                                      filter_view_options.current_filter ==
                                        Filter.ARCHIVED_STARRED_UNREAD) &&
                                    bookmark.stars == 5
                                  ) {
                                    search.set_count(search.count - 1)
                                  }
                                  if (
                                    bookmarks_slice_state.bookmarks &&
                                    bookmarks_slice_state.bookmarks.length ==
                                      1 &&
                                    search.search_string.length
                                  ) {
                                    search.reset()
                                  }
                                  tag_hierarchies.get_tag_hierarchies({
                                    filter: filter_view_options.current_filter,
                                    gte: date_view_options.current_gte,
                                    lte: date_view_options.current_lte,
                                  })
                                  toast.success('Bookmark has been updated')
                                },
                              },
                              {
                                label: 'Edit',
                                is_disabled: are_bookmark_menu_items_locked,
                                on_click: async () => {
                                  const updated_bookmark =
                                    await upsert_bookmark_modal({
                                      modal_context,
                                      bookmark,
                                      is_archived: is_archived_filter,
                                      auth_token:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                    })
                                  const updated_tag_ids =
                                    updated_bookmark.tags.map((t) => t.id)
                                  if (
                                    tag_view_options.selected_tags.every((t) =>
                                      updated_tag_ids.includes(t),
                                    )
                                  ) {
                                    dispatch(
                                      bookmarks_actions.set_incoming_bookmarks(
                                        bookmarks_slice_state.bookmarks!.map(
                                          (b) => {
                                            if (b.id == updated_bookmark.id) {
                                              return updated_bookmark
                                            } else {
                                              return b
                                            }
                                          },
                                        ),
                                      ),
                                    )
                                  } else {
                                    // We filter out bookmark when there are other bookmarks still matching with selected tags.
                                    dispatch(
                                      bookmarks_actions.filter_out_bookmark({
                                        bookmark_id: updated_bookmark.id,
                                      }),
                                    )
                                    if (search.count) {
                                      search.set_count(search.count - 1)
                                    }
                                  }
                                  // It's critically important to run [search.update_searchable_bookmark] before [counts_actions.refresh_authorized_counts]
                                  // otherwise updating bookmark from search will mess highlights. Bookmark is refreshed because of counts_refreshed_at_timestamp prop change.
                                  await search.update_searchable_bookmark({
                                    bookmark: {
                                      id: bookmark.id,
                                      is_archived: is_archived_filter,
                                      is_unread: updated_bookmark.is_unread,
                                      title: updated_bookmark.title,
                                      note: updated_bookmark.note,
                                      tags: updated_bookmark.tags.map(
                                        (tag) => tag.name,
                                      ),
                                      links: updated_bookmark.links.map(
                                        (link) => ({
                                          url: link.url,
                                          site_path: link.site_path,
                                        }),
                                      ),
                                      created_at: updated_bookmark.created_at,
                                      visited_at: bookmark.visited_at,
                                      updated_at: updated_bookmark.updated_at,

                                      stars: updated_bookmark.stars,
                                      tag_ids: updated_bookmark.tags.map(
                                        (tag) => tag.id,
                                      ),
                                    },
                                  })
                                  await dispatch(
                                    counts_actions.refresh_authorized_counts({
                                      last_authorized_counts_params:
                                        get_last_authorized_counts_params(),
                                      api_url: process.env.NEXT_PUBLIC_API_URL,
                                      auth_token:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                    }),
                                  )
                                  await tag_hierarchies.get_tag_hierarchies({
                                    filter: filter_view_options.current_filter,
                                    gte: date_view_options.current_gte,
                                    lte: date_view_options.current_lte,
                                  })

                                  modal_context?.set_modal()
                                  toast.success('Bookmark has beed updated')

                                  // Unselect removed tags when there is no more bookmarks with them.
                                  tag_view_options.remove_tags_from_query_params(
                                    tag_view_options.selected_tags.filter(
                                      (t) => {
                                        const yields = Object.values(
                                          counts_slice_state.tags!,
                                        ).find((tag) => tag.id == t)!.yields
                                        return (
                                          !updated_tag_ids.includes(t) &&
                                          yields == 1
                                        )
                                      },
                                    ),
                                  )
                                },
                                other_icon: (
                                  <UiCommonParticles_Icon variant="EDIT" />
                                ),
                              },
                              {
                                label: !(
                                  filter_view_options.current_filter ==
                                  Filter.ARCHIVED
                                )
                                  ? 'Archive'
                                  : 'Restore',
                                other_icon: (
                                  <UiCommonParticles_Icon variant="ARCHIVE" />
                                ),
                                is_disabled: are_bookmark_menu_items_locked,
                                on_click: async () => {
                                  const modified_bookmark: UpsertBookmark_Params =
                                    {
                                      bookmark_id: bookmark.id,
                                      is_public: bookmark.is_public,
                                      created_at: new Date(bookmark.created_at),
                                      title: bookmark.title,
                                      is_archived: !is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                        is_public: link.is_public,
                                      })),
                                      tags: bookmark.tags.map((tag) => ({
                                        name: tag.name,
                                        is_public: tag.is_public,
                                      })),
                                    }
                                  await dispatch(
                                    bookmarks_actions.upsert_bookmark({
                                      bookmark: modified_bookmark,
                                      last_authorized_counts_params:
                                        get_last_authorized_counts_params(),
                                      api_url: process.env.NEXT_PUBLIC_API_URL,
                                      auth_token:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                    }),
                                  )
                                  toast.success(
                                    `Bookmark has been ${
                                      is_archived_filter
                                        ? 'restored'
                                        : 'archived'
                                    }`,
                                  )
                                  tag_hierarchies.get_tag_hierarchies({
                                    filter: filter_view_options.current_filter,
                                    gte: date_view_options.current_gte,
                                    lte: date_view_options.current_lte,
                                  })
                                  if (search.count) {
                                    search.set_count(search.count - 1)
                                  }
                                  search.update_searchable_bookmark({
                                    bookmark: {
                                      id: bookmark.id,
                                      created_at: bookmark.created_at,
                                      visited_at: bookmark.visited_at,
                                      updated_at: new Date().toISOString(),
                                      title: bookmark.title,
                                      note: bookmark.note,
                                      is_archived: !is_archived_filter,
                                      is_unread: bookmark.is_unread,
                                      stars: bookmark.stars,
                                      links: bookmark.links.map((link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                        is_public: link.is_public,
                                      })),
                                      tags: bookmark.tags.map(
                                        (tag) => tag.name,
                                      ),
                                      tag_ids: bookmark.tags.map(
                                        (tag) => tag.id,
                                      ),
                                    },
                                  })
                                  if (
                                    bookmarks_slice_state.bookmarks &&
                                    bookmarks_slice_state.bookmarks.length ==
                                      1 &&
                                    bookmarks_slice_state.showing_bookmarks_fetched_by_ids
                                  ) {
                                    search.reset()
                                  }
                                },
                              },
                              {
                                label: 'Delete',
                                is_disabled: are_bookmark_menu_items_locked,
                                on_click: async () => {
                                  await dispatch(
                                    bookmarks_actions.delete_bookmark({
                                      last_authorized_counts_params:
                                        get_last_authorized_counts_params(),
                                      bookmark_id: bookmark.id,
                                      api_url: process.env.NEXT_PUBLIC_API_URL,
                                      auth_token:
                                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                    }),
                                  )
                                  if (search.count) {
                                    search.set_count(search.count - 1)
                                  }
                                  toast.success('Bookmark has been deleted')
                                  tag_hierarchies.get_tag_hierarchies({
                                    filter: filter_view_options.current_filter,
                                    gte: date_view_options.current_gte,
                                    lte: date_view_options.current_lte,
                                  })

                                  search.delete_searchable_bookmark({
                                    bookmark_id: bookmark.id,
                                  })
                                  if (
                                    bookmarks_slice_state.bookmarks &&
                                    bookmarks_slice_state.bookmarks.length ==
                                      1 &&
                                    bookmarks_slice_state.showing_bookmarks_fetched_by_ids
                                  ) {
                                    search.reset()
                                    bookmarks.get_bookmarks({})
                                  }
                                },
                                other_icon: (
                                  <UiCommonParticles_Icon variant="DELETE" />
                                ),
                              },
                            ]
                          : []),
                      ]}
                    />
                  }
                  highlights={search.highlights?.[bookmark.id.toString()]}
                  highlights_note={
                    search.highlights_note?.[bookmark.id.toString()]
                  }
                  highlights_site_variants={search.highlights_sites_variants}
                  orama_db_id={
                    is_archived_filter
                      ? search.archived_db?.id || ''
                      : search.db?.id || ''
                  }
                  should_dim_visited_links={username !== undefined}
                  // It's important to wait until filter is set to search hook's state
                  current_filter={search.current_filter}
                />
              ))
            : []
        }
        clear_selected_tags={
          !bookmarks_slice_state.is_fetching_first_bookmarks &&
          (!bookmarks_slice_state.bookmarks ||
            bookmarks_slice_state.bookmarks.length == 0) &&
          query_params.get('t')
            ? tag_view_options.clear_selected_tags
            : undefined
        }
        clear_date_range={
          !bookmarks_slice_state.is_fetching_first_bookmarks &&
          (!bookmarks_slice_state.bookmarks ||
            bookmarks_slice_state.bookmarks.length == 0) &&
          (query_params.get('gte') || query_params.get('lte'))
            ? date_view_options.clear_gte_lte_query_params
            : undefined
        }
        info_text={
          bookmarks_slice_state.is_fetching_first_bookmarks ||
          bookmarks_slice_state.is_fetching_more_bookmarks
            ? 'Loading...'
            : (!search.search_string.length &&
                !bookmarks_slice_state.is_fetching_first_bookmarks &&
                (!bookmarks_slice_state.bookmarks ||
                  bookmarks_slice_state.bookmarks.length == 0)) ||
              (search.search_string.length &&
                (!bookmarks_slice_state.bookmarks ||
                  bookmarks_slice_state.bookmarks.length == 0) &&
                search.result_commited?.count == 0)
            ? 'No results'
            : !bookmarks_slice_state.has_more_bookmarks ||
              bookmarks_slice_state.bookmarks?.length ==
                search.result_commited?.hits.length
            ? 'End of results'
            : ''
        }
      />
    </>
  )
}

export default BookmarksPage

function _sort_by_option_to_label(sort_by_option: SortBy): string {
  switch (sort_by_option) {
    case SortBy.CREATED_AT:
      return 'Date created'
    case SortBy.UPDATED_AT:
      return 'Date updated'
    case SortBy.VISITED_AT:
      return 'Last visited'
  }
}

function _order_option_to_label(order_option: Order): string {
  switch (order_option) {
    case Order.DESC:
      return 'Newest first'
    case Order.ASC:
      return 'Oldest first'
    case Order.POPULARITY:
      return 'Huggiest first'
  }
}

const get_last_authorized_counts_params = () => {
  return (
    JSON.parse(
      sessionStorage.getItem(
        browser_storage.session_storage.library.last_authorized_counts_params,
      ) || '',
    ) || undefined
  )
}
