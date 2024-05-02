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
import { use_search } from '@/hooks/library/use-search'
import { ModalContext } from '../../providers/modal-provider'
import { useParams, useSearchParams } from 'next/navigation'
import { upsert_bookmark_modal } from '@/modals/upsert-bookmark-modal'
import { toast } from 'react-toastify'
import { CustomRangeSkeleton as UiAppAtom_CustomRangeSkeleton } from '@web-ui/components/app/atoms/custom-range-skeleton'
import { SwipableColumns as UiAppTemplate_SwipableColumns } from '@web-ui/components/app/templates/swipable-columns'
import { LibrarySearch as UiAppAtom_LibrarySearch } from '@web-ui/components/app/atoms/library-search'
import { LibraryAside as UiAppTemplate_LibraryAside } from '@web-ui/components/app/templates/library-aside'
import { DropdownMenu as UiAppAtom_DropdownMenu } from '@web-ui/components/app/atoms/dropdown-menu'
import { SelectedTags as UiAppAtom_SelectedTags } from '@web-ui/components/app/atoms/selected-tags'
import { Tags as UiAppAtom_Tags } from '@web-ui/components/app/atoms/tags'
import { TagsSkeleton as UiAppAtom_TagsSkeleton } from '@web-ui/components/app/atoms/tags-skeleton'
import { SegmentedButtonsSkeleton as UiAppAtom_SegmentedButtonsSkeleton } from '@web-ui/components/app/atoms/segmented-buttons-skeleton'
import { StarsForDropdown as UiAppAtom_StarsForDropdown } from '@web-ui/components/app/atoms/stars-for-dropdown'
import { Pinned as UiAppAtom_Pinned } from '@web-ui/components/app/atoms/pinned'
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
import { search_params_keys } from '@/constants/search-params-keys'
import { counts_actions } from '@repositories/stores/library/counts/counts.slice'
import { use_popstate_count } from '@/hooks/misc/pop-state-count'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { RecordVisit_UseCase } from '@repositories/modules/bookmarks/domain/usecases/record-visit.use-case'
import { BookmarkWrapper as UiAppAtom_BookmarkWrapper } from '@web-ui/components/app/atoms/bookmark-wrapper'
import { SegmentedButton as UiAppAtom_SegmentedButton } from '@web-ui/components/app/atoms/segmented-button'
import { use_is_hydrated } from '@shared/hooks'
// import { find_tag_modal } from '@/modals/find-tag-modal'

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
  const popstate_count = use_popstate_count()
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
  // START - UI synchronization.
  const [library_updated_at_timestamp, set_library_updated_at_timestamp] =
    useState<number>()
  const [is_pinned_stale, set_is_pinned_stale] = useState<boolean>()
  const [pinned_updated_at, set_pinned_updated_at] = useState<number>()
  const [is_fetching_first_bookmarks, set_is_fetching_first_bookmarks] =
    useState<boolean>()
  // END - UI synchronization.
  const pinned_count = useRef<number>()

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
      !bookmarks_hook.is_fetching_first_bookmarks &&
      !bookmarks_hook.is_upserting &&
      !counts_hook.is_fetching &&
      !counts_hook.should_refetch &&
      !tag_hierarchies_hook.is_fetching &&
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
      set_pinned_count()
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
    pinned_hook.is_fetching,
    pinned_hook.should_refetch,
    // Bookmark menu items must see new db instances.
    search_hook.db_updated_at_timestamp,
    search_hook.archived_db_updated_at_timestamp,
  ])

  const set_pinned_count = () => {
    let count = 0
    pinned_hook.items?.map((item) => {
      const created_at_timestamp = Math.round(
        new Date(item.created_at).getTime() / 1000,
      )
      let is_relevant = true
      // check if item includes every selected tags
      if (
        (is_archived_filter && !item.is_archived) ||
        (!is_archived_filter && item.is_archived)
      ) {
        is_relevant = false
      } else if (
        (filter_view_options_hook.current_filter == Filter.STARRED ||
          filter_view_options_hook.current_filter == Filter.STARRED_UNREAD) &&
        !item.stars
      ) {
        is_relevant = false
      } else if (
        (filter_view_options_hook.current_filter == Filter.UNREAD ||
          filter_view_options_hook.current_filter == Filter.STARRED_UNREAD) &&
        !item.is_unread
      ) {
        is_relevant = false
      } else if (
        item.tags &&
        !tag_view_options_hook.selected_tags.every((t) =>
          item.tags!.includes(t),
        )
      ) {
        is_relevant = false
      } else if (
        date_view_options_hook.current_gte &&
        date_view_options_hook.current_lte &&
        (created_at_timestamp <
          new Date(
            parseInt(
              date_view_options_hook.current_gte.toString().substring(0, 4),
            ),
            parseInt(
              date_view_options_hook.current_gte.toString().substring(4, 6),
            ) - 1,
          ).getTime() /
            1000 ||
          created_at_timestamp >
            new Date(
              parseInt(
                date_view_options_hook.current_lte.toString().substring(0, 4),
              ),
              parseInt(
                date_view_options_hook.current_lte.toString().substring(4, 6),
              ),
            ).getTime() /
              1000 -
              1)
      ) {
        is_relevant = false
      }
      if (is_relevant) count++
    })
    pinned_count.current = count
  }

  // This prevents layout shift in loading state during setting pinned status on a link.
  useUpdateEffect(() => {
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
        tag_hierarchies_hook.get_tag_hierarchies({
          filter: filter_view_options_hook.current_filter,
          gte: date_view_options_hook.current_gte,
          lte: date_view_options_hook.current_lte,
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
            ky: ky_instance,
          }),
        ),
      ]).then(() => {
        modal_context?.set_modal()
      })
    } else {
      // User is on results not relevant to newly added bookmark (e.g. some other tags).
      modal_context?.set_modal()
    }
  }, [bookmarks_hook.is_fetching_first_bookmarks])

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
  const search_cache_to_be_cleared = useRef(false)
  useUpdateEffect(() => {
    if (
      sort_by_view_options_hook.current_sort_by == SortBy.VISITED_AT ||
      sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
    ) {
      search_cache_to_be_cleared.current = true
    } else {
      search_cache_to_be_cleared.current = false
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

  const is_archived_filter =
    filter_view_options_hook.current_filter == Filter.ARCHIVED ||
    filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED ||
    filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED_UNREAD ||
    filter_view_options_hook.current_filter == Filter.ARCHIVED_UNREAD

  const is_not_interactive =
    is_fetching_first_bookmarks ||
    bookmarks_hook.is_fetching_more_bookmarks ||
    search_hook.is_initializing

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

          if (search_cache_to_be_cleared.current) {
            await search_hook.init({
              is_archived: is_archived_filter,
              force_reinitialization: true,
            })
            search_cache_to_be_cleared.current = false
          } else {
            await search_hook.init({
              is_archived: is_archived_filter,
            })
          }

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
              is_fetching_first_bookmarks ||
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
                    is_fetching_first_bookmarks ||
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
              is_fetching_first_bookmarks ||
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
  const slot_pinned = (
    <UiAppAtom_Pinned
      key={`${pinned_updated_at}-${popstate_count}`}
      library_updated_at_timestamp={library_updated_at_timestamp}
      favicon_host={favicon_host}
      translations={{
        nothing_pinned: params.dictionary.library.nothing_pinned,
      }}
      items={
        pinned_hook.items?.map((item) => ({
          bookmark_id: item.bookmark_id,
          url: item.url,
          created_at: new Date(item.created_at),
          title: item.title,
          is_unread: item.is_unread,
          is_archived: item.is_archived,
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
      on_click={async (item) => {
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
        await search_hook.cache_data()
        window.onbeforeunload = null
        const url = item.via_wayback
          ? url_to_wayback({ date: item.created_at, url: item.url })
          : item.url
        setTimeout(() => {
          location.href = url
        }, 0)
      }}
      on_middle_click={(item) => {
        if (!username) {
          const data_source = new Bookmarks_DataSourceImpl(ky_instance)
          const repository = new Bookmarks_RepositoryImpl(data_source)
          const record_visit = new RecordVisit_UseCase(repository)
          record_visit.invoke({
            bookmark_id: item.bookmark_id,
            visited_at: new Date().toISOString(),
          })
        }
      }}
      selected_tags={tag_view_options_hook.selected_tags}
      selected_starred={
        filter_view_options_hook.current_filter == Filter.STARRED ||
        filter_view_options_hook.current_filter == Filter.STARRED_UNREAD ||
        filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED ||
        filter_view_options_hook.current_filter ==
          Filter.ARCHIVED_STARRED_UNREAD
      }
      selected_unread={
        filter_view_options_hook.current_filter == Filter.UNREAD ||
        filter_view_options_hook.current_filter == Filter.STARRED_UNREAD ||
        filter_view_options_hook.current_filter == Filter.ARCHIVED_UNREAD ||
        filter_view_options_hook.current_filter ==
          Filter.ARCHIVED_STARRED_UNREAD
      }
      selected_archived={is_archived_filter}
      current_gte={date_view_options_hook.current_gte}
      current_lte={date_view_options_hook.current_lte}
    />
  )
  const slot_tag_hierarchies = (
    <div style={{ pointerEvents: is_not_interactive ? 'none' : undefined }}>
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
        }}
        library_url={username ? `/${username}` : '/bookmarks'}
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
        }}
        translations={{
          all_bookmarks: params.dictionary.library.all_bookmarks,
          drag_here: params.dictionary.library.drag_tag_here,
        }}
      />
    </div>
  )
  const slot_aside = (
    <UiAppTemplate_LibraryAside
      feedback_label={params.dictionary.library.send_feedback}
      on_feedback_click={() => {}}
      slot_segmented_buttons={
        is_hydrated ? (
          <>
            <UiAppAtom_SegmentedButton
              key={`1-${popstate_count}`}
              is_not_interactive={is_not_interactive}
              items={[
                {
                  label: params.dictionary.library.sort_by_options.date,
                  is_selected:
                    sort_by_view_options_hook.current_sort_by !=
                    SortBy.POPULARITY,
                },
                {
                  label: params.dictionary.library.sort_by_options.the_huggiest,
                  is_selected:
                    sort_by_view_options_hook.current_sort_by ==
                    SortBy.POPULARITY,
                },
              ]}
              on_item_click={(option_idx) => {
                if (
                  option_idx == 0 &&
                  sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
                ) {
                  sort_by_view_options_hook.set_sort_by_query_param(
                    SortBy.CREATED_AT,
                  )
                } else if (option_idx == 1) {
                  sort_by_view_options_hook.set_sort_by_query_param(
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
                  sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
                }
                items={[
                  {
                    label: params.dictionary.library.sort_by_options.created,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.CREATED_AT,
                  },
                  {
                    label: params.dictionary.library.sort_by_options.visited,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.VISITED_AT,
                  },
                  {
                    label: params.dictionary.library.sort_by_options.updated,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.UPDATED_AT,
                  },
                ]}
                on_item_click={(option_idx) => {
                  if (option_idx == 0) {
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.CREATED_AT,
                    )
                  } else if (option_idx == 1) {
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.VISITED_AT,
                    )
                  } else if (option_idx == 2) {
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.UPDATED_AT,
                    )
                  }
                }}
              />
            ) : (
              <UiAppAtom_SegmentedButton
                key={`2-${popstate_count}`}
                is_not_interactive={is_not_interactive}
                is_disabled={
                  sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
                }
                items={[
                  {
                    label: params.dictionary.library.sort_by_options.created,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.CREATED_AT,
                  },
                  {
                    label: params.dictionary.library.sort_by_options.updated,
                    is_selected:
                      sort_by_view_options_hook.current_sort_by ==
                      SortBy.UPDATED_AT,
                  },
                ]}
                on_item_click={(option_idx) => {
                  if (option_idx == 0) {
                    sort_by_view_options_hook.set_sort_by_query_param(
                      SortBy.CREATED_AT,
                    )
                  } else if (option_idx == 1) {
                    sort_by_view_options_hook.set_sort_by_query_param(
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
                sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
              }
              items={[
                {
                  label: 'Newest',
                  is_selected:
                    order_view_options_hook.current_order == Order.DESC,
                },
                {
                  label: 'Oldest',
                  is_selected:
                    order_view_options_hook.current_order == Order.ASC,
                },
              ]}
              on_item_click={(option_idx) => {
                if (option_idx == 0) {
                  order_view_options_hook.set_order_query_param(Order.DESC)
                } else if (option_idx == 1) {
                  order_view_options_hook.set_order_query_param(Order.ASC)
                }
              }}
            />
          </>
        ) : (
          <UiAppAtom_SegmentedButtonsSkeleton />
        )
      }
      slot_custom_range={
        !show_skeletons ? (
          <div
            style={{
              pointerEvents: is_fetching_first_bookmarks ? 'none' : undefined,
            }}
          >
            <CustomRange
              library_updated_at_timestamp={library_updated_at_timestamp}
              counts={counts_hook.months || undefined}
              on_yyyymm_change={
                date_view_options_hook.set_gte_lte_search_params
              }
              clear_date_range={
                date_view_options_hook.clear_gte_lte_search_params
              }
              current_gte={date_view_options_hook.current_gte}
              current_lte={date_view_options_hook.current_lte}
              selected_tags={tag_view_options_hook.selected_tags}
              is_range_selector_disabled={
                sort_by_view_options_hook.current_sort_by ==
                  SortBy.UPDATED_AT ||
                sort_by_view_options_hook.current_sort_by ==
                  SortBy.VISITED_AT ||
                sort_by_view_options_hook.current_sort_by == SortBy.POPULARITY
              }
            />
          </div>
        ) : (
          <UiAppAtom_CustomRangeSkeleton />
        )
      }
      slot_tags={
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
                key={`tags-${library_updated_at_timestamp}-${popstate_count}`}
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
  const slot_bookmarks = bookmarks_hook.bookmarks?.map((bookmark, i) => (
    <UiAppAtom_BookmarkWrapper
      key={`${bookmark.id}-${i}-${library_updated_at_timestamp}-${popstate_count}`}
      index={i}
      created_at={new Date(bookmark.created_at)}
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
      points_given={points_hook.points_given[bookmark.id]}
      points={bookmark.points}
      on_get_points_given_click={() => {
        points_hook.get_points_given_on_bookmark({ bookmark_id: bookmark.id })
      }}
      on_give_point_click={(points: number) => {
        points_hook.give_points({ bookmark_id: bookmark.id, points })
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
              const is_selected = is_fetching_first_bookmarks
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
      on_link_click={async (url) => {
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
        await search_hook.cache_data()
        window.onbeforeunload = null
        // Timeout is there so updated by cache_data values of search_data_awaits_caching,
        // archived_search_data_awaits_caching can be seen by "beforeunload" event handler.
        setTimeout(() => {
          location.href = url
        }, 0)
      }}
      on_link_middle_click={() => {
        if (!username) {
          const data_source = new Bookmarks_DataSourceImpl(ky_instance)
          const repository = new Bookmarks_RepositoryImpl(data_source)
          const record_visit = new RecordVisit_UseCase(repository)
          record_visit.invoke({
            bookmark_id: bookmark.id,
            visited_at: new Date().toISOString(),
          })
        }
      }}
      on_new_tab_link_click={(url) => {
        if (!username) {
          const data_source = new Bookmarks_DataSourceImpl(ky_instance)
          const repository = new Bookmarks_RepositoryImpl(data_source)
          const record_visit = new RecordVisit_UseCase(repository)
          record_visit.invoke({
            bookmark_id: bookmark.id,
            visited_at: new Date().toISOString(),
          })
        }
        window.open(url, '_blank')
      }}
      favicon_host={favicon_host}
      // We pass dragged tag so on_mouse_up has access to current state (memoized component is refreshed).
      dragged_tag={tag_view_options_hook.dragged_tag}
      on_mouse_up={async () => {
        if (!tag_view_options_hook.dragged_tag) return
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
            get_tag_hierarchies_request_params:
              tag_hierarchies_hook.get_authorized_request_params({
                filter: filter_view_options_hook.current_filter,
                gte: date_view_options_hook.current_gte,
                lte: date_view_options_hook.current_lte,
              }),
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
                  get_tag_hierarchies_request_params:
                    tag_hierarchies_hook.get_authorized_request_params({
                      filter: filter_view_options_hook.current_filter,
                      gte: date_view_options_hook.current_gte,
                      lte: date_view_options_hook.current_lte,
                    }),
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
              if (
                tag_view_options_hook.selected_tags.includes(tag_id) &&
                counts_hook.tags![tag_id].yields == 1
              ) {
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
                  ? params.dictionary.library.unpin
                  : params.dictionary.library.pin,
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
                    label: 'Open original URL',
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
                    label: 'Open original URL',
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
                      get_tag_hierarchies_request_params:
                        tag_hierarchies_hook.get_authorized_request_params({
                          filter: filter_view_options_hook.current_filter,
                          gte: date_view_options_hook.current_gte,
                          lte: date_view_options_hook.current_lte,
                        }),
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
                      })),
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
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
                      get_tag_hierarchies_request_params:
                        tag_hierarchies_hook.get_authorized_request_params({
                          filter: filter_view_options_hook.current_filter,
                          gte: date_view_options_hook.current_gte,
                          lte: date_view_options_hook.current_lte,
                        }),
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
                      })),
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
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
                      get_tag_hierarchies_request_params:
                        tag_hierarchies_hook.get_authorized_request_params({
                          filter: filter_view_options_hook.current_filter,
                          gte: date_view_options_hook.current_gte,
                          lte: date_view_options_hook.current_lte,
                        }),
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
                      get_tag_hierarchies_request_params:
                        tag_hierarchies_hook.get_authorized_request_params({
                          filter: filter_view_options_hook.current_filter,
                          gte: date_view_options_hook.current_gte,
                          lte: date_view_options_hook.current_lte,
                        }),
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
                      get_tag_hierarchies_request_params:
                        tag_hierarchies_hook.get_authorized_request_params({
                          filter: filter_view_options_hook.current_filter,
                          gte: date_view_options_hook.current_gte,
                          lte: date_view_options_hook.current_lte,
                        }),
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
                      get_tag_hierarchies_request_params:
                        tag_hierarchies_hook.get_authorized_request_params({
                          filter: filter_view_options_hook.current_filter,
                          gte: date_view_options_hook.current_gte,
                          lte: date_view_options_hook.current_lte,
                        }),
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
              // {
              //   label: 'Add tag',
              //   on_click: async () => {
              //     const tag = await find_tag_modal({
              //       modal_context,
              //       button_label: 'Add',
              //       title: 'Add tag',
              //     })
              //     if (!tag || bookmark.tags.find((t) => t.name == tag.name)) {
              //       modal_context?.set_modal()
              //       return
              //     }
              //     dispatch(bookmarks_actions.set_is_upserting(true))
              //     const { db, bookmarks_just_tags } = await search_hook.init({
              //       is_archived: is_archived_filter,
              //     })
              //     const modified_bookmark: UpsertBookmark_Params = {
              //       bookmark_id: bookmark.id,
              //       is_public: bookmark.is_public,
              //       created_at: new Date(bookmark.created_at),
              //       title: bookmark.title,
              //       note: bookmark.note,
              //       is_archived: is_archived_filter,
              //       is_unread: bookmark.is_unread,
              //       stars: bookmark.stars,
              //       links: bookmark.links.map((link) => ({
              //         url: link.url,
              //         site_path: link.site_path,
              //         is_public: link.is_public,
              //         is_pinned: link.is_pinned,
              //         pin_title: link.pin_title,
              //         via_wayback: link.via_wayback,
              //       })),
              //       tags: [
              //         ...bookmark.tags.map((tag) => ({
              //           name: tag.name,
              //           is_public: tag.is_public,
              //         })),
              //         tag,
              //       ],
              //     }
              //     const updated_bookmark = await dispatch(
              //       bookmarks_actions.upsert_bookmark({
              //         bookmark: modified_bookmark,
              //         last_authorized_counts_params:
              //           JSON.parse(
              //             sessionStorage.getItem(
              //               browser_storage.session_storage.library
              //                 .last_authorized_counts_params,
              //             ) || 'null',
              //           ) || undefined,
              //         ky: ky_instance,
              //       }),
              //     )
              //     await tag_hierarchies_hook.get_tag_hierarchies({
              //       filter: filter_view_options_hook.current_filter,
              //       gte: date_view_options_hook.current_gte,
              //       lte: date_view_options_hook.current_lte,
              //     })
              //     await search_hook.update_bookmark({
              //       db,
              //       bookmarks_just_tags,
              //       is_archived: is_archived_filter,
              //       bookmark: {
              //         id: bookmark.id,
              //         is_archived: is_archived_filter,
              //         is_unread: updated_bookmark.is_unread,
              //         title: updated_bookmark.title,
              //         note: updated_bookmark.note,
              //         tags: updated_bookmark.tags.map((tag) => tag.name),
              //         links: updated_bookmark.links.map((link) => ({
              //           url: link.url,
              //           site_path: link.site_path,
              //         })),
              //         created_at: updated_bookmark.created_at,
              //         visited_at: bookmark.visited_at,
              //         updated_at: updated_bookmark.updated_at,
              //         stars: updated_bookmark.stars,
              //         tag_ids: updated_bookmark.tags.map((tag) => tag.id),
              //       },
              //     })
              //     dispatch(bookmarks_actions.set_is_upserting(false))
              //     modal_context?.set_modal()
              //     toast.success(params.dictionary.library.bookmark_updated)
              //   },
              //   other_icon: <UiCommonParticles_Icon variant="EDIT" />,
              // },
              {
                label: 'Edit',
                on_click: async () => {
                  const modified_bookmark = await upsert_bookmark_modal({
                    modal_context,
                    bookmark,
                    is_archived: is_archived_filter,
                  })
                  if (!modified_bookmark) {
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
                      get_tag_hierarchies_request_params:
                        tag_hierarchies_hook.get_authorized_request_params({
                          filter: filter_view_options_hook.current_filter,
                          gte: date_view_options_hook.current_gte,
                          lte: date_view_options_hook.current_lte,
                        }),
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
                    dispatch(
                      bookmarks_actions.set_is_fetching_first_bookmarks(true),
                    )
                    tag_view_options_hook.remove_tags_from_search_params(
                      tags_to_remove_from_search_params,
                    )
                  }
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
                      get_tag_hierarchies_request_params:
                        tag_hierarchies_hook.get_authorized_request_params({
                          filter: filter_view_options_hook.current_filter,
                          gte: date_view_options_hook.current_gte,
                          lte: date_view_options_hook.current_lte,
                        }),
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
                      updated_at: updated_bookmark.updated_at,
                      title: bookmark.title,
                      note: bookmark.note,
                      is_archived: !is_archived_filter,
                      is_unread: bookmark.is_unread,
                      stars: bookmark.stars,
                      links: bookmark.links.map((link) => ({
                        url: link.url,
                        site_path: link.site_path,
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
                      updated_at: updated_bookmark.updated_at,
                      title: bookmark.title,
                      note: bookmark.note,
                      is_archived: !is_archived_filter,
                      is_unread: bookmark.is_unread,
                      stars: bookmark.stars,
                      links: bookmark.links.map((link) => ({
                        url: link.url,
                        site_path: link.site_path,
                      })),
                      tags: bookmark.tags.map((tag) => tag.name),
                      tag_ids: bookmark.tags.map((tag) => tag.id),
                    },
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
                      get_tag_hierarchies_request_params:
                        tag_hierarchies_hook.get_authorized_request_params({
                          filter: filter_view_options_hook.current_filter,
                          gte: date_view_options_hook.current_gte,
                          lte: date_view_options_hook.current_lte,
                        }),
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
      <UiAppTemplate_SwipableColumns
        translations={{
          collapse_alt: dictionary.library.collapse_sidebar,
          follow: dictionary.library.follow,
          unfollow: dictionary.library.unfollow,
          folders: 'Folders',
          pinned: 'Pinned',
        }}
        is_following={undefined}
        welcome_text={
          !username
            ? `${params.dictionary.library.welcome}, username`
            : undefined
        }
        on_follow_click={username ? () => {} : undefined}
        show_skeletons={show_skeletons}
        mobile_title_bar={'Bookmarks'}
        slot_search={slot_search}
        slot_toolbar={slot_toolbar}
        slot_pinned={slot_pinned}
        pinned_count={pinned_count.current}
        slot_tag_hierarchies={slot_tag_hierarchies}
        slot_aside={slot_aside}
        are_bookmarks_dimmed={
          is_fetching_first_bookmarks || bookmarks_hook.is_upserting || false
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
          !is_fetching_first_bookmarks &&
          !search_hook.result &&
          (!bookmarks_hook.bookmarks || bookmarks_hook.bookmarks.length == 0) &&
          tag_view_options_hook.selected_tags.length
            ? tag_view_options_hook.clear_selected_tags
            : undefined
        }
        clear_date_range={
          !is_fetching_first_bookmarks &&
          !search_hook.result &&
          (!bookmarks_hook.bookmarks || bookmarks_hook.bookmarks.length == 0) &&
          (date_view_options_hook.current_gte ||
            date_view_options_hook.current_lte)
            ? date_view_options_hook.clear_gte_lte_search_params
            : undefined
        }
        info_text={
          is_fetching_first_bookmarks ||
          bookmarks_hook.is_fetching_more_bookmarks
            ? 'Loading...'
            : (!search_hook.search_string.length &&
                !is_fetching_first_bookmarks &&
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
