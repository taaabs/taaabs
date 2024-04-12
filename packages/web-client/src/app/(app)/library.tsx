import useToggle from 'beautiful-react-hooks/useToggle'
import { use_library_dispatch } from '@/stores/library'
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
import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { browser_storage } from '@/constants/browser-storage'
import { use_is_hydrated } from '@shared/hooks'
import { use_search } from '@/hooks/library/use-search'
import { ModalContext } from '../../providers/modal-provider'
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
import { Pinned as UiAppAtom_Pinned } from '@web-ui/components/app/atoms/pinned'
import { Bookmark as UiAppAtom_Bookmark } from '@web-ui/components/app/atoms/bookmark'
import { Icon as UiCommonParticles_Icon } from '@web-ui/components/common/particles/icon'
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
import { Dictionary } from '@/dictionaries/dictionary'
import { use_scroll_restore } from '@/hooks/misc/use-scroll-restore'
import ky from 'ky'
import { use_pinned } from '@/hooks/library/use-pinned'
import { pinned_actions } from '@repositories/stores/library/pinned/pinned.slice'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'
import { RecordVisit_Params } from '@repositories/modules/bookmarks/domain/types/record-visit.params'
import dictionary from '@/dictionaries/en'
import { url_to_wayback } from '@web-ui/utils/url-to-wayback'

const CustomRange = dynamic(() => import('./dynamic-custom-range'), {
  ssr: false,
  loading: () => <UiAppAtom_CustomRangeSkeleton />,
})

const Library = (params: {
  dictionary: Dictionary
  search_hook: ReturnType<typeof use_search>
}) => {
  use_scroll_restore()
  const is_hydrated = use_is_hydrated()
  use_session_storage_cleanup()
  const dispatch = use_library_dispatch()
  const search_params = useSearchParams()
  const { username }: { username?: string } = useParams()
  const modal_context = useContext(ModalContext)
  const [show_skeletons, set_show_skeletons] = useState(true)
  const search_hook = params.search_hook
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
  const [close_aside_count, set_close_aside_count] = useState(0)
  const [is_sort_by_dropdown_visible, toggle_sort_by_dropdown] =
    useToggle(false)
  const [is_order_dropdown_visible, toggle_order_dropdown] = useToggle(false)
  const [library_updated_at_timestamp, set_library_updated_at_timestamp] =
    useState<number>()

  const ky_instance = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY`,
      'Content-Type': 'application/json',
    },
  })

  const favicon_host = `${process.env.NEXT_PUBLIC_API_URL}/v1/favicons`

  useUpdateEffect(() => {
    if (
      !bookmarks_hook.is_fetching &&
      !bookmarks_hook.is_fetching_first_bookmarks &&
      !bookmarks_hook.is_upserting &&
      !counts_hook.is_fetching &&
      !counts_hook.should_refetch &&
      !tag_hierarchies_hook.is_fetching &&
      !pinned_hook.is_fetching &&
      !pinned_hook.should_refetch
    ) {
      set_show_skeletons(false)
      set_library_updated_at_timestamp(Date.now())
    }
  }, [
    bookmarks_hook.is_fetching,
    bookmarks_hook.is_fetching_first_bookmarks,
    bookmarks_hook.is_upserting,
    counts_hook.is_fetching,
    counts_hook.should_refetch,
    tag_hierarchies_hook.is_fetching,
    pinned_hook.is_fetching,
    pinned_hook.should_refetch,
    // Bookmark menu items must see new db instances.
    search_hook.db_updated_at_timestamp,
    search_hook.archived_db_updated_at_timestamp,
  ])

  // Check for first bookmarks needed by deleting tags of last bookmark in results.
  useUpdateEffect(() => {
    if (
      !bookmarks_hook.is_upserting &&
      !bookmarks_hook.is_fetching_first_bookmarks
    ) {
      dispatch(
        bookmarks_actions.set_bookmarks(bookmarks_hook.incoming_bookmarks),
      )
    }
  }, [bookmarks_hook.is_upserting, bookmarks_hook.is_fetching_first_bookmarks])

  useUpdateEffect(() => {
    if (counts_hook.should_refetch) {
      counts_hook.get_counts()
    }
  }, [counts_hook.should_refetch])

  useUpdateEffect(() => {
    if (pinned_hook.should_refetch) {
      pinned_hook.get_pinned()
    }
  }, [pinned_hook.should_refetch])

  useUpdateEffect(() => {
    search_hook.set_current_filter(filter_view_options_hook.current_filter)
  }, [filter_view_options_hook.current_filter])

  // Clear cache when user selects visited at sort_by option or popularity order.
  // Filter is in deps because we want to clear cache when setting to archive.
  // NOTE: Could be reworked to avoid unnecesary invalidations.
  const [search_cache_to_be_cleared, set_search_cache_to_be_cleared] =
    useState(false)
  useUpdateEffect(() => {
    if (
      sort_by_view_options_hook.current_sort_by == SortBy.VISITED_AT ||
      sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
    ) {
      set_search_cache_to_be_cleared(true)
    } else {
      set_search_cache_to_be_cleared(false)
    }
  }, [
    filter_view_options_hook.current_filter,
    sort_by_view_options_hook.current_sort_by,
    order_view_options_hook.current_order,
  ])

  useUpdateEffect(() => {
    if (search_hook.db || search_hook.archived_db) {
      search_hook.set_current_filter(filter_view_options_hook.current_filter)
      search_hook.set_selected_tags(
        counts_hook.selected_tags
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
  }, [search_hook.db, search_hook.archived_db])

  useUpdateEffect(() => {
    if (search_hook.result) {
      bookmarks_hook.get_bookmarks_by_ids({
        all_not_paginated_ids: search_hook.result.hits.map((hit) =>
          parseInt(hit.document.id),
        ),
      })
    }
  }, [search_hook.queried_at_timestamp])

  useEffect(() => {
    tag_hierarchies_hook.get_tag_hierarchies({
      filter: filter_view_options_hook.current_filter,
      gte: date_view_options_hook.current_gte,
      lte: date_view_options_hook.current_lte,
    })
  }, [
    date_view_options_hook.current_gte,
    date_view_options_hook.current_lte,
    filter_view_options_hook.current_filter,
  ])

  useUpdateEffect(() => {
    if (!bookmarks_hook.is_fetching_first_bookmarks) {
      window.scrollTo(0, 0)
    }
  }, [bookmarks_hook.is_fetching_first_bookmarks])

  const is_archived_filter =
    filter_view_options_hook.current_filter == Filter.ARCHIVED ||
    filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED ||
    filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED_UNREAD ||
    filter_view_options_hook.current_filter == Filter.ARCHIVED_UNREAD

  function sort_by_option_to_label(sort_by_option: SortBy): string {
    switch (sort_by_option) {
      case SortBy.CREATED_AT:
        return params.dictionary.library.sort_by_options.created_at
      case SortBy.UPDATED_AT:
        return params.dictionary.library.sort_by_options.updated_at
      case SortBy.VISITED_AT:
        return params.dictionary.library.sort_by_options.visited_at
      case SortBy.POPULARITY:
        return params.dictionary.library.sort_by_options.popularity
    }
  }

  function order_option_to_label(order_option: Order): string {
    switch (order_option) {
      case Order.DESC:
        return params.dictionary.library.order_options.newest_first
      case Order.ASC:
        return params.dictionary.library.order_options.oldest_first
    }
  }

  const slot_search = (
    <UiAppAtom_LibrarySearch
      search_string={search_hook.search_string}
      is_loading={search_hook.is_initializing}
      loading_progress_percentage={search_hook.indexed_bookmarks_percentage}
      placeholder={params.dictionary.library.search_placeholder}
      hints={!search_hook.is_initializing ? search_hook.hints : undefined}
      hints_set_at_timestamp={search_hook.hints_set_at_timestamp}
      queried_at_timestamp={search_hook.queried_at_timestamp}
      on_click_hint={(i) => {
        const search_string =
          search_hook.search_string + search_hook.hints![i].completion
        search_hook.set_search_string(search_string)
        search_hook.query_db({ search_string })
      }}
      on_click_recent_hint_remove={(i) => {
        const search_string =
          search_hook.hints![i].search_string + search_hook.hints![i].completion
        search_hook.remove_recent_hint({ search_string })
      }}
      is_focused={search_hook.is_search_focused}
      on_focus={async () => {
        if (!search_hook.is_initializing) {
          search_hook.set_is_search_focused(true)

          search_hook.set_selected_tags(
            counts_hook.selected_tags
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

          if (search_cache_to_be_cleared) {
            await search_hook.clear_cached_data({
              is_archived: is_archived_filter,
            })
            set_search_cache_to_be_cleared(false)
          }

          await search_hook.init({
            is_archived: is_archived_filter,
          })

          search_hook.get_hints()
        }
      }}
      on_change={(value) => {
        if (search_hook.is_initializing) return
        search_hook.set_search_string(value)
        if (!value) {
          window.history.pushState(
            {},
            '',
            window.location.pathname + `?${search_params.toString()}`,
          )
        }
      }}
      on_submit={async () => {
        if (search_hook.is_initializing || search_hook.count == 0) return
        if (search_hook.search_string.trim()) {
          await search_hook.query_db({
            search_string: search_hook.search_string,
          })
        }
      }}
      on_blur={() => {
        search_hook.clear_hints()
        search_hook.set_is_search_focused(false)
      }}
      results_count={search_hook.search_string ? search_hook.count : undefined}
      on_clear_click={() => {
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
      is_slash_shortcut_disabled={modal_context?.modal !== undefined}
      on_click_get_help={() => {}}
      translations={{
        footer_tip: 'Tags, filters and custom range affect results.',
        get_help_link: 'Get help',
      }}
    />
  )
  const slot_toolbar = (
    <UiAppAtom_Toolbar
      toggleable_buttons={[
        {
          label: 'Starred',
          is_toggled:
            filter_view_options_hook.current_filter == Filter.STARRED ||
            filter_view_options_hook.current_filter == Filter.STARRED_UNREAD ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED_UNREAD,
          on_click: () => {
            if (
              bookmarks_hook.is_fetching_first_bookmarks ||
              bookmarks_hook.is_fetching_more_bookmarks ||
              counts_hook.is_fetching
            )
              return

            let filter = Filter.NONE
            if (filter_view_options_hook.current_filter == Filter.NONE) {
              filter = Filter.STARRED
            } else if (
              filter_view_options_hook.current_filter == Filter.STARRED
            ) {
              filter = Filter.NONE
            } else if (
              filter_view_options_hook.current_filter == Filter.STARRED_UNREAD
            ) {
              filter = Filter.UNREAD
            } else if (
              filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED
            ) {
              filter = Filter.ARCHIVED
            } else if (
              filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED_UNREAD
            ) {
              filter = Filter.ARCHIVED_UNREAD
            } else if (
              filter_view_options_hook.current_filter == Filter.UNREAD
            ) {
              filter = Filter.STARRED_UNREAD
            } else if (
              filter_view_options_hook.current_filter == Filter.ARCHIVED
            ) {
              filter = Filter.ARCHIVED_STARRED
            } else if (
              filter_view_options_hook.current_filter == Filter.ARCHIVED_UNREAD
            ) {
              filter = Filter.ARCHIVED_STARRED_UNREAD
            }
            filter_view_options_hook.set_filter_query_param(filter)
          },
        },
        ...(!username
          ? [
              {
                label: 'Unread',
                is_toggled:
                  filter_view_options_hook.current_filter == Filter.UNREAD ||
                  filter_view_options_hook.current_filter ==
                    Filter.STARRED_UNREAD ||
                  filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_UNREAD ||
                  filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED_UNREAD,
                on_click: () => {
                  if (
                    bookmarks_hook.is_fetching_first_bookmarks ||
                    bookmarks_hook.is_fetching_more_bookmarks ||
                    counts_hook.is_fetching
                  )
                    return

                  let filter = Filter.NONE
                  if (filter_view_options_hook.current_filter == Filter.NONE) {
                    filter = Filter.UNREAD
                  } else if (
                    filter_view_options_hook.current_filter == Filter.UNREAD
                  ) {
                    filter = Filter.NONE
                  } else if (
                    filter_view_options_hook.current_filter ==
                    Filter.STARRED_UNREAD
                  ) {
                    filter = Filter.STARRED
                  } else if (
                    filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_UNREAD
                  ) {
                    filter = Filter.ARCHIVED
                  } else if (
                    filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED_UNREAD
                  ) {
                    filter = Filter.ARCHIVED_STARRED
                  } else if (
                    filter_view_options_hook.current_filter == Filter.STARRED
                  ) {
                    filter = Filter.STARRED_UNREAD
                  } else if (
                    filter_view_options_hook.current_filter == Filter.ARCHIVED
                  ) {
                    filter = Filter.ARCHIVED_UNREAD
                  } else if (
                    filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED
                  ) {
                    filter = Filter.ARCHIVED_STARRED_UNREAD
                  }
                  filter_view_options_hook.set_filter_query_param(filter)
                },
              },
            ]
          : []),
        {
          label: 'Archived',
          is_toggled:
            filter_view_options_hook.current_filter == Filter.ARCHIVED ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED ||
            filter_view_options_hook.current_filter == Filter.ARCHIVED_UNREAD ||
            filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED_UNREAD,
          on_click: () => {
            if (
              bookmarks_hook.is_fetching_first_bookmarks ||
              bookmarks_hook.is_fetching_more_bookmarks ||
              counts_hook.is_fetching
            )
              return

            let filter = Filter.NONE

            if (filter_view_options_hook.current_filter == Filter.NONE) {
              filter = Filter.ARCHIVED
            } else if (
              filter_view_options_hook.current_filter == Filter.STARRED
            ) {
              filter = Filter.ARCHIVED_STARRED
            } else if (
              filter_view_options_hook.current_filter == Filter.UNREAD
            ) {
              filter = Filter.ARCHIVED_UNREAD
            } else if (
              filter_view_options_hook.current_filter == Filter.STARRED_UNREAD
            ) {
              filter = Filter.ARCHIVED_STARRED_UNREAD
            } else if (
              filter_view_options_hook.current_filter == Filter.ARCHIVED
            ) {
              filter = Filter.NONE
            } else if (
              filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED
            ) {
              filter = Filter.STARRED
            } else if (
              filter_view_options_hook.current_filter == Filter.ARCHIVED_UNREAD
            ) {
              filter = Filter.UNREAD
            } else if (
              filter_view_options_hook.current_filter ==
              Filter.ARCHIVED_STARRED_UNREAD
            ) {
              filter = Filter.STARRED_UNREAD
            }

            filter_view_options_hook.set_filter_query_param(filter)
          },
        },
      ]}
      icon_buttons={[
        {
          icon_variant:
            bookmarks_hook.density == 'default'
              ? 'DENSITY_DEFAULT'
              : 'DENSITY_COMPACT',
          on_click: () => {
            if (bookmarks_hook.is_fetching) return
            set_close_aside_count(close_aside_count + 1)
            dispatch(
              bookmarks_actions.set_density_of_current_bookmarks(
                bookmarks_hook.density == 'default' ? 'compact' : 'default',
              ),
            )
            window.scrollTo(0, 0)
          },
        },
        { icon_variant: 'THREE_DOTS', on_click: () => {} },
      ]}
    />
  )
  const slot_tag_hierarchies = (
    <UiAppAtom_TagHierarchies
      library_updated_at_timestamp={library_updated_at_timestamp}
      is_draggable={!username}
      tree={tag_hierarchies_hook.tag_hierarchies}
      on_update={async (tag_hierarchies: TagHierarchies.Node[]) => {
        const filter = filter_view_options_hook.current_filter

        const update_tag_hierarchies_params: UpdateTagHierarchies_Params = {
          tag_hierarchies,
          gte: date_view_options_hook.current_gte,
          lte: date_view_options_hook.current_lte,
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
            ky: ky_instance,
          }),
        )
        toast.success(params.dictionary.library.tag_hierarchies_upated)
      }}
      selected_tag_ids={tag_view_options_hook.selected_tags}
      is_updating={tag_hierarchies_hook.is_updating}
      on_item_click={(tag_ids: number[]) => {
        tag_view_options_hook.set_many_tags_to_search_params({
          tag_ids,
        })
        set_close_aside_count(close_aside_count + 1)
      }}
      dragged_tag={tag_view_options_hook.dragged_tag}
      all_bookmarks_yields={tag_hierarchies_hook.total}
      is_all_bookmarks_selected={!tag_view_options_hook.selected_tags.length}
      on_click_all_bookmarks={() => {
        tag_view_options_hook.clear_selected_tags()
        if (bookmarks_hook.showing_bookmarks_fetched_by_ids) {
          search_hook.reset()
          if (filter_view_options_hook.current_filter == Filter.NONE) {
            bookmarks_hook.get_bookmarks({})
          }
        }
        set_close_aside_count(close_aside_count + 1)
      }}
      translations={{
        all_bookmarks: params.dictionary.library.all_bookmarks,
        drag_here: params.dictionary.library.drag_tag_here,
      }}
    />
  )
  const slot_aside = (
    <UiAppTemplate_LibraryAside
      feedback_label={params.dictionary.library.send_feedback}
      on_feedback_click={() => {}}
      slot_sort_by={{
        button: is_hydrated ? (
          <UiAppAtom_ButtonSelect
            label={params.dictionary.library.sort_by}
            current_value={sort_by_option_to_label(
              sort_by_view_options_hook.current_sort_by,
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
                  label: sort_by_option_to_label(SortBy.CREATED_AT),
                  on_click: () => {
                    toggle_sort_by_dropdown()
                    if (
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.CREATED_AT
                    )
                      return
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.CREATED_AT,
                    )
                  },
                  is_selected:
                    sort_by_view_options_hook.current_sort_by ==
                    SortBy.CREATED_AT,
                },
                {
                  label: sort_by_option_to_label(SortBy.UPDATED_AT),
                  on_click: () => {
                    toggle_sort_by_dropdown()
                    if (
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.UPDATED_AT
                    )
                      return
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.UPDATED_AT,
                    )
                  },
                  is_selected:
                    sort_by_view_options_hook.current_sort_by ==
                    SortBy.UPDATED_AT,
                },
                ...(!username
                  ? [
                      {
                        label: sort_by_option_to_label(SortBy.VISITED_AT),
                        on_click: () => {
                          toggle_sort_by_dropdown()
                          if (
                            sort_by_view_options_hook.current_sort_by ==
                            SortBy.VISITED_AT
                          )
                            return
                          sort_by_view_options_hook.set_sort_by_query_param(
                            SortBy.VISITED_AT,
                          )
                        },
                        is_selected:
                          sort_by_view_options_hook.current_sort_by ==
                          SortBy.VISITED_AT,
                      },
                    ]
                  : []),
                {
                  label: sort_by_option_to_label(SortBy.POPULARITY),
                  on_click: () => {
                    toggle_sort_by_dropdown()
                    if (
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.POPULARITY
                    )
                      return
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.POPULARITY,
                    )
                  },
                  is_selected:
                    sort_by_view_options_hook.current_sort_by ==
                    SortBy.POPULARITY,
                },
              ]}
            />
          </OutsideClickHandler>
        ),
      }}
      slot_order={{
        button: is_hydrated ? (
          <UiAppAtom_ButtonSelect
            label={params.dictionary.library.order}
            current_value={order_option_to_label(
              order_view_options_hook.current_order,
            )}
            is_active={is_order_dropdown_visible}
            on_click={toggle_order_dropdown}
            is_disabled={
              sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
            }
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
                  label: order_option_to_label(Order.DESC),
                  on_click: () => {
                    toggle_order_dropdown()
                    if (order_view_options_hook.current_order == Order.DESC)
                      return
                    order_view_options_hook.set_order_query_param(Order.DESC)
                  },

                  is_selected:
                    order_view_options_hook.current_order == Order.DESC,
                },
                {
                  label: order_option_to_label(Order.ASC),
                  on_click: () => {
                    toggle_order_dropdown()
                    if (order_view_options_hook.current_order == Order.ASC)
                      return
                    order_view_options_hook.set_order_query_param(Order.ASC)
                  },
                  is_selected:
                    order_view_options_hook.current_order == Order.ASC,
                },
              ]}
            />
          </OutsideClickHandler>
        ),
      }}
      slot_custom_range={
        !show_skeletons ? (
          <CustomRange
            library_updated_at_timestamp={library_updated_at_timestamp}
            counts={counts_hook.months || undefined}
            on_yyyymm_change={date_view_options_hook.set_gte_lte_search_params}
            clear_date_range={
              date_view_options_hook.clear_gte_lte_search_params
            }
            current_gte={parseInt(search_params.get('gte') || '0') || undefined}
            current_lte={parseInt(search_params.get('lte') || '0') || undefined}
            selected_tags={search_params.get('t') || undefined}
            is_range_selector_disabled={
              sort_by_view_options_hook.current_sort_by == SortBy.UPDATED_AT ||
              sort_by_view_options_hook.current_sort_by == SortBy.VISITED_AT ||
              sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
            }
          />
        ) : (
          <UiAppAtom_CustomRangeSkeleton />
        )
      }
      slot_tags={
        <div
          style={{
            opacity:
              bookmarks_hook.is_fetching_first_bookmarks &&
              !search_hook.search_string
                ? 'var(--dimmed-opacity)'
                : undefined,
          }}
        >
          {!show_skeletons ? (
            <>
              <UiAppAtom_SelectedTags
                library_updated_at_timestamp={library_updated_at_timestamp}
                selected_tags={tag_view_options_hook.selected_tags
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
                  tag_view_options_hook.remove_tags_from_search_params([tag_id])
                }
              />
              <UiAppAtom_Tags
                library_updated_at_timestamp={library_updated_at_timestamp}
                library_url={username ? `/${username}` : '/bookmarks'}
                tags={
                  counts_hook.tags
                    ? Object.entries(counts_hook.tags)
                        .filter(
                          (tag) =>
                            !tag_view_options_hook.selected_tags.includes(
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
                on_click={tag_view_options_hook.add_tag_to_search_params}
                on_tag_drag_start={
                  !username ? tag_view_options_hook.set_dragged_tag : undefined
                }
              />
            </>
          ) : (
            <UiAppAtom_TagsSkeleton />
          )}
        </div>
      }
    />
  )
  const slot_pinned = (
    <UiAppAtom_Pinned
      library_updated_at_timestamp={library_updated_at_timestamp}
      favicon_host={favicon_host}
      header_title={params.dictionary.library.pinned}
      items={
        pinned_hook.items?.map((item) => ({
          bookmark_id: item.bookmark_id,
          url: item.url,
          created_at: new Date(item.created_at),
          title: item.title,
          is_unread: item.is_unread,
          stars: item.stars,
          tags: item.tags,
          via_wayback: item.via_wayback,
        })) || []
      }
      is_draggable={!username && !pinned_hook.is_updating}
      on_change={async (updated_pinned) => {
        await dispatch(
          pinned_actions.update_pinned({
            update_pinned_params: updated_pinned.map((pin) => ({
              url: pin.url,
            })),
            ky: ky_instance,
          }),
        )
        toast.success(params.dictionary.library.pinned_links_has_beed_updated)
      }}
      on_link_click={
        !username
          ? (bookmark_id) => {
              const record_visit_params: RecordVisit_Params = {
                bookmark_id,
                visited_at: new Date().toISOString(),
              }
              localStorage.setItem(
                browser_storage.local_storage.authorized_library
                  .record_visit_params,
                JSON.stringify(record_visit_params),
              )
            }
          : undefined
      }
      selected_tags={tag_view_options_hook.selected_tags}
      selected_starred={
        filter_view_options_hook.current_filter == Filter.STARRED ||
        filter_view_options_hook.current_filter == Filter.STARRED_UNREAD
      }
      selected_unread={
        filter_view_options_hook.current_filter == Filter.UNREAD ||
        filter_view_options_hook.current_filter == Filter.STARRED_UNREAD
      }
      selected_archived={
        filter_view_options_hook.current_filter == Filter.ARCHIVED ||
        filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED ||
        filter_view_options_hook.current_filter ==
          Filter.ARCHIVED_STARRED_UNREAD ||
        filter_view_options_hook.current_filter == Filter.ARCHIVED_UNREAD
      }
      current_gte={date_view_options_hook.current_gte}
      current_lte={date_view_options_hook.current_lte}
    />
  )

  const slot_bookmarks = bookmarks_hook.bookmarks?.map((bookmark, i) => (
    <UiAppAtom_Bookmark
      key={`${i}-${bookmarks_hook.first_bookmarks_fetched_at_timestamp}`}
      index={i}
      created_at={new Date(bookmark.created_at)}
      library_updated_at_timestamp={library_updated_at_timestamp}
      search_queried_at_timestamp={search_hook.queried_at_timestamp}
      bookmark_id={bookmark.id}
      library_url={username ? `/${username}` : '/bookmarks'}
      on_tag_drag_start={
        !username ? tag_view_options_hook.set_dragged_tag : undefined
      }
      density={bookmarks_hook.density}
      is_search_result={bookmarks_hook.showing_bookmarks_fetched_by_ids}
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
              const is_selected = bookmarks_hook.is_fetching_first_bookmarks
                ? counts_hook.selected_tags.find((t) => t == tag.id) !=
                  undefined
                : tag_view_options_hook.selected_tags.find(
                    (t) => t == tag.id,
                  ) !== undefined

              return {
                name: tag.name,
                is_selected,
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
      is_unread={bookmark.is_unread}
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
      on_link_click={
        !username
          ? () => {
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
          : undefined
      }
      favicon_host={favicon_host}
      // We pass dragged tag so on_mouse_up has access to current state (memoized component is refreshed).
      dragged_tag={tag_view_options_hook.dragged_tag}
      on_mouse_up={async () => {
        if (
          !tag_view_options_hook.dragged_tag ||
          tag_view_options_hook.dragged_tag.source_bookmark_id == bookmark.id
        )
          return
        if (bookmark.tags.length == system_values.bookmark.tags.limit) {
          toast.error(
            `Bookmark can have at most ${system_values.bookmark.tags.limit} tags`,
          )
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
        const { db, bookmarks_just_tags } = await search_hook.init({
          is_archived: is_archived_filter,
        })
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
            is_pinned: link.is_pinned,
            pin_title: link.pin_title,
            pin_order: link.pin_order,
            via_wayback: link.via_wayback,
          })),
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
            ky: ky_instance,
          }),
        )
        await search_hook.update_bookmark({
          db,
          bookmarks_just_tags,
          is_archived: is_archived_filter,
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
        await tag_hierarchies_hook.get_tag_hierarchies({
          filter: filter_view_options_hook.current_filter,
          gte: date_view_options_hook.current_gte,
          lte: date_view_options_hook.current_lte,
        })
        dispatch(bookmarks_actions.set_is_upserting(false))
        toast.success(params.dictionary.library.bookmark_updated)
      }}
      on_tags_order_change={
        !username
          ? async (tags) => {
              dispatch(bookmarks_actions.set_is_upserting(true))
              const { db, bookmarks_just_tags } = await search_hook.init({
                is_archived: is_archived_filter,
              })
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
                  is_pinned: link.is_pinned,
                  pin_title: link.pin_title,
                  pin_order: link.pin_order,
                  via_wayback: link.via_wayback,
                })),
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
                  ky: ky_instance,
                }),
              )
              await search_hook.update_bookmark({
                db,
                bookmarks_just_tags,
                is_archived: is_archived_filter,
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
              dispatch(bookmarks_actions.set_is_upserting(false))
              toast.success(params.dictionary.library.bookmark_updated)
            }
          : undefined
      }
      on_tag_delete_click={
        !username
          ? async (tag_id) => {
              dispatch(bookmarks_actions.set_is_upserting(true))
              const { db, bookmarks_just_tags } = await search_hook.init({
                is_archived: is_archived_filter,
              })
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
                  is_pinned: link.is_pinned,
                  pin_title: link.pin_title,
                  pin_order: link.pin_order,
                  via_wayback: link.via_wayback,
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
                    JSON.parse(
                      sessionStorage.getItem(
                        browser_storage.session_storage.library
                          .last_authorized_counts_params,
                      ) || 'null',
                    ) || undefined,
                  ky: ky_instance,
                }),
              )
              await search_hook.update_bookmark({
                db,
                bookmarks_just_tags,
                is_archived: is_archived_filter,
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
                  tag_ids: updated_bookmark.tags.map((tag) => tag.id),
                },
              })
              await tag_hierarchies_hook.get_tag_hierarchies({
                filter: filter_view_options_hook.current_filter,
                gte: date_view_options_hook.current_gte,
                lte: date_view_options_hook.current_lte,
              })
              const updated_tag_ids = updated_bookmark.tags.map((t) => t.id)
              if (
                !tag_view_options_hook.selected_tags.every((t) =>
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
              if (counts_hook.tags![tag_id].yields == 1) {
                dispatch(
                  bookmarks_actions.set_is_fetching_first_bookmarks(true),
                )
                tag_view_options_hook.remove_tags_from_search_params([tag_id])
              }
              dispatch(bookmarks_actions.set_is_upserting(false))
              toast.success(params.dictionary.library.bookmark_updated)
            }
          : undefined
      }
      links={bookmark.links.map((link) => ({
        url: link.url,
        saves: link.saves,
        site_path: link.site_path,
        is_pinned: link.is_pinned,
        via_wayback: link.via_wayback,
        menu_slot: !username ? (
          <UiAppAtom_DropdownMenu
            items={[
              {
                label: link.is_pinned
                  ? params.dictionary.library.unpin_from_top
                  : params.dictionary.library.pin_on_top,
                on_click: async () => {
                  const is_pinned = !link.is_pinned
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const { db, bookmarks_just_tags } = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
                  const modified_bookmark: UpsertBookmark_Params = {
                    bookmark_id: bookmark.id,
                    is_public: bookmark.is_public,
                    created_at: new Date(bookmark.created_at),
                    title: bookmark.title,
                    note: bookmark.note,
                    is_archived: is_archived_filter,
                    is_unread: bookmark.is_unread,
                    stars: bookmark.stars,
                    links: bookmark.links.map((l) => ({
                      url: l.url,
                      site_path: l.site_path,
                      is_public: l.is_public,
                      is_pinned: link.url == l.url ? is_pinned : l.is_pinned,
                      pin_title: l.pin_title,
                      pin_order: l.pin_order,
                      via_wayback: l.via_wayback,
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
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: ky_instance,
                    }),
                  )
                  await search_hook.update_bookmark({
                    db,
                    bookmarks_just_tags,
                    is_archived: is_archived_filter,
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
                        is_public: link.is_public,
                      })),
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(
                    is_pinned
                      ? params.dictionary.library.link_is_now_pinned
                      : params.dictionary.library.pin_has_been_removed,
                  )
                },
                other_icon: <UiCommonParticles_Icon variant="PIN" />,
              },
              link.via_wayback
                ? {
                    label: 'Open original',
                    other_icon: <UiCommonParticles_Icon variant="LINK" />,
                    on_click: async () => {
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
                    },
                  }
                : {
                    label: 'Open snapshot',
                    other_icon: <UiCommonParticles_Icon variant="LINK" />,
                    on_click: async () => {
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
                    },
                  },
              {
                label: params.dictionary.library.via_archive_org,
                is_checked: link.via_wayback || false,
                on_click: async () => {
                  const via_wayback = !link.via_wayback
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const { db, bookmarks_just_tags } = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
                  const modified_bookmark: UpsertBookmark_Params = {
                    bookmark_id: bookmark.id,
                    is_public: bookmark.is_public,
                    created_at: new Date(bookmark.created_at),
                    title: bookmark.title,
                    note: bookmark.note,
                    is_archived: is_archived_filter,
                    is_unread: bookmark.is_unread,
                    stars: bookmark.stars,
                    links: bookmark.links.map((l) => ({
                      url: l.url,
                      site_path: l.site_path,
                      is_public: l.is_public,
                      is_pinned: l.is_pinned,
                      pin_title: l.pin_title,
                      pin_order: l.pin_order,
                      via_wayback:
                        link.url == l.url ? via_wayback : l.via_wayback,
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
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: ky_instance,
                    }),
                  )
                  await search_hook.update_bookmark({
                    db,
                    bookmarks_just_tags,
                    is_archived: is_archived_filter,
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
                        is_public: link.is_public,
                      })),
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(
                    via_wayback
                      ? params.dictionary.library.use_snapshot
                      : params.dictionary.library.use_original,
                  )
                },
              },
            ]}
          />
        ) : (
          <UiAppAtom_DropdownMenu
            items={[
              link.via_wayback
                ? {
                    label: 'Open original',
                    other_icon: <UiCommonParticles_Icon variant="LINK" />,
                    on_click: async () => {
                      window.onbeforeunload = null
                      location.href = link.url
                    },
                  }
                : {
                    label: 'Open snapshot',
                    other_icon: <UiCommonParticles_Icon variant="LINK" />,
                    on_click: async () => {
                      window.onbeforeunload = null
                      location.href = url_to_wayback({
                        date: new Date(bookmark.created_at),
                        url: link.url,
                      })
                    },
                  },
            ]}
          />
        ),
      }))}
      menu_slot={
        !username ? (
          <UiAppAtom_DropdownMenu
            items={[
              {
                label: 'Mark as unread',
                is_checked: bookmark.is_unread,
                on_click: async () => {
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const { db, bookmarks_just_tags } = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
                  const is_unread = !bookmark.is_unread
                  const modified_bookmark: UpsertBookmark_Params = {
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
                      is_pinned: link.is_pinned,
                      pin_title: link.pin_title,
                      pin_order: link.pin_order,
                      via_wayback: link.via_wayback,
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
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: ky_instance,
                    }),
                  )
                  if (
                    search_hook.count &&
                    (filter_view_options_hook.current_filter == Filter.UNREAD ||
                      filter_view_options_hook.current_filter ==
                        Filter.STARRED_UNREAD ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED_UNREAD) &&
                    bookmark.is_unread
                  ) {
                    search_hook.set_count(search_hook.count! - 1)
                  }
                  await search_hook.update_bookmark({
                    db,
                    bookmarks_just_tags,
                    is_archived: is_archived_filter,
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
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  await tag_hierarchies_hook.get_tag_hierarchies({
                    filter: filter_view_options_hook.current_filter,
                    gte: date_view_options_hook.current_gte,
                    lte: date_view_options_hook.current_lte,
                  })
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(params.dictionary.library.bookmark_updated)
                },
              },
              {
                label: <UiAppAtom_StarsForDropdown stars={1} />,
                is_checked: bookmark.stars == 1,
                on_click: async () => {
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const { db, bookmarks_just_tags } = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
                  const modified_bookmark: UpsertBookmark_Params = {
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
                      is_pinned: link.is_pinned,
                      pin_title: link.pin_title,
                      pin_order: link.pin_order,
                      via_wayback: link.via_wayback,
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
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: ky_instance,
                    }),
                  )
                  await search_hook.update_bookmark({
                    db,
                    bookmarks_just_tags,
                    is_archived: is_archived_filter,
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
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  await tag_hierarchies_hook.get_tag_hierarchies({
                    filter: filter_view_options_hook.current_filter,
                    gte: date_view_options_hook.current_gte,
                    lte: date_view_options_hook.current_lte,
                  })
                  if (
                    search_hook.count &&
                    (filter_view_options_hook.current_filter ==
                      Filter.STARRED ||
                      filter_view_options_hook.current_filter ==
                        Filter.STARRED_UNREAD ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED_UNREAD) &&
                    bookmark.stars == 1
                  ) {
                    search_hook.set_count(search_hook.count - 1)
                  }
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(params.dictionary.library.bookmark_updated)
                },
              },
              {
                label: <UiAppAtom_StarsForDropdown stars={2} />,
                is_checked: bookmark.stars == 2,
                on_click: async () => {
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const { db, bookmarks_just_tags } = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
                  const modified_bookmark: UpsertBookmark_Params = {
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
                      is_pinned: link.is_pinned,
                      pin_title: link.pin_title,
                      pin_order: link.pin_order,
                      via_wayback: link.via_wayback,
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
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: ky_instance,
                    }),
                  )
                  await search_hook.update_bookmark({
                    db,
                    bookmarks_just_tags,
                    is_archived: is_archived_filter,
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
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  await tag_hierarchies_hook.get_tag_hierarchies({
                    filter: filter_view_options_hook.current_filter,
                    gte: date_view_options_hook.current_gte,
                    lte: date_view_options_hook.current_lte,
                  })
                  if (
                    search_hook.count &&
                    (filter_view_options_hook.current_filter ==
                      Filter.STARRED ||
                      filter_view_options_hook.current_filter ==
                        Filter.STARRED_UNREAD ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED_UNREAD) &&
                    bookmark.stars == 2
                  ) {
                    search_hook.set_count(search_hook.count - 1)
                  }
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(params.dictionary.library.bookmark_updated)
                },
              },
              {
                label: <UiAppAtom_StarsForDropdown stars={3} />,
                is_checked: bookmark.stars == 3,
                on_click: async () => {
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const { db, bookmarks_just_tags } = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
                  const modified_bookmark: UpsertBookmark_Params = {
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
                      is_pinned: link.is_pinned,
                      pin_title: link.pin_title,
                      pin_order: link.pin_order,
                      via_wayback: link.via_wayback,
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
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: ky_instance,
                    }),
                  )
                  await search_hook.update_bookmark({
                    db,
                    bookmarks_just_tags,
                    is_archived: is_archived_filter,
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
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  await tag_hierarchies_hook.get_tag_hierarchies({
                    filter: filter_view_options_hook.current_filter,
                    gte: date_view_options_hook.current_gte,
                    lte: date_view_options_hook.current_lte,
                  })
                  if (
                    search_hook.count &&
                    (filter_view_options_hook.current_filter ==
                      Filter.STARRED ||
                      filter_view_options_hook.current_filter ==
                        Filter.STARRED_UNREAD ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED_UNREAD) &&
                    bookmark.stars == 3
                  ) {
                    search_hook.set_count(search_hook.count - 1)
                  }
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(params.dictionary.library.bookmark_updated)
                },
              },
              {
                label: <UiAppAtom_StarsForDropdown stars={4} />,
                is_checked: bookmark.stars == 4,
                on_click: async () => {
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const { db, bookmarks_just_tags } = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
                  const modified_bookmark: UpsertBookmark_Params = {
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
                      is_pinned: link.is_pinned,
                      pin_title: link.pin_title,
                      pin_order: link.pin_order,
                      via_wayback: link.via_wayback,
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
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: ky_instance,
                    }),
                  )
                  await search_hook.update_bookmark({
                    db,
                    bookmarks_just_tags,
                    is_archived: is_archived_filter,
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
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  await tag_hierarchies_hook.get_tag_hierarchies({
                    filter: filter_view_options_hook.current_filter,
                    gte: date_view_options_hook.current_gte,
                    lte: date_view_options_hook.current_lte,
                  })
                  if (
                    search_hook.count &&
                    (filter_view_options_hook.current_filter ==
                      Filter.STARRED ||
                      filter_view_options_hook.current_filter ==
                        Filter.STARRED_UNREAD ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED_UNREAD) &&
                    bookmark.stars == 4
                  ) {
                    search_hook.set_count(search_hook.count - 1)
                  }
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(params.dictionary.library.bookmark_updated)
                },
              },
              {
                label: <UiAppAtom_StarsForDropdown stars={5} />,
                is_checked: bookmark.stars == 5,
                on_click: async () => {
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const { db, bookmarks_just_tags } = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
                  const modified_bookmark: UpsertBookmark_Params = {
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
                      is_pinned: link.is_pinned,
                      pin_title: link.pin_title,
                      pin_order: link.pin_order,
                      via_wayback: link.via_wayback,
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
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: ky_instance,
                    }),
                  )
                  await search_hook.update_bookmark({
                    db,
                    bookmarks_just_tags,
                    is_archived: is_archived_filter,
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
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  await tag_hierarchies_hook.get_tag_hierarchies({
                    filter: filter_view_options_hook.current_filter,
                    gte: date_view_options_hook.current_gte,
                    lte: date_view_options_hook.current_lte,
                  })
                  if (
                    search_hook.count &&
                    (filter_view_options_hook.current_filter ==
                      Filter.STARRED ||
                      filter_view_options_hook.current_filter ==
                        Filter.STARRED_UNREAD ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED ||
                      filter_view_options_hook.current_filter ==
                        Filter.ARCHIVED_STARRED_UNREAD) &&
                    bookmark.stars == 5
                  ) {
                    search_hook.set_count(search_hook.count - 1)
                  }
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(params.dictionary.library.bookmark_updated)
                },
              },
              {
                label: 'Edit',
                on_click: async () => {
                  const modified_bookmark = await upsert_bookmark_modal({
                    modal_context,
                    bookmark,
                    is_archived: is_archived_filter,
                  })
                  if (!modified_bookmark) {
                    dispatch(bookmarks_actions.set_is_upserting(false))
                    modal_context?.set_modal()
                    return
                  }
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const { db, bookmarks_just_tags } = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
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
                      ky: ky_instance,
                    }),
                  )
                  const updated_tag_ids = updated_bookmark.tags.map((t) => t.id)
                  if (
                    !tag_view_options_hook.selected_tags.every((t) =>
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
                    tag_view_options_hook.selected_tags.filter((t) => {
                      const yields = Object.entries(counts_hook.tags!).find(
                        (tag) => parseInt(tag[0]) == t,
                      )![1].yields
                      return !updated_tag_ids.includes(t) && yields == 1
                    })

                  if (tags_to_remove_from_search_params.length) {
                    dispatch(bookmarks_actions.set_bookmarks([]))
                    dispatch(
                      bookmarks_actions.set_is_fetching_first_bookmarks(true),
                    )
                    tag_view_options_hook.remove_tags_from_search_params(
                      tags_to_remove_from_search_params,
                    )
                  }
                  await tag_hierarchies_hook.get_tag_hierarchies({
                    filter: filter_view_options_hook.current_filter,
                    gte: date_view_options_hook.current_gte,
                    lte: date_view_options_hook.current_lte,
                  })
                  await search_hook.update_bookmark({
                    db,
                    bookmarks_just_tags,
                    is_archived: is_archived_filter,
                    bookmark: {
                      id: bookmark.id,
                      is_archived: is_archived_filter,
                      is_unread: updated_bookmark.is_unread,
                      title: updated_bookmark.title,
                      note: updated_bookmark.note,
                      tags: updated_bookmark.tags.map((tag) => tag.name),
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
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  modal_context?.set_modal()
                  toast.success(params.dictionary.library.bookmark_updated)
                },
                other_icon: <UiCommonParticles_Icon variant="EDIT" />,
              },
              {
                label: !(
                  filter_view_options_hook.current_filter == Filter.ARCHIVED ||
                  filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED ||
                  filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_UNREAD ||
                  filter_view_options_hook.current_filter ==
                    Filter.ARCHIVED_STARRED_UNREAD
                )
                  ? 'Archive'
                  : 'Restore',
                other_icon: <UiCommonParticles_Icon variant="ARCHIVE" />,
                on_click: async () => {
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const init_data = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
                  const archived_init_data = await search_hook.init({
                    is_archived: !is_archived_filter,
                  })
                  const modified_bookmark: UpsertBookmark_Params = {
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
                      is_pinned: link.is_pinned,
                      pin_title: link.pin_title,
                      pin_order: link.pin_order,
                      via_wayback: link.via_wayback,
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
                        JSON.parse(
                          sessionStorage.getItem(
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      ky: ky_instance,
                    }),
                  )
                  await search_hook.update_bookmark({
                    db: init_data.db,
                    bookmarks_just_tags: init_data.bookmarks_just_tags,
                    is_archived: false,
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
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  await search_hook.update_bookmark({
                    db: archived_init_data.db,
                    bookmarks_just_tags: archived_init_data.bookmarks_just_tags,
                    is_archived: true,
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
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
                  })
                  await tag_hierarchies_hook.get_tag_hierarchies({
                    filter: filter_view_options_hook.current_filter,
                    gte: date_view_options_hook.current_gte,
                    lte: date_view_options_hook.current_lte,
                  })
                  if (search_hook.count) {
                    search_hook.set_count(search_hook.count - 1)
                  }
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success(
                    `Bookmark has been ${
                      is_archived_filter ? 'restored' : 'archived'
                    }`,
                  )
                  if (
                    bookmarks_hook.bookmarks &&
                    bookmarks_hook.bookmarks.length == 1 &&
                    bookmarks_hook.showing_bookmarks_fetched_by_ids
                  ) {
                    search_hook.reset()
                  }
                },
              },
              {
                label: 'Delete',
                on_click: async () => {
                  dispatch(bookmarks_actions.set_is_upserting(true))
                  const { db, bookmarks_just_tags } = await search_hook.init({
                    is_archived: is_archived_filter,
                  })
                  await dispatch(
                    bookmarks_actions.delete_bookmark({
                      last_authorized_counts_params:
                        JSON.parse(
                          sessionStorage.getItem(
                            browser_storage.session_storage.library
                              .last_authorized_counts_params,
                          ) || 'null',
                        ) || undefined,
                      bookmark_id: bookmark.id,
                      ky: ky_instance,
                    }),
                  )
                  await search_hook.delete_bookmark({
                    db,
                    bookmarks_just_tags,
                    is_archived: is_archived_filter,
                    bookmark_id: bookmark.id,
                  })
                  await tag_hierarchies_hook.get_tag_hierarchies({
                    filter: filter_view_options_hook.current_filter,
                    gte: date_view_options_hook.current_gte,
                    lte: date_view_options_hook.current_lte,
                  })
                  if (search_hook.count) {
                    search_hook.set_count(search_hook.count - 1)
                  }
                  dispatch(bookmarks_actions.set_is_upserting(false))
                  toast.success('Bookmark has been deleted')
                },
                other_icon: <UiCommonParticles_Icon variant="DELETE" />,
              },
            ]}
          />
        ) : (
          <UiAppAtom_DropdownMenu
            items={[
              {
                label: 'Copy to mine',
                on_click: () => {},
                other_icon: <UiCommonParticles_Icon variant="COPY" />,
              },
            ]}
          />
        )
      }
      highlights={search_hook.highlights?.[bookmark.id.toString()]}
      highlights_site_variants={search_hook.highlights_sites_variants}
      orama_db_id={
        is_archived_filter
          ? search_hook.archived_db?.id || ''
          : search_hook.db?.id || ''
      }
      should_dim_visited_links={username !== undefined}
      // It's important to wait until filter is set to search hook's state
      current_filter={search_hook.current_filter}
    />
  ))

  return (
    <>
      <UiAppAtom_DraggedCursorTag
        tag_name={tag_view_options_hook.dragged_tag?.name}
      />
      <UiAppTemplate_Library
        translations={{
          collapse_alt: dictionary.library.collapse_sidebar,
          follow: dictionary.library.follow,
          unfollow: dictionary.library.unfollow,
        }}
        is_following={undefined}
        welcome_text={
          !username
            ? `${params.dictionary.library.welcome}, username`
            : undefined
        }
        on_follow_click={username ? () => {} : undefined}
        show_skeletons={show_skeletons}
        close_aside_count={close_aside_count}
        mobile_title_bar={'Bookmarks'}
        slot_search={slot_search}
        slot_toolbar={slot_toolbar}
        slot_tag_hierarchies={slot_tag_hierarchies}
        slot_aside={slot_aside}
        are_bookmarks_dimmed={
          bookmarks_hook.is_fetching_first_bookmarks ||
          bookmarks_hook.is_upserting ||
          false
        }
        is_interactive={
          !(
            bookmarks_hook.is_fetching_first_bookmarks ||
            bookmarks_hook.is_fetching_more_bookmarks ||
            search_hook.is_initializing
          )
        }
        slot_pinned={
          pinned_hook.items &&
          pinned_hook.items.length > 0 && (
            <div
              style={{
                display:
                  !bookmarks_hook.first_bookmarks_fetched_at_timestamp ||
                  bookmarks_hook.showing_bookmarks_fetched_by_ids
                    ? 'none'
                    : undefined,
              }}
            >
              {slot_pinned}
            </div>
          )
        }
        slot_bookmarks={slot_bookmarks}
        on_page_bottom_reached={() => {
          if (bookmarks_hook.is_fetching || !bookmarks_hook.bookmarks?.length)
            return
          if (!search_hook.search_string && bookmarks_hook.has_more_bookmarks) {
            bookmarks_hook.get_bookmarks({ should_get_next_page: true })
          } else if (
            search_hook.search_string &&
            search_hook.count &&
            bookmarks_hook.bookmarks &&
            bookmarks_hook.bookmarks.length &&
            bookmarks_hook.bookmarks.length < search_hook.count
          ) {
            bookmarks_hook.get_bookmarks_by_ids({
              all_not_paginated_ids: search_hook.result!.hits.map((hit) =>
                parseInt(hit.document.id),
              ),
              should_get_next_page: true,
            })
          }
        }}
        clear_selected_tags={
          !bookmarks_hook.is_fetching_first_bookmarks &&
          !search_hook.result &&
          (!bookmarks_hook.bookmarks || bookmarks_hook.bookmarks.length == 0) &&
          tag_view_options_hook.selected_tags.length
            ? tag_view_options_hook.clear_selected_tags
            : undefined
        }
        clear_date_range={
          !bookmarks_hook.is_fetching_first_bookmarks &&
          !search_hook.result &&
          (!bookmarks_hook.bookmarks || bookmarks_hook.bookmarks.length == 0) &&
          (date_view_options_hook.current_gte ||
            date_view_options_hook.current_lte)
            ? date_view_options_hook.clear_gte_lte_search_params
            : undefined
        }
        info_text={
          bookmarks_hook.is_fetching_first_bookmarks ||
          bookmarks_hook.is_fetching_more_bookmarks
            ? 'Loading...'
            : (!search_hook.search_string.length &&
                !bookmarks_hook.is_fetching_first_bookmarks &&
                (!bookmarks_hook.bookmarks ||
                  bookmarks_hook.bookmarks.length == 0)) ||
              (search_hook.search_string.length &&
                (!bookmarks_hook.bookmarks ||
                  bookmarks_hook.bookmarks.length == 0))
            ? 'No results'
            : !bookmarks_hook.has_more_bookmarks ||
              bookmarks_hook.bookmarks?.length == search_hook.count
            ? 'End of results'
            : ''
        }
      />
    </>
  )
}

export default Library
