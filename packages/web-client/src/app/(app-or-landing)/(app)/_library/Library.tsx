import { use_library_dispatch } from '@/stores/library'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { use_filter_view_options } from './_hooks/use-filter-view-options'
import { use_tag_view_options } from './_hooks/use-tag-view-options'
import { use_date_view_options } from './_hooks/use-date-view-options'
import { use_sort_by_view_options } from './_hooks/use-sort-by-view-options'
import { use_order_view_options } from './_hooks/use-order-view-options'
import { bookmarks_actions } from '@repositories/stores/library/bookmarks/bookmarks.slice'
import { use_bookmarks } from './_hooks/use-bookmarks'
import { use_counts } from './_hooks/use-counts'
import { use_session_storage_cleanup } from './_hooks/use-session-storage-cleanup'
import { browser_storage } from '@/constants/browser-storage'
import { useParams } from 'next/navigation'
import { SwipableColumns as UiAppTemplate_SwipableColumns } from '@web-ui/components/app/templates/swipable-columns'
import { DraggedCursorTag as UiAppLibrary_DraggedCursorTag } from '@web-ui/components/app/library/DraggedCursorTag'
import { use_tag_hierarchies } from './_hooks/use-tag-hierarchies'
import { Filter } from '@/types/library/filter'
import { use_scroll_restore } from './_hooks/use-scroll-restore'
import { use_pinned } from './_hooks/use-pinned'
import { counts_actions } from '@repositories/stores/library/counts/counts.slice'
import { use_popstate_count } from '@/hooks/pop-state-count'
import { use_is_hydrated } from '@shared/hooks'
import { ModalContext } from '@/providers/ModalProvider'
import { AuthContext } from '@/app/auth-provider'
import { LocalDb } from '@/app/local-db-provider'
import { Dictionary } from '@/dictionaries/dictionary'
import { rename_tag_modal_setter } from '@/modals/rename-tag/rename-tag-modal-setter'
import { _Bookmarks } from './_Bookmarks'
import { _Search } from './_Search'
import { _Toolbar } from './_Toolbar'
import { _Pinned } from './_Pinned'
import { _TagHierarchies } from './_TagHierarchies'
import { _Aside } from './_Aside'
import { use_points } from './_hooks/use-points'
import { use_search } from './_hooks/use-search'
import { FollowUnfollowContext } from '../[username]/follow-unfollow-provider'
import { use_bookmarklet_handler } from './_hooks/use-bookmarklet-handler'

export type LibraryContext = {
  bookmarks_hook: ReturnType<typeof use_bookmarks>
  counts_hook: ReturnType<typeof use_counts>
  search_hook: ReturnType<typeof use_search>
  pinned_hook: ReturnType<typeof use_pinned>
  tag_view_options_hook: ReturnType<typeof use_tag_view_options>
  sort_by_view_options_hook: ReturnType<typeof use_sort_by_view_options>
  order_view_options_hook: ReturnType<typeof use_order_view_options>
  tag_hierarchies_hook: ReturnType<typeof use_tag_hierarchies>
  filter_view_options_hook: ReturnType<typeof use_filter_view_options>
  date_view_options_hook: ReturnType<typeof use_date_view_options>
  points_hook: ReturnType<typeof use_points>

  username?: string
  library_updated_at_timestamp: number
  pinned_updated_at: number
  popstate_count: number
  is_fetching_first_bookmarks: boolean
  is_archived_filter: boolean
  on_tag_rename_click: (params: { id: number; name: string }) => Promise<void>
  search_cache_to_be_cleared: React.MutableRefObject<boolean>
  is_not_interactive: boolean
  show_skeletons: boolean
}

export const LibraryContext = createContext<LibraryContext | null>(null)

const Library: React.FC<{ dictionary: Dictionary; local_db: LocalDb }> = (
  props,
) => {
  const auth_context = useContext(AuthContext)
  use_scroll_restore()
  const is_hydrated = use_is_hydrated()
  const popstate_count = use_popstate_count()
  use_session_storage_cleanup()
  const dispatch = use_library_dispatch()
  const { username }: { username?: string } = useParams()
  const modal_context = useContext(ModalContext)!
  const [show_skeletons, set_show_skeletons] = useState(true)
  const search_hook = use_search(props.local_db)
  const bookmarks_hook = use_bookmarks()
  const counts_hook = use_counts()
  const tag_hierarchies_hook = use_tag_hierarchies()
  const pinned_hook = use_pinned()
  const filter_view_options_hook = use_filter_view_options()
  const sort_by_view_options_hook = use_sort_by_view_options()
  const order_view_options_hook = use_order_view_options()
  const tag_view_options_hook = use_tag_view_options()
  const date_view_options_hook = use_date_view_options()
  const points_hook = use_points()
  const follow_unfollow_context = useContext(FollowUnfollowContext) // Only available in public library.
  // START - UI synchronization.
  const [library_updated_at_timestamp, set_library_updated_at_timestamp] =
    useState(0)
  const [is_pinned_stale, set_is_pinned_stale] = useState<boolean>()
  const [pinned_updated_at, set_pinned_updated_at] = useState(0)
  const [is_fetching_first_bookmarks, set_is_fetching_first_bookmarks] =
    useState(false)
  // END - UI synchronization.

  use_bookmarklet_handler({
    dictionary: props.dictionary,
    refetch_data: async () => {
      sessionStorage.setItem(
        browser_storage.session_storage.library
          .counts_reload_requested_by_new_bookmark,
        'true',
      )
      bookmarks_hook.get_bookmarks({})
    },
  })

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
        set_pinned_updated_at(pinned_hook.fetched_at_timestamp!)
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

  const on_tag_rename_click = async (params: { id: number; name: string }) => {
    const new_tag_name = await rename_tag_modal_setter({
      dictionary: props.dictionary,
      modal_context,
      name: params.name,
    })
    if (new_tag_name) {
      const bookmarks = bookmarks_hook.bookmarks?.map((b) => ({
        ...b,
        tags: b.tags.map((t) => ({
          ...t,
          name: t.name == params.name ? new_tag_name : t.name,
        })),
      }))
      dispatch(bookmarks_actions.set_incoming_bookmarks(bookmarks))
      dispatch(bookmarks_actions.set_bookmarks(bookmarks))
      dispatch(
        counts_actions.set_tags({
          ...counts_hook.tags!,
          [params.id]: {
            ...counts_hook.tags![params.id],
            name: new_tag_name,
          },
        }),
      )
      tag_hierarchies_hook.rename({
        old_tag_name: params.name,
        new_tag_name,
      })
      set_library_updated_at_timestamp(Date.now())
    }
    modal_context.close()
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

  // Close "Upsert bookmark" modal, refresh counts and tag hierarchies.
  useUpdateEffect(() => {
    if (bookmarks_hook.is_fetching_first_bookmarks) return
    const counts_reload_requested_by_new_bookmark = sessionStorage.getItem(
      browser_storage.session_storage.library
        .counts_reload_requested_by_new_bookmark,
    )
    if (
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
            ky: auth_context.ky_instance,
            encryption_key: auth_context.auth_data!.encryption_key,
          }),
        ),
      ]).then(() => {
        modal_context.close()
      })
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
    if (props.local_db.db || props.local_db.archived_db) {
      search_hook.set_current_filter(filter_view_options_hook.current_filter)
      search_hook.set_selected_tag_ids(tag_view_options_hook.selected_tags)
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
  }, [props.local_db.db, props.local_db.archived_db])

  useUpdateEffect(() => {
    if (search_hook.result) {
      bookmarks_hook.get_bookmarks_by_ids({
        all_not_paginated_ids: search_hook.result.hits.map((hit) =>
          parseInt(hit.document.id),
        ),
      })
    }
  }, [search_hook.queried_at_timestamp])

  useUpdateEffect(() => {
    tag_hierarchies_hook.get_tag_hierarchies({
      filter: filter_view_options_hook.current_filter,
      gte: date_view_options_hook.current_gte,
      lte: date_view_options_hook.current_lte,
    })
  }, [
    is_hydrated,
    date_view_options_hook.current_gte,
    date_view_options_hook.current_lte,
    filter_view_options_hook.current_filter,
  ])

  const is_archived_filter =
    filter_view_options_hook.current_filter == Filter.ARCHIVED ||
    filter_view_options_hook.current_filter == Filter.ARCHIVED_STARRED ||
    filter_view_options_hook.current_filter ==
      Filter.ARCHIVED_STARRED_UNSORTED ||
    filter_view_options_hook.current_filter == Filter.ARCHIVED_UNSORTED

  const is_not_interactive =
    is_fetching_first_bookmarks ||
    bookmarks_hook.is_fetching_more_bookmarks ||
    props.local_db.is_initializing ||
    false

  return (
    <LibraryContext.Provider
      value={{
        bookmarks_hook,
        counts_hook,
        search_hook,
        pinned_hook,
        tag_view_options_hook,
        sort_by_view_options_hook,
        order_view_options_hook,
        tag_hierarchies_hook,
        filter_view_options_hook,
        date_view_options_hook,
        points_hook,

        username,
        library_updated_at_timestamp,
        pinned_updated_at,
        popstate_count,
        is_fetching_first_bookmarks,
        is_archived_filter,
        on_tag_rename_click,
        search_cache_to_be_cleared,
        is_not_interactive,
        show_skeletons,
      }}
    >
      <UiAppLibrary_DraggedCursorTag
        tag_name={tag_view_options_hook.dragged_tag?.name}
      />
      <UiAppTemplate_SwipableColumns
        is_following={follow_unfollow_context?.is_following}
        welcome_text={
          !username && auth_context.auth_data
            ? `${props.dictionary.app.library.welcome}, ${auth_context.auth_data.username}`
            : undefined
        }
        on_follow_click={
          username && !follow_unfollow_context?.is_toggling
            ? follow_unfollow_context?.toggle
            : undefined
        }
        show_skeletons={show_skeletons}
        slot_search={
          <_Search dictionary={props.dictionary} local_db={props.local_db} />
        }
        slot_toolbar={
          <_Toolbar dictionary={props.dictionary} local_db={props.local_db} />
        }
        slot_column_left={
          <_TagHierarchies
            dictionary={props.dictionary}
            local_db={props.local_db}
          />
        }
        slot_column_right={
          <_Aside dictionary={props.dictionary} local_db={props.local_db} />
        }
        are_bookmarks_dimmed={
          is_fetching_first_bookmarks || bookmarks_hook.is_upserting || false
        }
        slot_main={
          <>
            {!bookmarks_hook.showing_bookmarks_fetched_by_ids && (
              <_Pinned
                dictionary={props.dictionary}
                local_db={props.local_db}
              />
            )}
            {
              <_Bookmarks
                dictionary={props.dictionary}
                local_db={props.local_db}
              />
            }
          </>
        }
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
        translations={{
          mobile_title_bar: props.dictionary.app.menu_items.library,
          collapse_alt: props.dictionary.app.library.collapse_sidebar,
          follow: props.dictionary.app.library.follow,
          unfollow: props.dictionary.app.library.unfollow,
          folders: props.dictionary.app.library.folders,
          clear_selected_tags: props.dictionary.app.library.clear_selected_tags,
        }}
      />
    </LibraryContext.Provider>
  )
}

export default Library
