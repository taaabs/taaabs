'use client'

import { NavigationForLibrarySidebar } from '@web-ui/components/app/atoms/navigation-for-library-sidebar'
import { Bookmark } from '@web-ui/components/app/atoms/bookmark'
import { Library } from '@web-ui/components/app/templates/library'
import useToggle from 'beautiful-react-hooks/useToggle'
import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { LibraryAside } from '@web-ui/components/app/templates/library-aside'
import { ButtonSelect } from '@web-ui/components/app/atoms/button-select'
import { DropdownMenu } from '@web-ui/components/app/atoms/dropdown-menu'
import OutsideClickHandler from 'react-outside-click-handler'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { Sortby } from '@shared/types/modules/bookmarks/sortby'
import { Order } from '@shared/types/modules/bookmarks/order'
import { Tags } from '@web-ui/components/app/atoms/tags'
import { SelectedTags } from '@web-ui/components/app/atoms/selected-tags'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { CustomRangeSkeleton } from '@web-ui/components/app/atoms/custom-range-skeleton'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { TagsSkeleton } from '@web-ui/components/app/atoms/tags-skeleton'
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
import { Icon } from '@web-ui/components/common/particles/icon'
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { browser_storage } from '@/constants/browser-storage'
import { use_is_hydrated } from '@shared/hooks'
import { ButtonSelectSkeleton } from '@web-ui/components/app/atoms/button-select-skeleton'
import { UnreadStarsFilter } from '@web-ui/components/app/atoms/unread-stars-filter'
import { LibrarySearch } from '@web-ui/components/app/atoms/library-search'
import { use_search } from '@/hooks/library/use-search'
import { ModalContext } from './modal-provider'
import { upsert_bookmark_modal } from '@/modals'

const CustomRange = dynamic(() => import('./dynamic-custom-range'), {
  ssr: false,
  loading: () => <CustomRangeSkeleton />,
})

const BookmarksPage: React.FC<{ user: 'authorized' | 'public' }> = (props) => {
  const is_hydrated = use_is_hydrated()
  use_session_storage_cleanup()
  const dispatch = use_library_dispatch()
  const query_params = use_shallow_search_params()
  const modal_context = useContext(ModalContext)
  const [show_custom_range, set_show_custom_range] = useState(false)
  const [show_tags_skeleton, set_show_tags_skeleton] = useState(true)
  const [show_bookmarks_skeleton, set_show_bookmarks_skeleton] = useState(true)
  const bookmarks_slice_state = use_library_selector((state) => state.bookmarks)
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

  const [is_sortby_dropdown_visible, toggle_sortby_dropdown] = useToggle(false)
  const [is_order_dropdown_visible, toggle_order_dropdown] = useToggle(false)

  const handle_link_click = async (params: {
    booomark_id: number
  }): Promise<Date> => {
    const data_source = new Bookmarks_DataSourceImpl(
      process.env.NEXT_PUBLIC_API_URL,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
    )
    const repository = new Bookmarks_RepositoryImpl(data_source)
    const record_visit = new RecordVisit_UseCase(repository)
    const { visited_at } = await record_visit.invoke({
      bookmark_id: params.booomark_id,
    })
    return visited_at
  }

  useUpdateEffect(() => {
    if (bookmarks_slice_state.bookmarks == null) return
    set_show_custom_range(true)
    set_show_tags_skeleton(false)
    set_show_bookmarks_skeleton(false)
    modal_context?.set_modal()
  }, [bookmarks_slice_state.bookmarks])

  useUpdateEffect(() => {
    search.reset()
  }, [
    filter_view_options.current_filter,
    order_view_options.current_order,
    sortby_view_options.current_sortby,
    tag_view_options.actual_selected_tags,
    date_view_options.current_gte,
    date_view_options.current_lte,
  ])

  useUpdateEffect(() => {
    if (search.db && search.is_search_focused) {
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
      search.get_hints()
    }
  }, [search.db])

  useEffect(() => {
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = 'auto'
    }
  }, [])

  return (
    <Library
      show_bookmarks_skeleton={show_bookmarks_skeleton}
      mobile_title_bar={
        filter_view_options.current_filter == LibraryFilter.All
          ? 'All bookmarks'
          : filter_view_options.current_filter == LibraryFilter.Archived
          ? 'Archived'
          : 'All bookmarks'
      }
      slot_search={
        <LibrarySearch
          search_string={search.search_string}
          is_loading={search.is_initializing}
          loading_progress_percentage={search.indexed_bookmarks_percentage}
          placeholder={
            filter_view_options.current_filter == LibraryFilter.All &&
            !tag_view_options.actual_selected_tags.length &&
            !query_params.get('gte') &&
            !query_params.get('lte')
              ? 'Search in all bookmarks'
              : filter_view_options.current_filter == LibraryFilter.Archived &&
                !tag_view_options.actual_selected_tags.length &&
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
            search.set_is_search_focused(true)
            if (!search.is_initializing) {
              let is_cache_stale: boolean | undefined
              if (!search.is_caching_data) {
                is_cache_stale = await search.check_is_cache_stale({
                  api_url: process.env.NEXT_PUBLIC_API_URL,
                  auth_token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                })
              }

              if (search.db === undefined || is_cache_stale) {
                search.init()
              } else {
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
        <NavigationForLibrarySidebar
          navigation_items={[
            {
              label: 'All bookmarks',
              on_click: () => {
                if (
                  bookmarks_slice_state.is_fetching_first_bookmarks ||
                  bookmarks_slice_state.is_updating_bookmarks
                )
                  return
                filter_view_options.set_filter_query_param(LibraryFilter.All)
              },
              is_active:
                filter_view_options.current_filter != LibraryFilter.Archived,
            },
            {
              label: 'Archived',
              on_click: () => {
                if (
                  bookmarks_slice_state.is_fetching_first_bookmarks ||
                  bookmarks_slice_state.is_updating_bookmarks
                )
                  return
                filter_view_options.set_filter_query_param(
                  LibraryFilter.Archived,
                )
              },
              is_active:
                filter_view_options.current_filter == LibraryFilter.Archived,
            },
          ]}
        />
      }
      slot_aside={
        <LibraryAside
          slot_filter={
            is_hydrated &&
            filter_view_options.current_filter != LibraryFilter.Archived && (
              <UnreadStarsFilter
                is_unread_selected={
                  filter_view_options.current_filter == LibraryFilter.Unread ||
                  filter_view_options.current_filter ==
                    LibraryFilter.OneStarUnread ||
                  filter_view_options.current_filter ==
                    LibraryFilter.TwoStarsUnread ||
                  filter_view_options.current_filter ==
                    LibraryFilter.ThreeStarsUnread
                }
                unread_click_handler={() => {
                  if (
                    bookmarks_slice_state.is_fetching_first_bookmarks ||
                    bookmarks_slice_state.is_updating_bookmarks
                  )
                    return

                  if (
                    filter_view_options.current_filter == LibraryFilter.Unread
                  ) {
                    filter_view_options.set_filter_query_param(
                      LibraryFilter.All,
                    )
                  } else if (
                    filter_view_options.current_filter == LibraryFilter.All
                  ) {
                    filter_view_options.set_filter_query_param(
                      LibraryFilter.Unread,
                    )
                  } else if (
                    filter_view_options.current_filter ==
                    LibraryFilter.OneStarUnread
                  ) {
                    filter_view_options.set_filter_query_param(
                      LibraryFilter.OneStar,
                    )
                  } else if (
                    filter_view_options.current_filter ==
                    LibraryFilter.TwoStarsUnread
                  ) {
                    filter_view_options.set_filter_query_param(
                      LibraryFilter.TwoStars,
                    )
                  } else if (
                    filter_view_options.current_filter ==
                    LibraryFilter.ThreeStarsUnread
                  ) {
                    filter_view_options.set_filter_query_param(
                      LibraryFilter.ThreeStars,
                    )
                  } else if (
                    filter_view_options.current_filter == LibraryFilter.OneStar
                  ) {
                    filter_view_options.set_filter_query_param(
                      LibraryFilter.OneStarUnread,
                    )
                  } else if (
                    filter_view_options.current_filter == LibraryFilter.TwoStars
                  ) {
                    filter_view_options.set_filter_query_param(
                      LibraryFilter.TwoStarsUnread,
                    )
                  } else if (
                    filter_view_options.current_filter ==
                    LibraryFilter.ThreeStars
                  ) {
                    filter_view_options.set_filter_query_param(
                      LibraryFilter.ThreeStarsUnread,
                    )
                  }
                }}
                selected_stars={
                  filter_view_options.current_filter == LibraryFilter.OneStar ||
                  filter_view_options.current_filter ==
                    LibraryFilter.OneStarUnread
                    ? 1
                    : filter_view_options.current_filter ==
                        LibraryFilter.TwoStars ||
                      filter_view_options.current_filter ==
                        LibraryFilter.TwoStarsUnread
                    ? 2
                    : filter_view_options.current_filter ==
                        LibraryFilter.ThreeStars ||
                      filter_view_options.current_filter ==
                        LibraryFilter.ThreeStarsUnread
                    ? 3
                    : 0
                }
                stars_click_handler={(selected_stars) => {
                  if (
                    bookmarks_slice_state.is_fetching_first_bookmarks ||
                    bookmarks_slice_state.is_updating_bookmarks
                  )
                    return

                  if (selected_stars == 1) {
                    if (
                      filter_view_options.current_filter ==
                        LibraryFilter.Unread ||
                      filter_view_options.current_filter ==
                        LibraryFilter.TwoStarsUnread ||
                      filter_view_options.current_filter ==
                        LibraryFilter.ThreeStarsUnread
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.OneStarUnread,
                      )
                    } else if (
                      filter_view_options.current_filter ==
                      LibraryFilter.OneStar
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.All,
                      )
                    } else if (
                      filter_view_options.current_filter ==
                      LibraryFilter.OneStarUnread
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.Unread,
                      )
                    } else if (
                      filter_view_options.current_filter == LibraryFilter.All ||
                      filter_view_options.current_filter ==
                        LibraryFilter.TwoStars ||
                      filter_view_options.current_filter ==
                        LibraryFilter.ThreeStars
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.OneStar,
                      )
                    }
                  } else if (selected_stars == 2) {
                    if (
                      filter_view_options.current_filter ==
                        LibraryFilter.Unread ||
                      filter_view_options.current_filter ==
                        LibraryFilter.OneStarUnread ||
                      filter_view_options.current_filter ==
                        LibraryFilter.ThreeStarsUnread
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.TwoStarsUnread,
                      )
                    } else if (
                      filter_view_options.current_filter ==
                      LibraryFilter.TwoStars
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.All,
                      )
                    } else if (
                      filter_view_options.current_filter ==
                      LibraryFilter.TwoStarsUnread
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.Unread,
                      )
                    } else if (
                      filter_view_options.current_filter == LibraryFilter.All ||
                      filter_view_options.current_filter ==
                        LibraryFilter.OneStar ||
                      filter_view_options.current_filter ==
                        LibraryFilter.ThreeStars
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.TwoStars,
                      )
                    }
                  } else if (selected_stars == 3) {
                    if (
                      filter_view_options.current_filter ==
                        LibraryFilter.Unread ||
                      filter_view_options.current_filter ==
                        LibraryFilter.OneStarUnread ||
                      filter_view_options.current_filter ==
                        LibraryFilter.TwoStarsUnread
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.ThreeStarsUnread,
                      )
                    } else if (
                      filter_view_options.current_filter ==
                      LibraryFilter.ThreeStars
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.All,
                      )
                    } else if (
                      filter_view_options.current_filter ==
                      LibraryFilter.ThreeStarsUnread
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.Unread,
                      )
                    } else if (
                      filter_view_options.current_filter == LibraryFilter.All ||
                      filter_view_options.current_filter ==
                        LibraryFilter.OneStar ||
                      filter_view_options.current_filter ==
                        LibraryFilter.TwoStars
                    ) {
                      filter_view_options.set_filter_query_param(
                        LibraryFilter.ThreeStars,
                      )
                    }
                  }
                }}
              />
            )
          }
          slot_sortby={{
            button: is_hydrated ? (
              <ButtonSelect
                label="Sort by"
                current_value={_sortby_option_to_label(
                  sortby_view_options.current_sortby,
                )}
                is_active={is_sortby_dropdown_visible}
                on_click={toggle_sortby_dropdown}
              />
            ) : (
              <ButtonSelectSkeleton />
            ),
            is_dropdown_visible: is_sortby_dropdown_visible,
            dropdown: is_hydrated && (
              <OutsideClickHandler
                onOutsideClick={toggle_sortby_dropdown}
                disabled={!is_sortby_dropdown_visible}
              >
                <DropdownMenu
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
                        sortby_view_options.current_sortby == Sortby.VisitedAt,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
          slot_order={{
            button: is_hydrated ? (
              <ButtonSelect
                label="Order"
                current_value={_order_option_to_label(
                  order_view_options.current_order,
                )}
                is_active={is_order_dropdown_visible}
                on_click={toggle_order_dropdown}
              />
            ) : (
              <ButtonSelectSkeleton />
            ),
            is_dropdown_visible: is_order_dropdown_visible,
            dropdown: is_hydrated && (
              <OutsideClickHandler
                onOutsideClick={toggle_order_dropdown}
                disabled={!is_order_dropdown_visible}
              >
                <DropdownMenu
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
                    !counts.is_fetching_counts_data
                      ? bookmarks_slice_state.bookmarks.length > 0
                      : undefined
                  }
                  is_fetching_data={
                    bookmarks_slice_state.is_fetching_first_bookmarks
                  }
                  is_range_selector_disabled={
                    sortby_view_options.current_sortby == Sortby.UpdatedAt ||
                    sortby_view_options.current_sortby == Sortby.VisitedAt
                  }
                />
              </div>
            ) : (
              <CustomRangeSkeleton />
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
                    : tag_view_options.actual_selected_tags.length > 0) && (
                    <SelectedTags
                      selected_tags={(bookmarks_slice_state.is_fetching_first_bookmarks
                        ? counts.selected_tags
                        : tag_view_options.actual_selected_tags
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
                      on_selected_tag_click={
                        tag_view_options.remove_tag_from_query_params
                      }
                    />
                  )}
                  <Tags
                    tags={
                      counts.tags
                        ? Object.fromEntries(
                            Object.entries(counts.tags).filter((tag) =>
                              bookmarks_slice_state.is_fetching_first_bookmarks
                                ? !counts.selected_tags.includes(tag[1].id)
                                : !tag_view_options.actual_selected_tags.includes(
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
                <TagsSkeleton />
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
              <Bookmark
                key={bookmark.id}
                updated_at={bookmark.updated_at}
                title={bookmark.title}
                on_click={() => {}}
                on_menu_click={() => {}}
                date={
                  sortby_view_options.current_sortby == Sortby.CreatedAt
                    ? new Date(bookmark.created_at)
                    : sortby_view_options.current_sortby == Sortby.UpdatedAt
                    ? new Date(bookmark.updated_at)
                    : sortby_view_options.current_sortby == Sortby.VisitedAt
                    ? new Date(bookmark.visited_at)
                    : new Date(bookmark.created_at)
                }
                should_display_only_month={search.result !== undefined}
                links={bookmark.links.map((link) => ({
                  url: link.url,
                  saves: link.saves,
                  site_path: link.site_path,
                }))}
                number_of_selected_tags={
                  bookmarks_slice_state.is_fetching_first_bookmarks
                    ? counts.selected_tags.length
                    : tag_view_options.actual_selected_tags.length
                }
                query_params={query_params.toString()}
                tags={
                  bookmark.tags
                    ? bookmark.tags.map((tag) => {
                        const isSelected =
                          bookmarks_slice_state.is_fetching_first_bookmarks
                            ? counts.selected_tags.find((t) => t == tag.id) !=
                              undefined
                            : tag_view_options.actual_selected_tags.find(
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
                on_selected_tag_click={
                  tag_view_options.remove_tag_from_query_params
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
                on_link_click={async () => {
                  const visited_at = await handle_link_click({
                    booomark_id: bookmark.id,
                  })
                  search.update_searchable_bookmark({
                    bookmark: {
                      id: bookmark.id,
                      created_at: new Date(bookmark.created_at),
                      visited_at,
                      updated_at: new Date(),
                      title: bookmark.title,
                      is_public: bookmark.is_public,
                      is_archived:
                        filter_view_options.current_filter ==
                        LibraryFilter.Archived,
                      is_unread: bookmark.is_unread,
                      stars: bookmark.stars,
                      links: bookmark.links.map((link) => ({
                        url: link.url,
                        site_path: link.site_path,
                        is_public: link.is_public,
                      })),
                      tags: bookmark.tags.map((tag) => tag.name),
                    },
                    tag_ids: bookmark.tags.map((tag) => tag.id),
                  })
                }}
                favicon_host={`${process.env.NEXT_PUBLIC_API_URL}/v1/favicons`}
                menu_slot={
                  <DropdownMenu
                    items={[
                      {
                        label: 'Mark as Unread',
                        is_checked: bookmark.is_unread,
                        on_click: () => {
                          const is_unread = !bookmark.is_unread
                          const updated_bookmark: UpsertBookmark_Params = {
                            bookmark_id: bookmark.id,
                            created_at: new Date(bookmark.created_at),
                            title: bookmark.title,
                            is_archived:
                              filter_view_options.current_filter ==
                              LibraryFilter.Archived,
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
                          dispatch(
                            bookmarks_actions.upsert_bookmark({
                              bookmark: updated_bookmark,
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
                              created_at: new Date(bookmark.created_at),
                              visited_at: new Date(bookmark.visited_at),
                              updated_at: new Date(),
                              title: bookmark.title,
                              is_public: bookmark.is_public,
                              is_archived:
                                filter_view_options.current_filter ==
                                LibraryFilter.Archived,
                              is_unread,
                              stars: bookmark.stars,
                              links: bookmark.links.map((link) => ({
                                url: link.url,
                                site_path: link.site_path,
                                is_public: link.is_public,
                              })),
                              tags: bookmark.tags.map((tag) => tag.name),
                            },
                            tag_ids: bookmark.tags.map((tag) => tag.id),
                          })
                          if (
                            bookmarks_slice_state.bookmarks &&
                            bookmarks_slice_state.bookmarks.length == 1 &&
                            search.search_string.length
                          ) {
                            if (
                              !is_unread &&
                              (filter_view_options.current_filter ==
                                LibraryFilter.Unread ||
                                filter_view_options.current_filter ==
                                  LibraryFilter.OneStarUnread ||
                                filter_view_options.current_filter ==
                                  LibraryFilter.TwoStarsUnread ||
                                filter_view_options.current_filter ==
                                  LibraryFilter.ThreeStarsUnread)
                            ) {
                              search.reset()
                            }
                          }
                        },
                      },
                      {
                        label: 'One star',
                        is_checked: bookmark.stars == 1,
                        on_click: () => {
                          const updated_bookmark: UpsertBookmark_Params = {
                            bookmark_id: bookmark.id,
                            created_at: new Date(bookmark.created_at),
                            title: bookmark.title,
                            is_archived:
                              filter_view_options.current_filter ==
                              LibraryFilter.Archived,
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
                          dispatch(
                            bookmarks_actions.upsert_bookmark({
                              bookmark: updated_bookmark,
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
                              created_at: new Date(bookmark.created_at),
                              visited_at: new Date(bookmark.visited_at),
                              updated_at: new Date(),
                              title: bookmark.title,
                              is_public: bookmark.is_public,
                              is_archived:
                                filter_view_options.current_filter ==
                                LibraryFilter.Archived,
                              is_unread: bookmark.is_unread,
                              stars: bookmark.stars == 1 ? 0 : 1,
                              links: bookmark.links.map((link) => ({
                                url: link.url,
                                site_path: link.site_path,
                                is_public: link.is_public,
                              })),
                              tags: bookmark.tags.map((tag) => tag.name),
                            },
                            tag_ids: bookmark.tags.map((tag) => tag.id),
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
                        on_click: () => {
                          const updated_bookmark: UpsertBookmark_Params = {
                            bookmark_id: bookmark.id,
                            created_at: new Date(bookmark.created_at),
                            title: bookmark.title,
                            is_archived:
                              filter_view_options.current_filter ==
                              LibraryFilter.Archived,
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
                          dispatch(
                            bookmarks_actions.upsert_bookmark({
                              bookmark: updated_bookmark,
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
                              created_at: new Date(bookmark.created_at),
                              visited_at: new Date(bookmark.visited_at),
                              updated_at: new Date(),
                              title: bookmark.title,
                              is_public: bookmark.is_public,
                              is_archived:
                                filter_view_options.current_filter ==
                                LibraryFilter.Archived,
                              is_unread: bookmark.is_unread,
                              stars: bookmark.stars == 2 ? 0 : 2,
                              links: bookmark.links.map((link) => ({
                                url: link.url,
                                site_path: link.site_path,
                              })),
                              tags: bookmark.tags.map((tag) => tag.name),
                            },
                            tag_ids: bookmark.tags.map((tag) => tag.id),
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
                        on_click: () => {
                          const updated_bookmark: UpsertBookmark_Params = {
                            bookmark_id: bookmark.id,
                            created_at: new Date(bookmark.created_at),
                            title: bookmark.title,
                            is_archived:
                              filter_view_options.current_filter ==
                              LibraryFilter.Archived,
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
                          dispatch(
                            bookmarks_actions.upsert_bookmark({
                              bookmark: updated_bookmark,
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
                              created_at: new Date(bookmark.created_at),
                              visited_at: new Date(bookmark.visited_at),
                              updated_at: new Date(),
                              title: bookmark.title,
                              is_public: bookmark.is_public,
                              is_archived:
                                filter_view_options.current_filter ==
                                LibraryFilter.Archived,
                              is_unread: bookmark.is_unread,
                              stars: bookmark.stars == 3 ? 0 : 3,
                              links: bookmark.links.map((link) => ({
                                url: link.url,
                                site_path: link.site_path,
                              })),
                              tags: bookmark.tags.map((tag) => tag.name),
                            },

                            tag_ids: bookmark.tags.map((tag) => tag.id),
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
                      ...(props.user == 'authorized'
                        ? [
                            {
                              label: 'Edit',
                              on_click: async () => {
                                const updated_bookmark =
                                  await upsert_bookmark_modal({
                                    modal_context,
                                    bookmark,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      LibraryFilter.Archived,
                                    auth_token:
                                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                  })
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
                                    api_url: process.env.NEXT_PUBLIC_API_URL,
                                    auth_token:
                                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
                                  }),
                                )

                                search.update_searchable_bookmark({
                                  bookmark: {
                                    id: bookmark.id,
                                    is_archived:
                                      filter_view_options.current_filter ==
                                      LibraryFilter.Archived,
                                    is_public: updated_bookmark.is_public,
                                    is_unread: updated_bookmark.is_unread,
                                    title: updated_bookmark.title,
                                    tags: updated_bookmark.tags.map(
                                      (tag) => tag.name,
                                    ),
                                    links: updated_bookmark.links.map(
                                      (link) => ({
                                        url: link.url,
                                        site_path: link.site_path,
                                      }),
                                    ),
                                    created_at: new Date(
                                      updated_bookmark.created_at,
                                    ),
                                    visited_at: new Date(bookmark.visited_at),
                                    updated_at: new Date(bookmark.updated_at),

                                    stars: updated_bookmark.stars,
                                  },
                                  tag_ids: updated_bookmark.tags.map(
                                    (tag) => tag.id,
                                  ),
                                })
                              },
                              other_icon: <Icon variant="EDIT" />,
                            },
                          ]
                        : []),
                      {
                        label: !(
                          filter_view_options.current_filter ==
                          LibraryFilter.Archived
                        )
                          ? 'Archive'
                          : 'Restore',
                        other_icon: <Icon variant="ARCHIVE" />,
                        on_click: () => {
                          const updated_bookmark: UpsertBookmark_Params = {
                            bookmark_id: bookmark.id,
                            created_at: new Date(bookmark.created_at),
                            title: bookmark.title,
                            is_archived: !(
                              filter_view_options.current_filter ==
                              LibraryFilter.Archived
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
                              bookmark: updated_bookmark,
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
                              created_at: new Date(bookmark.created_at),
                              visited_at: new Date(bookmark.visited_at),
                              updated_at: new Date(),
                              title: bookmark.title,
                              is_public: bookmark.is_public,
                              is_archived: !(
                                filter_view_options.current_filter ==
                                LibraryFilter.Archived
                              ),
                              is_unread: bookmark.is_unread,
                              stars: bookmark.stars,
                              links: bookmark.links.map((link) => ({
                                url: link.url,
                                site_path: link.site_path,
                                is_public: link.is_public,
                              })),
                              tags: bookmark.tags.map((tag) => tag.name),
                            },
                            tag_ids: bookmark.tags.map((tag) => tag.id),
                          })
                          if (search.count) search.set_count(search.count - 1)
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
                          if (search.count) search.set_count(search.count - 1)
                          if (
                            bookmarks_slice_state.bookmarks &&
                            bookmarks_slice_state.bookmarks.length == 1 &&
                            search.search_string.length
                          ) {
                            search.reset()
                          }
                        },
                        other_icon: <Icon variant="DELETE" />,
                      },
                    ]}
                  />
                }
                highlights={search.highlights?.[bookmark.id.toString()]}
                orama_db_id={search.db?.id}
                is_serach_result={search.result !== undefined}
                should_dim_visited_links={props.user == 'public'}
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
        (filter_view_options.current_filter == LibraryFilter.Unread ||
          filter_view_options.current_filter == LibraryFilter.OneStarUnread ||
          filter_view_options.current_filter == LibraryFilter.TwoStarsUnread ||
          filter_view_options.current_filter == LibraryFilter.ThreeStarsUnread)
          ? () => {
              filter_view_options.clear_unread(
                filter_view_options.current_filter,
              )
            }
          : undefined
      }
      clear_selected_stars={
        !bookmarks_slice_state.is_fetching_first_bookmarks &&
        (!bookmarks_slice_state.bookmarks ||
          bookmarks_slice_state.bookmarks.length == 0) &&
        (filter_view_options.current_filter == LibraryFilter.OneStar ||
          filter_view_options.current_filter == LibraryFilter.OneStarUnread ||
          filter_view_options.current_filter == LibraryFilter.TwoStars ||
          filter_view_options.current_filter == LibraryFilter.TwoStarsUnread ||
          filter_view_options.current_filter == LibraryFilter.ThreeStars ||
          filter_view_options.current_filter == LibraryFilter.ThreeStarsUnread)
          ? () => {
              filter_view_options.clear_selected_stars(
                filter_view_options.current_filter,
              )
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
