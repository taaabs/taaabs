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
import { useEffect, useState } from 'react'
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
import { use_months } from '@/hooks/library/use-months'
import { use_session_storage_cleanup } from '@/hooks/library/use-session-storage-cleanup'
import { use_is_hydrated } from '@shared/hooks'
import { ButtonSelectSkeleton } from '@web-ui/components/app/atoms/button-select-skeleton'
import { UnreadStarsFilter } from '@web-ui/components/app/atoms/unread-stars-filter'

const Months = dynamic(() => import('./dynamic-months'), {
  ssr: false,
  loading: () => <CustomRangeSkeleton />,
})

const Page: React.FC = () => {
  const is_hydrated = use_is_hydrated()
  use_session_storage_cleanup()
  const dispatch = use_library_dispatch()
  const query_params = use_shallow_search_params()
  const [show_months, set_show_months] = useState(false)
  const [show_tags, set_show_tags] = useState(false)
  const [show_tags_skeleton, set_show_tags_skeleton] = useState(true)
  const {
    bookmarks,
    is_fetching_first_bookmarks,
    is_fetching_more_bookmarks,
    has_more_bookmarks,
  } = use_library_selector((state) => state.bookmarks)
  const { get_bookmarks } = use_bookmarks()
  const { months, is_fetching_months_data, tags, selected_tags } = use_months()
  const {
    current_filter,
    set_filter_query_param,
    set_filter_query_param_reset_others,
    clear_selected_stars,
  } = use_filter_view_options()
  const { current_sortby, set_sortby_query_param } = use_sortby_view_options()
  const { current_order, set_order_query_param } = use_order_view_options()
  const {
    add_tag_to_query_params,
    remove_tag_from_query_params,
    actual_selected_tags,
    clear_selected_tags,
    set_actual_selected_tags,
  } = use_tag_view_options()
  const { set_gte_lte_query_params, clear_gte_lte_query_params } =
    use_date_view_options()
  const [is_sortby_dropdown_visible, toggle_sortby_dropdown] = useToggle(false)
  const [is_order_dropdown_visible, toggle_order_dropdown] = useToggle(false)

  useUpdateEffect(() => {
    if (bookmarks == null) return
    if (!show_months) set_show_months(true)
    if (!show_tags) set_show_tags(true)
    if (show_tags_skeleton) set_show_tags_skeleton(false)
  }, [bookmarks])

  useEffect(() => {
    // Automatic scroll restoration works great when
    // reloading, but not at all when navigating back/forward.
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = 'auto'
    }
  }, [])

  return (
    <Library
      show_bookmarks_skeleton={bookmarks == null}
      mobile_title_bar={
        current_filter == LibraryFilter.All
          ? 'All bookmarks'
          : current_filter == LibraryFilter.Archived
          ? 'Archived'
          : 'All bookmarks'
      }
      slot_desktop_search={<>search</>}
      slot_sidebar={
        <NavigationForLibrarySidebar
          navigation_items={[
            {
              label: 'All bookmarks',
              on_click: () => {
                if (is_fetching_first_bookmarks) return
                dispatch(bookmarks_actions.set_bookmarks(null))
                set_show_months(false)
                set_show_tags(false)
                set_show_tags_skeleton(true)
                set_filter_query_param_reset_others(LibraryFilter.All)
                set_actual_selected_tags([])
              },
              is_active: current_filter != LibraryFilter.Archived,
            },
            {
              label: 'Archived',
              on_click: () => {
                if (is_fetching_first_bookmarks) return
                dispatch(bookmarks_actions.set_bookmarks(null))
                set_show_months(false)
                set_show_tags(false)
                set_show_tags_skeleton(true)
                set_filter_query_param_reset_others(LibraryFilter.Archived)
                set_actual_selected_tags([])
              },
              is_active: current_filter == LibraryFilter.Archived,
            },
          ]}
        />
      }
      slot_aside={
        <LibraryAside
          slot_filter={
            is_hydrated &&
            current_filter != LibraryFilter.Archived && (
              <UnreadStarsFilter
                selected_stars={
                  current_filter == LibraryFilter.OneStar
                    ? 1
                    : current_filter == LibraryFilter.TwoStars
                    ? 2
                    : current_filter == LibraryFilter.ThreeStars
                    ? 3
                    : 0
                }
                stars_click_handler={(selected_stars) => {
                  if (is_fetching_first_bookmarks) return

                  if (selected_stars == 1) {
                    if (current_filter == LibraryFilter.OneStar) {
                      set_filter_query_param(LibraryFilter.All)
                    } else if (
                      current_filter == LibraryFilter.All ||
                      current_filter == LibraryFilter.TwoStars ||
                      current_filter == LibraryFilter.ThreeStars
                    ) {
                      set_filter_query_param(LibraryFilter.OneStar)
                    }
                  } else if (selected_stars == 2) {
                    if (current_filter == LibraryFilter.TwoStars) {
                      set_filter_query_param(LibraryFilter.All)
                    } else if (
                      current_filter == LibraryFilter.All ||
                      current_filter == LibraryFilter.OneStar ||
                      current_filter == LibraryFilter.ThreeStars
                    ) {
                      set_filter_query_param(LibraryFilter.TwoStars)
                    }
                  } else if (selected_stars == 3) {
                    if (current_filter == LibraryFilter.ThreeStars) {
                      set_filter_query_param(LibraryFilter.All)
                    } else if (
                      current_filter == LibraryFilter.All ||
                      current_filter == LibraryFilter.OneStar ||
                      current_filter == LibraryFilter.TwoStars
                    ) {
                      set_filter_query_param(LibraryFilter.ThreeStars)
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
                current_value={_sortby_option_to_label(current_sortby)}
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
                          current_sortby == Sortby.CreatedAt ||
                          is_fetching_first_bookmarks ||
                          is_fetching_more_bookmarks ||
                          is_fetching_months_data
                        )
                          return
                        set_sortby_query_param(Sortby.CreatedAt)
                      },
                      is_selected: current_sortby == Sortby.CreatedAt,
                    },
                    {
                      label: _sortby_option_to_label(Sortby.UpdatedAt),
                      on_click: () => {
                        toggle_sortby_dropdown()
                        if (
                          current_sortby == Sortby.UpdatedAt ||
                          is_fetching_first_bookmarks ||
                          is_fetching_more_bookmarks ||
                          is_fetching_months_data
                        )
                          return
                        set_sortby_query_param(Sortby.UpdatedAt)
                      },
                      is_selected: current_sortby == Sortby.UpdatedAt,
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
                current_value={_order_option_to_label(current_order)}
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
                          current_order == Order.Desc ||
                          is_fetching_first_bookmarks ||
                          is_fetching_more_bookmarks ||
                          is_fetching_months_data
                        )
                          return
                        set_order_query_param(Order.Desc)
                      },

                      is_selected: current_order == Order.Desc,
                    },
                    {
                      label: _order_option_to_label(Order.Asc),
                      on_click: () => {
                        toggle_order_dropdown()
                        if (
                          current_order == Order.Asc ||
                          is_fetching_first_bookmarks ||
                          is_fetching_more_bookmarks ||
                          is_fetching_months_data
                        )
                          return
                        set_order_query_param(Order.Asc)
                      },
                      is_selected: current_order == Order.Asc,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
          slot_custom_range={
            show_months ? (
              <div
                style={{
                  pointerEvents:
                    is_fetching_first_bookmarks ||
                    is_fetching_more_bookmarks ||
                    is_fetching_months_data
                      ? 'none'
                      : 'all',
                }}
              >
                <Months
                  months={months}
                  on_yyyymm_change={set_gte_lte_query_params}
                  clear_date_range={clear_gte_lte_query_params}
                  current_gte={
                    parseInt(query_params.get('gte') || '0') || undefined
                  }
                  current_lte={
                    parseInt(query_params.get('lte') || '0') || undefined
                  }
                  selected_tags={query_params.get('t') || undefined}
                  has_results={
                    bookmarks != undefined && !is_fetching_months_data
                      ? bookmarks.length > 0
                      : undefined
                  }
                  is_fetching_data={is_fetching_first_bookmarks}
                  is_range_selector_disabled={
                    current_sortby == Sortby.UpdatedAt
                  }
                />
              </div>
            ) : (
              <CustomRangeSkeleton />
            )
          }
          slot_tags={
            <>
              {bookmarks && bookmarks.length > 0 && show_tags && (
                <div
                  style={{
                    pointerEvents:
                      is_fetching_first_bookmarks ||
                      is_fetching_more_bookmarks ||
                      is_fetching_months_data
                        ? 'none'
                        : undefined,
                  }}
                >
                  {(is_fetching_first_bookmarks
                    ? selected_tags.length > 0
                    : actual_selected_tags.length > 0) && (
                    <SelectedTags
                      selected_tags={(is_fetching_first_bookmarks
                        ? selected_tags
                        : actual_selected_tags
                      )
                        .filter((id) => {
                          if (!bookmarks || !bookmarks[0]) return false
                          return (
                            bookmarks[0].tags?.findIndex(
                              (tag) => tag.id == id,
                            ) != -1
                          )
                        })
                        .map((id) => {
                          const name = bookmarks![0].tags!.find(
                            (tag) => tag.id == id,
                          )!.name

                          return {
                            id,
                            name,
                          }
                        })}
                      on_selected_tag_click={remove_tag_from_query_params}
                    />
                  )}
                  <Tags
                    tags={
                      tags
                        ? Object.fromEntries(
                            Object.entries(tags).filter((tag) =>
                              is_fetching_first_bookmarks
                                ? !selected_tags.includes(tag[1].id)
                                : !actual_selected_tags.includes(tag[1].id),
                            ),
                          )
                        : {}
                    }
                    on_click={add_tag_to_query_params}
                  />
                </div>
              )}
              {show_tags_skeleton && <TagsSkeleton />}
            </>
          }
        />
      }
      is_fetching_first_bookmarks={is_fetching_first_bookmarks}
      is_fetching_more_bookmarks={is_fetching_more_bookmarks}
      has_more_bookmarks={has_more_bookmarks || false}
      no_results={!bookmarks || bookmarks.length == 0}
      get_more_bookmarks={() => {
        get_bookmarks({ should_get_next_page: true })
      }}
      slot_bookmarks={
        bookmarks && bookmarks.length
          ? bookmarks.map((bookmark, index) => (
              <Bookmark
                key={bookmark.id}
                title={bookmark.title}
                on_click={() => {}}
                on_menu_click={() => {}}
                date={
                  current_sortby == Sortby.CreatedAt
                    ? new Date(bookmark.created_at)
                    : current_sortby == Sortby.UpdatedAt
                    ? new Date(bookmark.updated_at)
                    : new Date()
                }
                links={bookmark.links.map((link) => ({
                  url: link.url,
                  saves: link.public_saves,
                  site_path: link.site_path,
                }))}
                current_filter={current_filter}
                number_of_selected_tags={
                  is_fetching_first_bookmarks
                    ? selected_tags.length
                    : actual_selected_tags.length
                }
                tags={
                  bookmark.tags
                    ? bookmark.tags.map((tag) => {
                        const isSelected = is_fetching_first_bookmarks
                          ? selected_tags.find((t) => t == tag.id) != undefined
                          : actual_selected_tags.find((t) => t == tag.id) !=
                            undefined

                        return {
                          name: tag.name,
                          isSelected,
                          id: tag.id,
                          yields:
                            !isSelected && tags && tags[tag.name]
                              ? tags[tag.name].yields
                              : undefined,
                        }
                      })
                    : []
                }
                stars={bookmark.stars}
                on_tag_click={add_tag_to_query_params}
                on_selected_tag_click={remove_tag_from_query_params}
                render_height={bookmark.render_height}
                set_render_height={(height) => {
                  dispatch(
                    bookmarks_actions.set_bookmark_render_height({
                      index,
                      height,
                    }),
                  )
                }}
                favicon_host={`${process.env.NEXT_PUBLIC_API_URL}/v1/favicons`}
                menu_slot={<>menu</>}
              />
            ))
          : []
      }
      clear_selected_stars={
        !is_fetching_first_bookmarks &&
        (!bookmarks || bookmarks.length == 0) &&
        (current_filter == LibraryFilter.OneStar ||
          current_filter == LibraryFilter.TwoStars ||
          current_filter == LibraryFilter.ThreeStars)
          ? () => {
              clear_selected_stars(current_filter)
            }
          : undefined
      }
      clear_selected_tags={
        !is_fetching_first_bookmarks &&
        (!bookmarks || bookmarks.length == 0) &&
        query_params.get('t')
          ? clear_selected_tags
          : undefined
      }
      clear_date_range={
        !is_fetching_first_bookmarks &&
        (!bookmarks || bookmarks.length == 0) &&
        (query_params.get('gte') || query_params.get('lte'))
          ? clear_gte_lte_query_params
          : undefined
      }
    />
  )
}

export default Page

function _sortby_option_to_label(sortby_option: Sortby): string {
  switch (sortby_option) {
    case Sortby.CreatedAt:
      return 'Date created'
    case Sortby.UpdatedAt:
      return 'Date updated'
    case Sortby.VisitedAt:
      return ''
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