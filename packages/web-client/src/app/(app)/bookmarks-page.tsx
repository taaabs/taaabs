'use client'

import useToggle from 'beautiful-react-hooks/useToggle'
import { use_library_dispatch, use_library_selector } from '@/stores/library'
import OutsideClickHandler from 'react-outside-click-handler'
import { Filter } from '@shared/types/common/filter'
import { Sortby } from '@shared/types/modules/bookmarks/sortby'
import { Order } from '@shared/types/modules/bookmarks/order'
import { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_filter_view_options } from '@/hooks/library/use-filter-view-options'
import { use_tag_view_options } from '@/hooks/library/use-tag-view-options'
import { use_date_view_options } from '@/hooks/library/use-date-view-options'
import { use_sortby_view_options } from '@/hooks/library/use-sortby-view-options'
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
import { useSearchParams } from 'next/navigation'
import { upsert_bookmark_modal } from '@/modals/upsert-bookmark-modal'
import { toast } from 'react-toastify'
import { CustomRangeSkeleton as UiAppAtom_CustomRangeSkeleton } from '@web-ui/components/app/atoms/custom-range-skeleton'
import { Library as UiAppTemplate_Library } from '@web-ui/components/app/templates/library'
import { LibrarySearch as UiAppAtom_LibrarySearch } from '@web-ui/components/app/atoms/library-search'
import { NavigationForLibrarySidebar as UiAppAtom_NavigationForLibrarySidebar } from '@web-ui/components/app/atoms/navigation-for-library-sidebar'
import { LibraryAside as UiAppTemplate_LibraryAside } from '@web-ui/components/app/templates/library-aside'
import { ButtonSelect as UiAppAtom_ButtonSelect } from '@web-ui/components/app/atoms/button-select'
import { ButtonSelectSkeleton as UiAppAtom_ButtonSelectSkeleton } from '@web-ui/components/app/atoms/button-select-skeleton'
import { DropdownMenu as UiAppAtom_DropdownMenu } from '@web-ui/components/app/atoms/dropdown-menu'
import { SelectedTags as UiAppAtom_SelectedTags } from '@web-ui/components/app/atoms/selected-tags'
import { Tags as UiAppAtom_Tags } from '@web-ui/components/app/atoms/tags'
import { TagsSkeleton as UiAppAtom_TagsSkeleton } from '@web-ui/components/app/atoms/tags-skeleton'
import { Bookmark as UiAppAtom_Bookmark } from '@web-ui/components/app/atoms/bookmark'
import { Icon as UiCommonParticles_Icon } from '@web-ui/components/common/particles/icon'
import { use_popstate } from '@web-ui/components/app/atoms/custom-range/hooks/use-popstate'
import { use_has_focus } from '@/hooks/misc/use-has-focus'

const CustomRange = dynamic(() => import('./dynamic-custom-range'), {
  ssr: false,
  loading: () => <UiAppAtom_CustomRangeSkeleton />,
})

const BookmarksPage: React.FC<{ user: 'authorized' | 'public' }> = (props) => {
  const is_hydrated = use_is_hydrated()
  use_session_storage_cleanup()
  const dispatch = use_library_dispatch()
  const query_params = useSearchParams()
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
  const filter_view_options = use_filter_view_options()
  const sortby_view_options = use_sortby_view_options()
  const order_view_options = use_order_view_options()
  const tag_view_options = use_tag_view_options()
  const date_view_options = use_date_view_options()
  const { pop_count } = use_popstate()

  const [is_filter_dropdown_visible, toggle_filter_dropdown] = useToggle(false)
  const [is_sortby_dropdown_visible, toggle_sortby_dropdown] = useToggle(false)
  const [is_order_dropdown_visible, toggle_order_dropdown] = useToggle(false)

  /** Upload deferred recent visit - START */
  const has_focus = use_has_focus()

  useUpdateEffect(() => {
    const recent_visit: BrowserStorage.LocalStorage.AuthorizedLibrary.RecentVisit | null =
      JSON.parse(
        localStorage.getItem(
          browser_storage.local_storage.authorized_library.recent_visit,
        ) || 'null',
      )
    if (recent_visit) {
      if (has_focus) {
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
  /** Upload deferred recent visit - END */

  useUpdateEffect(() => {
    if (bookmarks_slice_state.bookmarks == null) return
    set_show_custom_range(true)
    set_show_tags_skeleton(false)
    set_show_bookmarks_skeleton(false)
    modal_context?.set_modal()
    sortby_view_options.set_commited_sortby(sortby_view_options.current_sortby)
  }, [bookmarks_slice_state.bookmarks])

  useUpdateEffect(() => {
    search.reset()
  }, [
    filter_view_options.current_filter,
    order_view_options.current_order,
    sortby_view_options.current_sortby,
    tag_view_options.selected_tags,
    date_view_options.current_gte,
    date_view_options.current_lte,
  ])

  useUpdateEffect(() => {
    search.set_current_filter(filter_view_options.current_filter)
  }, [filter_view_options.current_filter])

  // Clear cache when user selects visited at sortby option.
  useUpdateEffect(() => {
    if (sortby_view_options.current_sortby == Sortby.VisitedAt) {
      search.clear_cached_data({
        is_archived: filter_view_options.current_filter == Filter.Archived,
      })
    }
  }, [filter_view_options.current_filter, sortby_view_options.current_sortby])

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

  useUpdateEffect(() => {
    if (bookmarks_slice_state.toast_message == 'archived') {
      toast.success('Bookmark has been archived')
    } else if (bookmarks_slice_state.toast_message == 'restored') {
      toast.success('Bookmark has been restored')
    } else if (bookmarks_slice_state.toast_message == 'deleted') {
      toast.success('Bookmark has been deleted')
    }
    dispatch(bookmarks_actions.set_toast_message())
  }, [bookmarks_slice_state.toast_message])

  // We don't refetch bookmarks on back/forward navigation, therefore we need
  // to clear "searching" state this way.
  useEffect(() => {
    const handleEvent = () => {
      dispatch(bookmarks_actions.set_showing_bookmarks_fetched_by_ids(false))
    }
    window.addEventListener('popstate', handleEvent)
    return () => window.removeEventListener('popstate', handleEvent)
  }, [])

  // Whenever a user updates a bookmark, we need to initialize cached search
  // to update its state.
  const initialize_cached_search = async () => {}

  useEffect(() => {
    initialize_cached_search()
  }, [filter_view_options.current_filter])

  return (
    <UiAppTemplate_Library
      show_bookmarks_skeleton={show_bookmarks_skeleton}
      mobile_title_bar={'All bookmarks'}
      slot_search={
        <UiAppAtom_LibrarySearch
          search_string={search.search_string}
          is_loading={search.is_initializing}
          loading_progress_percentage={search.indexed_bookmarks_percentage}
          placeholder={
            filter_view_options.current_filter == Filter.None &&
            !tag_view_options.selected_tags.length &&
            !query_params.get('gte') &&
            !query_params.get('lte')
              ? 'Search in all bookmarks'
              : filter_view_options.current_filter == Filter.Archived &&
                !tag_view_options.selected_tags.length &&
                !query_params.get('gte') &&
                !query_params.get('lte')
              ? 'Search in archived bookmarks'
              : 'Search here...'
          }
          hints={search.hints}
          on_click_hint={(i) => {
            if (search.hints) {
              const search_string =
                search.search_string + search.hints[i].completion
              search.set_search_string(search_string)
              search.query_db({ search_string })
            }
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
            if (search.is_caching_bookmarks) return

            search.set_is_search_focused(true)

            if (!search.is_initializing) {
              const is_cache_stale = await search.check_is_cache_stale({
                api_url: process.env.NEXT_PUBLIC_API_URL,
                auth_token:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                is_archived:
                  filter_view_options.current_filter == Filter.Archived,
              })

              if (
                (filter_view_options.current_filter != Filter.Archived
                  ? search.db === undefined
                  : search.archived_db === undefined) ||
                is_cache_stale
              ) {
                await search.init({
                  is_archived:
                    filter_view_options.current_filter == Filter.Archived,
                })
              } else {
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
            if (search.search_string) {
              search.query_db({ search_string: search.search_string })
            }
          }}
          on_blur={() => {
            search.clear_hints()
            search.set_is_search_focused(false)
          }}
          results_count={search.search_string ? search?.count : undefined}
          on_clear_click={() => {
            search.reset()
            bookmarks.get_bookmarks({})
          }}
          is_slash_shortcut_disabled={modal_context?.modal !== undefined}
        />
      }
      slot_sidebar={
        <UiAppAtom_NavigationForLibrarySidebar
          navigation_items={[
            {
              label: 'All bookmarks',
              on_click: () => {
                if (
                  bookmarks_slice_state.is_fetching_first_bookmarks ||
                  bookmarks_slice_state.is_updating_bookmarks
                )
                  return
                filter_view_options.set_filter_query_param_and_clear_others(
                  Filter.None,
                )
                if (bookmarks_slice_state.showing_bookmarks_fetched_by_ids) {
                  search.reset()
                  if (filter_view_options.current_filter == Filter.None) {
                    bookmarks.get_bookmarks({})
                  }
                }
              },
              is_active: true,
            },
          ]}
        />
      }
      slot_aside={
        <UiAppTemplate_LibraryAside
          slot_presets={<></>}
          slot_filter={{
            button: is_hydrated ? (
              <UiAppAtom_ButtonSelect
                label="Filter"
                current_value={_filter_option_to_label(
                  filter_view_options.current_filter,
                )}
                is_active={is_filter_dropdown_visible}
                on_click={toggle_filter_dropdown}
              />
            ) : (
              <UiAppAtom_ButtonSelectSkeleton />
            ),
            is_dropdown_visible: is_filter_dropdown_visible,
            dropdown: is_hydrated && (
              <OutsideClickHandler
                onOutsideClick={toggle_filter_dropdown}
                disabled={!is_filter_dropdown_visible}
              >
                <UiAppAtom_DropdownMenu
                  items={[
                    {
                      label: _filter_option_to_label(Filter.None),
                      on_click: () => {
                        toggle_filter_dropdown()
                        if (
                          filter_view_options.current_filter == Filter.None ||
                          bookmarks_slice_state.is_fetching_first_bookmarks ||
                          bookmarks_slice_state.is_fetching_more_bookmarks ||
                          counts.is_fetching_counts_data
                        )
                          return
                        filter_view_options.set_filter_query_param(Filter.None)
                      },
                      is_selected:
                        filter_view_options.current_filter == Filter.None,
                    },
                    {
                      label: _filter_option_to_label(Filter.Starred),
                      on_click: () => {
                        toggle_filter_dropdown()
                        if (
                          filter_view_options.current_filter ==
                            Filter.Starred ||
                          bookmarks_slice_state.is_fetching_first_bookmarks ||
                          bookmarks_slice_state.is_fetching_more_bookmarks ||
                          counts.is_fetching_counts_data
                        )
                          return
                        filter_view_options.set_filter_query_param(
                          Filter.Starred,
                        )
                      },
                      is_selected:
                        filter_view_options.current_filter == Filter.Starred,
                    },
                    ...(props.user == 'authorized'
                      ? [
                          {
                            label: _filter_option_to_label(Filter.Unread),
                            on_click: () => {
                              toggle_filter_dropdown()
                              if (
                                filter_view_options.current_filter ==
                                  Filter.Unread ||
                                bookmarks_slice_state.is_fetching_first_bookmarks ||
                                bookmarks_slice_state.is_fetching_more_bookmarks ||
                                counts.is_fetching_counts_data
                              )
                                return
                              filter_view_options.set_filter_query_param(
                                Filter.Unread,
                              )
                            },
                            is_disabled: true,
                            is_selected:
                              filter_view_options.current_filter ==
                              Filter.Unread,
                          },
                        ]
                      : []),
                    ...(props.user == 'authorized'
                      ? [
                          {
                            label: _filter_option_to_label(
                              Filter.StarredUnread,
                            ),
                            on_click: () => {
                              toggle_filter_dropdown()
                              if (
                                filter_view_options.current_filter ==
                                  Filter.StarredUnread ||
                                bookmarks_slice_state.is_fetching_first_bookmarks ||
                                bookmarks_slice_state.is_fetching_more_bookmarks ||
                                counts.is_fetching_counts_data
                              )
                                return
                              filter_view_options.set_filter_query_param(
                                Filter.StarredUnread,
                              )
                            },
                            is_selected:
                              filter_view_options.current_filter ==
                              Filter.StarredUnread,
                          },
                        ]
                      : []),
                    {
                      label: _filter_option_to_label(Filter.Archived),
                      on_click: () => {
                        toggle_filter_dropdown()
                        if (
                          filter_view_options.current_filter ==
                            Filter.Archived ||
                          bookmarks_slice_state.is_fetching_first_bookmarks ||
                          bookmarks_slice_state.is_fetching_more_bookmarks ||
                          counts.is_fetching_counts_data
                        )
                          return
                        filter_view_options.set_filter_query_param(
                          Filter.Archived,
                        )
                      },
                      is_selected:
                        filter_view_options.current_filter == Filter.Archived,
                    },
                    ...(props.user == 'authorized'
                      ? [
                          {
                            label: 'Public only',
                            on_click: () => {
                              // toggle_filter_dropdown()
                              // if (
                              //   filter_view_options.current_filter ==
                              //     Filter.StarredUnread ||
                              //   bookmarks_slice_state.is_fetching_first_bookmarks ||
                              //   bookmarks_slice_state.is_fetching_more_bookmarks ||
                              //   counts.is_fetching_counts_data
                              // )
                              //   return
                              // filter_view_options.set_filter_query_param(
                              //   Filter.StarredUnread,
                              // )
                            },
                            is_checked: false,
                          },
                        ]
                      : []),
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
          slot_sortby={{
            button: is_hydrated ? (
              <UiAppAtom_ButtonSelect
                label="Sort by"
                current_value={_sortby_option_to_label(
                  sortby_view_options.current_sortby,
                )}
                is_active={is_sortby_dropdown_visible}
                on_click={toggle_sortby_dropdown}
              />
            ) : (
              <UiAppAtom_ButtonSelectSkeleton />
            ),
            is_dropdown_visible: is_sortby_dropdown_visible,
            dropdown: is_hydrated && (
              <OutsideClickHandler
                onOutsideClick={toggle_sortby_dropdown}
                disabled={!is_sortby_dropdown_visible}
              >
                <UiAppAtom_DropdownMenu
                  items={[
                    {
                      label: _sortby_option_to_label(Sortby.CreatedAt),
                      on_click: () => {
                        toggle_sortby_dropdown()
                        if (
                          sortby_view_options.current_sortby ==
                            Sortby.CreatedAt ||
                          bookmarks_slice_state.is_fetching_first_bookmarks ||
                          bookmarks_slice_state.is_fetching_more_bookmarks ||
                          counts.is_fetching_counts_data
                        )
                          return
                        sortby_view_options.set_sortby_query_param(
                          Sortby.CreatedAt,
                        )
                      },
                      is_selected:
                        sortby_view_options.current_sortby == Sortby.CreatedAt,
                    },
                    {
                      label: _sortby_option_to_label(Sortby.UpdatedAt),
                      on_click: () => {
                        toggle_sortby_dropdown()
                        if (
                          sortby_view_options.current_sortby ==
                            Sortby.UpdatedAt ||
                          bookmarks_slice_state.is_fetching_first_bookmarks ||
                          bookmarks_slice_state.is_fetching_more_bookmarks ||
                          counts.is_fetching_counts_data
                        )
                          return
                        sortby_view_options.set_sortby_query_param(
                          Sortby.UpdatedAt,
                        )
                      },
                      is_selected:
                        sortby_view_options.current_sortby == Sortby.UpdatedAt,
                    },
                    ...(props.user == 'authorized'
                      ? [
                          {
                            label: _sortby_option_to_label(Sortby.VisitedAt),
                            on_click: () => {
                              toggle_sortby_dropdown()
                              if (
                                sortby_view_options.current_sortby ==
                                  Sortby.VisitedAt ||
                                bookmarks_slice_state.is_fetching_first_bookmarks ||
                                bookmarks_slice_state.is_fetching_more_bookmarks ||
                                counts.is_fetching_counts_data
                              )
                                return
                              sortby_view_options.set_sortby_query_param(
                                Sortby.VisitedAt,
                              )
                            },
                            is_selected:
                              sortby_view_options.current_sortby ==
                              Sortby.VisitedAt,
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
                      label: _order_option_to_label(Order.Desc),
                      on_click: () => {
                        toggle_order_dropdown()
                        if (
                          order_view_options.current_order == Order.Desc ||
                          bookmarks_slice_state.is_fetching_first_bookmarks ||
                          bookmarks_slice_state.is_fetching_more_bookmarks ||
                          counts.is_fetching_counts_data
                        )
                          return
                        order_view_options.set_order_query_param(Order.Desc)
                      },

                      is_selected:
                        order_view_options.current_order == Order.Desc,
                    },
                    {
                      label: _order_option_to_label(Order.Asc),
                      on_click: () => {
                        toggle_order_dropdown()
                        if (
                          order_view_options.current_order == Order.Asc ||
                          bookmarks_slice_state.is_fetching_first_bookmarks ||
                          bookmarks_slice_state.is_fetching_more_bookmarks ||
                          counts.is_fetching_counts_data
                        )
                          return
                        order_view_options.set_order_query_param(Order.Asc)
                      },
                      is_selected:
                        order_view_options.current_order == Order.Asc,
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
                  on_yyyymm_change={date_view_options.set_gte_lte_query_params}
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
                    sortby_view_options.current_sortby == Sortby.UpdatedAt ||
                    sortby_view_options.current_sortby == Sortby.VisitedAt
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
                      key={`${pop_count}${bookmarks_slice_state.is_fetching_first_bookmarks}`}
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
                        tag_view_options.remove_tags_from_query_params([tag_id])
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
          search.result.count > bookmarks_slice_state.bookmarks.length) ||
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
                key={bookmark.id}
                updated_at={bookmark.updated_at}
                title={bookmark.title}
                note={bookmark.note}
                on_click={() => {}}
                on_menu_click={async () => {
                  const is_cache_stale = await search.check_is_cache_stale({
                    api_url: process.env.NEXT_PUBLIC_API_URL,
                    auth_token:
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                    is_archived:
                      filter_view_options.current_filter == Filter.Archived,
                  })
                  if (!is_cache_stale) {
                    await toast.promise(
                      search.init({
                        is_archived:
                          filter_view_options.current_filter == Filter.Archived,
                      }),
                      {
                        pending: {
                          render() {
                            return 'One moment please...'
                          },
                          icon: false,
                        },
                      },
                    )
                  }
                }}
                is_fetching_bookmarks={
                  bookmarks_slice_state.is_fetching_first_bookmarks
                }
                is_not_interactive={search.is_initializing}
                date={
                  !bookmarks_slice_state.is_fetching_first_bookmarks
                    ? sortby_view_options.current_sortby == Sortby.CreatedAt
                      ? new Date(bookmark.created_at)
                      : sortby_view_options.current_sortby == Sortby.UpdatedAt
                      ? new Date(bookmark.updated_at)
                      : sortby_view_options.current_sortby == Sortby.VisitedAt
                      ? new Date(bookmark.visited_at)
                      : new Date(bookmark.created_at)
                    : sortby_view_options.commited_sortby == Sortby.CreatedAt
                    ? new Date(bookmark.created_at)
                    : sortby_view_options.commited_sortby == Sortby.UpdatedAt
                    ? new Date(bookmark.updated_at)
                    : sortby_view_options.commited_sortby == Sortby.VisitedAt
                    ? new Date(bookmark.visited_at)
                    : new Date(bookmark.created_at)
                }
                should_display_only_month={
                  bookmarks_slice_state.showing_bookmarks_fetched_by_ids
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
                            !isSelected && counts.tags && counts.tags[tag.name]
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
                  const recent_visit: BrowserStorage.LocalStorage.AuthorizedLibrary.RecentVisit =
                    {
                      bookmark: {
                        id: bookmark.id,
                        created_at: bookmark.created_at,
                        visited_at: bookmark.visited_at,
                        updated_at: bookmark.updated_at,
                        title: bookmark.title,
                        note: bookmark.note,
                        is_archived:
                          filter_view_options.current_filter == Filter.Archived,
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
                menu_slot={
                  <UiAppAtom_DropdownMenu
                    items={[
                      ...(props.user == 'public'
                        ? [
                            {
                              label: 'Copy to mine',
                              on_click: () => {},
                              other_icon: (
                                <UiCommonParticles_Icon variant="EDIT" />
                              ),
                            },
                          ]
                        : []),
                      ...(props.user == 'authorized'
                        ? [
                            {
                              label: 'Mark as Unread',
                              is_checked: bookmark.is_unread,
                              on_click: async () => {
                                const is_unread = !bookmark.is_unread
                                const modified_bookmark: UpsertBookmark_Params =
                                  {
                                    bookmark_id: bookmark.id,
                                    is_public: bookmark.is_public,
                                    created_at: new Date(bookmark.created_at),
                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
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
                                      JSON.parse(
                                        sessionStorage.getItem(
                                          browser_storage.session_storage
                                            .last_authorized_counts_params,
                                        ) || '',
                                      ) || undefined,
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
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
                                    is_unread,
                                    stars: bookmark.stars,
                                    links: bookmark.links.map((link) => ({
                                      url: link.url,
                                      site_path: link.site_path,
                                      is_public: link.is_public,
                                    })),
                                    tags: bookmark.tags.map((tag) => tag.name),
                                    tag_ids: bookmark.tags.map((tag) => tag.id),
                                  },
                                })
                                if (
                                  bookmarks_slice_state.bookmarks &&
                                  bookmarks_slice_state.bookmarks.length == 1 &&
                                  search.search_string.length
                                ) {
                                  if (
                                    !is_unread &&
                                    (filter_view_options.current_filter ==
                                      Filter.Unread ||
                                      filter_view_options.current_filter ==
                                        Filter.StarredUnread)
                                  ) {
                                    search.reset()
                                  }
                                }
                              },
                            },
                            {
                              label: 'One star',
                              is_checked: bookmark.stars == 1,
                              on_click: async () => {
                                const modified_bookmark: UpsertBookmark_Params =
                                  {
                                    bookmark_id: bookmark.id,
                                    is_public: bookmark.is_public,
                                    created_at: new Date(bookmark.created_at),
                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
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
                                      JSON.parse(
                                        sessionStorage.getItem(
                                          browser_storage.session_storage
                                            .last_authorized_counts_params,
                                        ) || '',
                                      ) || undefined,
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
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
                                    is_unread: bookmark.is_unread,
                                    stars: bookmark.stars == 1 ? 0 : 1,
                                    links: bookmark.links.map((link) => ({
                                      url: link.url,
                                      site_path: link.site_path,
                                      is_public: link.is_public,
                                    })),
                                    tags: bookmark.tags.map((tag) => tag.name),
                                    tag_ids: bookmark.tags.map((tag) => tag.id),
                                  },
                                })
                                if (
                                  bookmarks_slice_state.bookmarks &&
                                  bookmarks_slice_state.bookmarks.length == 1 &&
                                  search.search_string.length
                                ) {
                                  search.reset()
                                }
                              },
                            },
                            {
                              label: 'Two stars',
                              is_checked: bookmark.stars == 2,
                              on_click: async () => {
                                const modified_bookmark: UpsertBookmark_Params =
                                  {
                                    bookmark_id: bookmark.id,
                                    is_public: bookmark.is_public,
                                    created_at: new Date(bookmark.created_at),
                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
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
                                      JSON.parse(
                                        sessionStorage.getItem(
                                          browser_storage.session_storage
                                            .last_authorized_counts_params,
                                        ) || '',
                                      ) || undefined,
                                    api_url: process.env.NEXT_PUBLIC_API_URL,
                                    auth_token:
                                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                  }),
                                )
                                search.update_searchable_bookmark({
                                  bookmark: {
                                    id: bookmark.id,
                                    created_at: bookmark.created_at,
                                    visited_at: bookmark.visited_at,
                                    updated_at: updated_bookmark.updated_at,
                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
                                    is_unread: bookmark.is_unread,
                                    stars: bookmark.stars == 2 ? 0 : 2,
                                    links: bookmark.links.map((link) => ({
                                      url: link.url,
                                      site_path: link.site_path,
                                    })),
                                    tags: bookmark.tags.map((tag) => tag.name),
                                    tag_ids: bookmark.tags.map((tag) => tag.id),
                                  },
                                })
                                if (
                                  bookmarks_slice_state.bookmarks &&
                                  bookmarks_slice_state.bookmarks.length == 1 &&
                                  search.search_string.length
                                ) {
                                  search.reset()
                                }
                              },
                            },
                            {
                              label: 'Three stars',
                              is_checked: bookmark.stars == 3,
                              on_click: async () => {
                                const modified_bookmark: UpsertBookmark_Params =
                                  {
                                    bookmark_id: bookmark.id,
                                    is_public: bookmark.is_public,
                                    created_at: new Date(bookmark.created_at),
                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
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
                                      JSON.parse(
                                        sessionStorage.getItem(
                                          browser_storage.session_storage
                                            .last_authorized_counts_params,
                                        ) || '',
                                      ) || undefined,
                                    api_url: process.env.NEXT_PUBLIC_API_URL,
                                    auth_token:
                                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                  }),
                                )
                                search.update_searchable_bookmark({
                                  bookmark: {
                                    id: bookmark.id,
                                    created_at: bookmark.created_at,
                                    visited_at: bookmark.visited_at,
                                    updated_at: updated_bookmark.updated_at,
                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
                                    is_unread: bookmark.is_unread,
                                    stars: bookmark.stars == 3 ? 0 : 3,
                                    links: bookmark.links.map((link) => ({
                                      url: link.url,
                                      site_path: link.site_path,
                                    })),
                                    tags: bookmark.tags.map((tag) => tag.name),
                                    tag_ids: bookmark.tags.map((tag) => tag.id),
                                  },
                                })
                                if (
                                  bookmarks_slice_state.bookmarks &&
                                  bookmarks_slice_state.bookmarks.length == 1 &&
                                  search.search_string.length
                                ) {
                                  search.reset()
                                }
                              },
                            },
                            {
                              label: 'Four stars',
                              is_checked: bookmark.stars == 4,
                              on_click: async () => {
                                const modified_bookmark: UpsertBookmark_Params =
                                  {
                                    bookmark_id: bookmark.id,
                                    is_public: bookmark.is_public,
                                    created_at: new Date(bookmark.created_at),
                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
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
                                      JSON.parse(
                                        sessionStorage.getItem(
                                          browser_storage.session_storage
                                            .last_authorized_counts_params,
                                        ) || '',
                                      ) || undefined,
                                    api_url: process.env.NEXT_PUBLIC_API_URL,
                                    auth_token:
                                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                  }),
                                )
                                search.update_searchable_bookmark({
                                  bookmark: {
                                    id: bookmark.id,
                                    created_at: bookmark.created_at,
                                    visited_at: bookmark.visited_at,
                                    updated_at: updated_bookmark.updated_at,

                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
                                    is_unread: bookmark.is_unread,
                                    stars: bookmark.stars == 4 ? 0 : 4,
                                    links: bookmark.links.map((link) => ({
                                      url: link.url,
                                      site_path: link.site_path,
                                    })),
                                    tags: bookmark.tags.map((tag) => tag.name),
                                    tag_ids: bookmark.tags.map((tag) => tag.id),
                                  },
                                })
                                if (
                                  bookmarks_slice_state.bookmarks &&
                                  bookmarks_slice_state.bookmarks.length == 1 &&
                                  search.search_string.length
                                ) {
                                  search.reset()
                                }
                              },
                            },
                            {
                              label: 'Five stars',
                              is_checked: bookmark.stars == 5,
                              on_click: async () => {
                                const modified_bookmark: UpsertBookmark_Params =
                                  {
                                    bookmark_id: bookmark.id,
                                    is_public: bookmark.is_public,
                                    created_at: new Date(bookmark.created_at),
                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
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
                                      JSON.parse(
                                        sessionStorage.getItem(
                                          browser_storage.session_storage
                                            .last_authorized_counts_params,
                                        ) || '',
                                      ) || undefined,
                                    api_url: process.env.NEXT_PUBLIC_API_URL,
                                    auth_token:
                                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                  }),
                                )
                                search.update_searchable_bookmark({
                                  bookmark: {
                                    id: bookmark.id,
                                    created_at: bookmark.created_at,
                                    visited_at: bookmark.visited_at,
                                    updated_at: updated_bookmark.updated_at,

                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
                                    is_unread: bookmark.is_unread,
                                    stars: bookmark.stars == 4 ? 0 : 4,
                                    links: bookmark.links.map((link) => ({
                                      url: link.url,
                                      site_path: link.site_path,
                                    })),
                                    tags: bookmark.tags.map((tag) => tag.name),
                                    tag_ids: bookmark.tags.map((tag) => tag.id),
                                  },
                                })
                                if (
                                  bookmarks_slice_state.bookmarks &&
                                  bookmarks_slice_state.bookmarks.length == 1 &&
                                  search.search_string.length
                                ) {
                                  search.reset()
                                }
                              },
                            },
                            {
                              label: 'Edit',
                              on_click: async () => {
                                const updated_bookmark =
                                  await upsert_bookmark_modal({
                                    modal_context,
                                    bookmark,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
                                    auth_token:
                                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                  })
                                await search.update_searchable_bookmark({
                                  bookmark: {
                                    id: bookmark.id,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      Filter.Archived,
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
                                setTimeout(() => {
                                  const updated_tag_ids =
                                    updated_bookmark.tags.map((t) => t.id)
                                  if (
                                    tag_view_options.selected_tags.every((t) =>
                                      updated_tag_ids.includes(t),
                                    )
                                  ) {
                                    dispatch(
                                      bookmarks_actions.replace_bookmark({
                                        bookmark: updated_bookmark,
                                        last_authorized_counts_params:
                                          JSON.parse(
                                            sessionStorage.getItem(
                                              browser_storage.session_storage
                                                .last_authorized_counts_params,
                                            ) || '',
                                          ) || undefined,
                                        api_url:
                                          process.env.NEXT_PUBLIC_API_URL,
                                        auth_token:
                                          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                      }),
                                    )
                                  } else {
                                    // We filter out bookmark when there are other bookmarks still matching with selected tags.
                                    dispatch(
                                      bookmarks_actions.filter_out_bookmark({
                                        bookmark_id: updated_bookmark.id,
                                        last_authorized_counts_params:
                                          JSON.parse(
                                            sessionStorage.getItem(
                                              browser_storage.session_storage
                                                .last_authorized_counts_params,
                                            ) || '',
                                          ) || undefined,
                                        api_url:
                                          process.env.NEXT_PUBLIC_API_URL,
                                        auth_token:
                                          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                      }),
                                    )
                                  }

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
                                }, 0)
                              },
                              other_icon: (
                                <UiCommonParticles_Icon variant="EDIT" />
                              ),
                            },
                            {
                              label: !(
                                filter_view_options.current_filter ==
                                Filter.Archived
                              )
                                ? 'Archive'
                                : 'Restore',
                              other_icon: (
                                <UiCommonParticles_Icon variant="ARCHIVE" />
                              ),
                              on_click: () => {
                                const modified_bookmark: UpsertBookmark_Params =
                                  {
                                    bookmark_id: bookmark.id,
                                    is_public: bookmark.is_public,
                                    created_at: new Date(bookmark.created_at),
                                    title: bookmark.title,
                                    is_archived: !(
                                      filter_view_options.current_filter ==
                                      Filter.Archived
                                    ),
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
                                dispatch(
                                  bookmarks_actions.upsert_bookmark({
                                    bookmark: modified_bookmark,
                                    last_authorized_counts_params:
                                      JSON.parse(
                                        sessionStorage.getItem(
                                          browser_storage.session_storage
                                            .last_authorized_counts_params,
                                        ) || '',
                                      ) || undefined,
                                    api_url: process.env.NEXT_PUBLIC_API_URL,
                                    auth_token:
                                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                  }),
                                )
                                search.update_searchable_bookmark({
                                  bookmark: {
                                    id: bookmark.id,
                                    created_at: bookmark.created_at,
                                    visited_at: bookmark.visited_at,
                                    updated_at: new Date().toISOString(),
                                    title: bookmark.title,
                                    note: bookmark.note,
                                    is_archived: !(
                                      filter_view_options.current_filter ==
                                      Filter.Archived
                                    ),
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
                                })
                                if (search.count)
                                  search.set_count(search.count - 1)
                                if (
                                  bookmarks_slice_state.bookmarks &&
                                  bookmarks_slice_state.bookmarks.length == 1 &&
                                  search.search_string.length
                                ) {
                                  search.reset()
                                }
                              },
                            },
                            {
                              label: 'Delete',
                              on_click: () => {
                                dispatch(
                                  bookmarks_actions.delete_bookmark({
                                    last_authorized_counts_params:
                                      JSON.parse(
                                        sessionStorage.getItem(
                                          browser_storage.session_storage
                                            .last_authorized_counts_params,
                                        ) || '',
                                      ) || undefined,
                                    bookmark_id: bookmark.id,
                                    api_url: process.env.NEXT_PUBLIC_API_URL,
                                    auth_token:
                                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                  }),
                                )
                                search.delete_searchable_bookmark({
                                  bookmark_id: bookmark.id,
                                })
                                if (search.count)
                                  search.set_count(search.count - 1)
                                if (
                                  bookmarks_slice_state.bookmarks &&
                                  bookmarks_slice_state.bookmarks.length == 1 &&
                                  search.search_string.length
                                ) {
                                  search.reset()
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
                  filter_view_options.current_filter == Filter.Archived
                    ? search.archived_db?.id || ''
                    : search.db?.id || ''
                }
                is_serach_result={
                  bookmarks_slice_state.showing_bookmarks_fetched_by_ids ||
                  false
                }
                should_dim_visited_links={props.user == 'public'}
                // It's important to wait until filter is set to search hook's state
                current_filter={search.current_filter}
              />
            ))
          : []
      }
      refresh_results={
        !search.search_string.length &&
        !bookmarks_slice_state.is_fetching_first_bookmarks &&
        (!bookmarks_slice_state.bookmarks ||
          bookmarks_slice_state.bookmarks.length == 0)
          ? () => {
              bookmarks.get_bookmarks({})
            }
          : undefined
      }
      clear_unread={
        !bookmarks_slice_state.is_fetching_first_bookmarks &&
        (!bookmarks_slice_state.bookmarks ||
          bookmarks_slice_state.bookmarks.length == 0) &&
        (filter_view_options.current_filter == Filter.Unread ||
          filter_view_options.current_filter == Filter.StarredUnread)
          ? () => {
              filter_view_options.clear_unread()
            }
          : undefined
      }
      clear_selected_stars={
        !bookmarks_slice_state.is_fetching_first_bookmarks &&
        (!bookmarks_slice_state.bookmarks ||
          bookmarks_slice_state.bookmarks.length == 0) &&
        (filter_view_options.current_filter == Filter.Starred ||
          filter_view_options.current_filter == Filter.StarredUnread)
          ? () => {
              filter_view_options.clear_selected_stars()
            }
          : undefined
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
          : !search.search_string.length &&
            !bookmarks_slice_state.is_fetching_first_bookmarks &&
            (!bookmarks_slice_state.bookmarks ||
              bookmarks_slice_state.bookmarks.length == 0)
          ? 'No results'
          : !bookmarks_slice_state.has_more_bookmarks ||
            bookmarks_slice_state.bookmarks?.length ==
              search.result?.hits.length
          ? 'End of results'
          : ''
      }
    />
  )
}

export default BookmarksPage

function _filter_option_to_label(filter_option: Filter): string {
  switch (filter_option) {
    case Filter.None:
      return 'None'
    case Filter.Starred:
      return 'Starred'
    case Filter.Unread:
      return 'Unread'
    case Filter.StarredUnread:
      return 'Starred & Unread'
    case Filter.Archived:
      return 'Archived'
  }
}

function _sortby_option_to_label(sortby_option: Sortby): string {
  switch (sortby_option) {
    case Sortby.CreatedAt:
      return 'Date created'
    case Sortby.UpdatedAt:
      return 'Date updated'
    case Sortby.VisitedAt:
      return 'Last visited'
  }
}

function _order_option_to_label(order_option: Order): string {
  switch (order_option) {
    case Order.Desc:
      return 'Newest first'
    case Order.Asc:
      return 'Oldest first'
  }
}
