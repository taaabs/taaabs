'use client'

import { NavigationForLibrarySidebar } from '@web-ui/components/app/atoms/navigation-for-library-sidebar'
import { Bookmark } from '@web-ui/components/app/atoms/bookmark'
import { Library } from '@web-ui/components/app/templates/library'
import { useRouter, useParams } from 'next/navigation'
import useToggle from 'beautiful-react-hooks/useToggle'
import { use_library_selector } from './_hooks/store'
import { LibraryAside } from '@web-ui/components/app/templates/library-aside'
import { ButtonSelect } from '@web-ui/components/app/atoms/button-select'
import { SimpleSelectDropdown } from '@web-ui/components/app/atoms/simple-select-dropdown'
import OutsideClickHandler from 'react-outside-click-handler'
import { use_bookmarks } from './_hooks/use-bookmarks'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { Sortby } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { Tags } from '@web-ui/components/app/atoms/tags'
import { SelectedTags } from '@web-ui/components/app/atoms/selected-tags'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MonthsSkeleton } from '@web-ui/components/app/atoms/months-skeleton'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { TagsSkeleton } from '@web-ui/components/app/atoms/tags-skeleton'
import { use_months } from './_hooks/use-months'
import { use_filter_view_options } from '@/hooks/library/use-filter-view-options'
import { use_tag_view_options } from '@/hooks/library/use-tag-view-options'
import { use_date_view_options } from '@/hooks/library/use-date-view-options'
import { use_sortby_view_options } from '@/hooks/library/use-sortby-view-options'
import { use_order_view_options } from '@/hooks/library/use-order-view-options'

const Months = dynamic(() => import('./dynamic-months'), {
  ssr: false,
  loading: () => <MonthsSkeleton />,
})

const Page: React.FC = () => {
  const query_params = use_shallow_search_params()
  const router = useRouter()
  const params = useParams()
  const [show_months, set_show_months] = useState(false)
  const [show_tags, set_show_tags] = useState(false)
  const [show_tags_skeleton, set_show_tags_skeleton] = useState(true)
  const {
    bookmarks,
    is_getting_first_bookmarks,
    is_getting_more_bookmarks,
    has_more_bookmarks,
  } = use_library_selector((state) => state.bookmarks)
  const { get_bookmarks } = use_bookmarks()
  const {
    months_of_bookmark_creation,
    is_getting_months_data,
    tags_of_bookmark_creation,
    selected_tags,
  } = use_months()
  const {
    current_filter,
    set_filter_query_param,
    exclude_nsfw,
    include_nsfw,
    is_nsfw_excluded,
  } = use_filter_view_options()
  const { current_sortby, set_sortby_query_param } = use_sortby_view_options()
  const { current_order, set_order_query_param } = use_order_view_options()
  const {
    add_tag_to_query_params,
    remove_tag_from_query_params,
    actual_selected_tags,
    set_actual_selected_tags,
  } = use_tag_view_options()
  const { set_gte_lte_query_params, clear_gte_lte_query_params } =
    use_date_view_options()
  const [is_filter_dropdown_visible, toggle_filter_dropdown] = useToggle(false)
  const [is_sortby_dropdown_visible, toggle_sortby_dropdown] = useToggle(false)
  const [is_order_dropdown_visible, toggle_order_dropdown] = useToggle(false)

  useUpdateEffect(() => {
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

      for (const key in sessionStorage) {
        if (key.substring(0, 12) == 'renderHeight') {
          sessionStorage.removeItem(key)
        }
      }
    }
  }, [])

  return (
    <Library
      show_bookmarks_skeleton={bookmarks == null}
      title_bar={
        bookmarks != null
          ? query_params.get('c')
            ? '[category_name]'
            : 'All bookmarks'
          : undefined
      }
      slot_sidebar={
        <NavigationForLibrarySidebar
          navigation_items={[
            {
              label: 'All bookmarks',
              on_click: () => {
                router.push(`/${params.username}/library`)
              },
              is_active: query_params.get('c') ? false : true,
            },
            // {
            //   label: 'Categories',
            //   onClick: () => {},
            //   isActive: queryParams.get('categoryId') ? true : false,
            // },
          ]}
        />
      }
      slot_aside={
        <LibraryAside
          slot_filter={{
            button: (
              <ButtonSelect
                label="Filter"
                current_value={_filter_option_to_label(current_filter)}
                is_active={is_filter_dropdown_visible}
                on_click={toggle_filter_dropdown}
              />
            ),
            dropdown: (
              <OutsideClickHandler
                onOutsideClick={toggle_filter_dropdown}
                disabled={!is_filter_dropdown_visible}
              >
                <SimpleSelectDropdown
                  items={[
                    {
                      label: 'All',
                      on_click: () => {
                        if (
                          is_getting_first_bookmarks ||
                          is_getting_more_bookmarks ||
                          is_getting_months_data
                        )
                          return
                        if (is_nsfw_excluded) {
                          set_filter_query_param(LibraryFilter.AllNsfwExcluded)
                        } else {
                          set_filter_query_param(LibraryFilter.All)
                        }
                        set_actual_selected_tags([])
                        toggle_filter_dropdown()
                      },
                      is_selected:
                        current_filter == LibraryFilter.All ||
                        current_filter == LibraryFilter.AllNsfwExcluded,
                    },
                    {
                      label: 'Starred only',
                      on_click: () => {
                        if (
                          is_getting_first_bookmarks ||
                          is_getting_more_bookmarks ||
                          is_getting_months_data
                        )
                          return
                        if (is_nsfw_excluded) {
                          set_filter_query_param(
                            LibraryFilter.StarredOnlyNsfwExcluded,
                          )
                        } else {
                          set_filter_query_param(LibraryFilter.StarredOnly)
                        }
                        set_actual_selected_tags([])
                        toggle_filter_dropdown()
                      },
                      is_selected:
                        current_filter == LibraryFilter.StarredOnly ||
                        current_filter == LibraryFilter.StarredOnlyNsfwExcluded,
                    },
                    {
                      label: 'Archived',
                      on_click: () => {
                        if (
                          is_getting_first_bookmarks ||
                          is_getting_more_bookmarks ||
                          is_getting_months_data
                        )
                          return
                        if (is_nsfw_excluded) {
                          set_filter_query_param(
                            LibraryFilter.ArchivedNsfwExcluded,
                          )
                        } else {
                          set_filter_query_param(LibraryFilter.Archived)
                        }
                        set_actual_selected_tags([])
                        toggle_filter_dropdown()
                      },
                      is_selected:
                        current_filter == LibraryFilter.Archived ||
                        current_filter == LibraryFilter.ArchivedNsfwExcluded,
                    },
                  ]}
                  checkboxes={[
                    {
                      label: 'Exclude NSFW',
                      on_click: () => {
                        if (
                          is_getting_first_bookmarks ||
                          is_getting_more_bookmarks ||
                          is_getting_months_data
                        )
                          return

                        is_nsfw_excluded ? include_nsfw() : exclude_nsfw()
                        set_actual_selected_tags([])
                        toggle_filter_dropdown()
                      },
                      is_selected: is_nsfw_excluded,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
            is_dropdown_visible: is_filter_dropdown_visible,
          }}
          slot_order={{
            button: (
              <ButtonSelect
                label="Order"
                current_value={_order_option_to_label(current_order)}
                is_active={is_order_dropdown_visible}
                on_click={toggle_order_dropdown}
              />
            ),
            is_dropdown_visible: is_order_dropdown_visible,
            dropdown: (
              <OutsideClickHandler
                onOutsideClick={toggle_order_dropdown}
                disabled={!is_order_dropdown_visible}
              >
                <SimpleSelectDropdown
                  items={[
                    {
                      label: _order_option_to_label(Order.Desc),
                      on_click: () => {
                        if (
                          is_getting_first_bookmarks ||
                          is_getting_more_bookmarks ||
                          is_getting_months_data
                        )
                          return
                        set_order_query_param(Order.Desc)
                        toggle_order_dropdown()
                      },

                      is_selected: current_order == Order.Desc,
                    },
                    {
                      label: _order_option_to_label(Order.Asc),
                      on_click: () => {
                        if (
                          is_getting_first_bookmarks ||
                          is_getting_more_bookmarks ||
                          is_getting_months_data
                        )
                          return
                        set_order_query_param(Order.Asc)
                        toggle_order_dropdown()
                      },
                      is_selected: current_order == Order.Asc,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
          slot_sortby={{
            button: (
              <ButtonSelect
                label="Sort by"
                current_value={_sortby_option_to_label(current_sortby)}
                is_active={is_sortby_dropdown_visible}
                on_click={toggle_sortby_dropdown}
              />
            ),
            is_dropdown_visible: is_sortby_dropdown_visible,
            dropdown: (
              <OutsideClickHandler
                onOutsideClick={toggle_sortby_dropdown}
                disabled={!is_sortby_dropdown_visible}
              >
                <SimpleSelectDropdown
                  items={[
                    {
                      label: _sortby_option_to_label(Sortby.CreatedAt),
                      on_click: () => {
                        if (
                          is_getting_first_bookmarks ||
                          is_getting_more_bookmarks ||
                          is_getting_months_data
                        )
                          return
                        set_sortby_query_param(Sortby.CreatedAt)
                        toggle_sortby_dropdown()
                      },
                      is_selected: current_sortby == Sortby.CreatedAt,
                    },
                    {
                      label: _sortby_option_to_label(Sortby.UpdatedAt),
                      on_click: () => {
                        if (
                          is_getting_first_bookmarks ||
                          is_getting_more_bookmarks ||
                          is_getting_months_data
                        )
                          return
                        set_sortby_query_param(Sortby.UpdatedAt)
                        toggle_sortby_dropdown()
                      },
                      is_selected: current_sortby == Sortby.UpdatedAt,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
          slot_months={
            show_months ? (
              <div
                style={{
                  pointerEvents:
                    is_getting_first_bookmarks ||
                    is_getting_more_bookmarks ||
                    is_getting_months_data
                      ? 'none'
                      : 'all',
                }}
              >
                <Months
                  months={months_of_bookmark_creation}
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
                    bookmarks != undefined && !is_getting_months_data
                      ? bookmarks.length
                        ? true
                        : false
                      : undefined
                  }
                  is_getting_data={is_getting_months_data}
                />
              </div>
            ) : (
              <MonthsSkeleton />
            )
          }
          slot_tags={
            <>
              {show_tags && (
                <div
                  style={{
                    pointerEvents:
                      is_getting_first_bookmarks ||
                      is_getting_more_bookmarks ||
                      is_getting_months_data
                        ? 'none'
                        : undefined,
                  }}
                >
                  {selected_tags.length > 0 && (
                    <SelectedTags
                      selected_tags={[...selected_tags]
                        .filter((id) => {
                          if (!bookmarks) return false
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
                      tags_of_bookmark_creation
                        ? Object.fromEntries(
                            Object.entries(tags_of_bookmark_creation).filter(
                              (tag) =>
                                is_getting_first_bookmarks
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
      is_getting_first_bookmarks={is_getting_first_bookmarks}
      is_getting_more_bookmarks={is_getting_more_bookmarks}
      has_more_bookmarks={has_more_bookmarks || false}
      no_results={!bookmarks || bookmarks.length == 0}
      get_more_bookmarks={() => {
        get_bookmarks({ should_get_next_page: true })
      }}
      slot_bookmarks={
        bookmarks && bookmarks.length
          ? bookmarks.map((bookmark, i) => (
              <Bookmark
                index={i}
                id={bookmark.id}
                title={bookmark.title}
                on_click={() => {}}
                on_menu_click={() => {}}
                date={new Date(bookmark.created_at)}
                links={bookmark.links.map((link) => ({
                  url: link.url,
                  saves: link.saves,
                }))}
                tags={
                  bookmark.tags
                    ? bookmark.tags.map((tag) => {
                        const isSelected = is_getting_first_bookmarks
                          ? selected_tags.find((t) => t == tag.id) != undefined
                          : actual_selected_tags.find((t) => t == tag.id) !=
                            undefined

                        return {
                          name: tag.name,
                          isSelected,
                          id: tag.id,
                          yields:
                            !isSelected &&
                            tags_of_bookmark_creation &&
                            tags_of_bookmark_creation[tag.name]
                              ? tags_of_bookmark_creation[tag.name].yields
                              : undefined,
                        }
                      })
                    : []
                }
                is_nsfw={bookmark.is_nsfw}
                is_starred={bookmark.is_starred}
                key={bookmark.id}
                on_tag_click={add_tag_to_query_params}
                on_selected_tag_click={remove_tag_from_query_params}
                render_height={
                  parseInt(
                    sessionStorage.getItem(`renderHeight_${bookmark.id}`) ||
                      '0',
                  ) || undefined
                }
              />
            ))
          : []
      }
    />
  )
}

export default Page

function _sortby_option_to_label(sortby_option: Sortby): string {
  switch (sortby_option) {
    case Sortby.CreatedAt:
      return 'Created at'
    case Sortby.UpdatedAt:
      return 'Updated at'
  }
}

function _order_option_to_label(order_option: Order): string {
  switch (order_option) {
    case Order.Desc:
      return 'Newest to Oldest'
    case Order.Asc:
      return 'Oldest to Newest'
  }
}

function _filter_option_to_label(filter: LibraryFilter): string {
  switch (filter) {
    case LibraryFilter.All:
      return 'All'
    case LibraryFilter.AllNsfwExcluded:
      return 'All without nsfw'
    case LibraryFilter.StarredOnly:
      return 'Starred only'
    case LibraryFilter.StarredOnlyNsfwExcluded:
      return 'Starred only without nsfw'
    case LibraryFilter.Archived:
      return 'Archived'
    case LibraryFilter.ArchivedNsfwExcluded:
      return 'Archived without nsfw'
  }
}