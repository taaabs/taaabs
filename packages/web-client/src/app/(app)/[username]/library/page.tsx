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
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
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
import { useTagViewOptions } from '@/hooks/library/use-tag-view-options'
import { useDateViewOptions } from '@/hooks/library/use-date-view-options'
import { useSortByViewOptions } from '@/hooks/library/use-sort-by-view-options'
import { useOrderViewOptions } from '@/hooks/library/use-order-view-options'

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
    is_getting_first_bookmarks: isGettingFirstBookmarks,
    is_getting_more_bookmarks: isGettingMoreBookmarks,
    has_more_bookmarks: hasMoreBookmarks,
  } = use_library_selector((state) => state.bookmarks)
  const { get_bookmarks } = use_bookmarks()
  const {
    months_of_bookmark_creation,
    is_getting_months_data,
    tags_of_bookmark_creation,
    selectedTags,
  } = use_months()
  const {
    currentFilter,
    setFilterQueryParam,
    excludeNsfw,
    includeNsfw,
    isNsfwExcluded,
  } = use_filter_view_options()
  const { currentSortBy, setSortByQueryParam } = useSortByViewOptions()
  const { currentOrder, setOrderQueryParam } = useOrderViewOptions()
  const {
    addTagToQueryParams,
    removeTagFromQueryParams,
    actualSelectedTags,
    setActualSelectedTags,
  } = useTagViewOptions()
  const { setGteLteQueryParams, clearGteLteQueryParams } = useDateViewOptions()
  const [isFilterDropdownVisible, toggleFilterDropdown] = useToggle(false)
  const [isSortByDropdownVisible, toggleSortByDropdown] = useToggle(false)
  const [isOrderDropdownVisible, toggleOrderDropdown] = useToggle(false)

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
      showBookmarksSkeleton={bookmarks == null}
      titleBar={
        bookmarks != null
          ? query_params.get('c')
            ? '[category_name]'
            : 'All bookmarks'
          : undefined
      }
      slotSidebar={
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
      slotAside={
        <LibraryAside
          slotFilter={{
            button: (
              <ButtonSelect
                label="Filter"
                current_value={_filter_option_to_label(currentFilter)}
                is_active={isFilterDropdownVisible}
                on_click={toggleFilterDropdown}
              />
            ),
            dropdown: (
              <OutsideClickHandler
                onOutsideClick={toggleFilterDropdown}
                disabled={!isFilterDropdownVisible}
              >
                <SimpleSelectDropdown
                  items={[
                    {
                      label: 'All',
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          is_getting_months_data
                        )
                          return
                        if (isNsfwExcluded) {
                          setFilterQueryParam(LibraryFilter.AllNsfwExcluded)
                        } else {
                          setFilterQueryParam(LibraryFilter.All)
                        }
                        setActualSelectedTags([])
                        toggleFilterDropdown()
                      },
                      isSelected:
                        currentFilter == LibraryFilter.All ||
                        currentFilter == LibraryFilter.AllNsfwExcluded,
                    },
                    {
                      label: 'Starred only',
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          is_getting_months_data
                        )
                          return
                        if (isNsfwExcluded) {
                          setFilterQueryParam(
                            LibraryFilter.StarredOnlyNsfwExcluded,
                          )
                        } else {
                          setFilterQueryParam(LibraryFilter.StarredOnly)
                        }
                        setActualSelectedTags([])
                        toggleFilterDropdown()
                      },
                      isSelected:
                        currentFilter == LibraryFilter.StarredOnly ||
                        currentFilter == LibraryFilter.StarredOnlyNsfwExcluded,
                    },
                    {
                      label: 'Archived',
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          is_getting_months_data
                        )
                          return
                        if (isNsfwExcluded) {
                          setFilterQueryParam(
                            LibraryFilter.ArchivedNsfwExcluded,
                          )
                        } else {
                          setFilterQueryParam(LibraryFilter.Archived)
                        }
                        setActualSelectedTags([])
                        toggleFilterDropdown()
                      },
                      isSelected:
                        currentFilter == LibraryFilter.Archived ||
                        currentFilter == LibraryFilter.ArchivedNsfwExcluded,
                    },
                  ]}
                  checkboxes={[
                    {
                      label: 'Exclude NSFW',
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          is_getting_months_data
                        )
                          return

                        isNsfwExcluded ? includeNsfw() : excludeNsfw()
                        setActualSelectedTags([])
                        toggleFilterDropdown()
                      },
                      isSelected: isNsfwExcluded,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
            isDropdownVisible: isFilterDropdownVisible,
          }}
          slotOrder={{
            button: (
              <ButtonSelect
                label="Order"
                current_value={_order_option_to_label(currentOrder)}
                is_active={isOrderDropdownVisible}
                on_click={toggleOrderDropdown}
              />
            ),
            isDropdownVisible: isOrderDropdownVisible,
            dropdown: (
              <OutsideClickHandler
                onOutsideClick={toggleOrderDropdown}
                disabled={!isOrderDropdownVisible}
              >
                <SimpleSelectDropdown
                  items={[
                    {
                      label: _order_option_to_label(Order.Desc),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          is_getting_months_data
                        )
                          return
                        setOrderQueryParam(Order.Desc)
                        toggleOrderDropdown()
                      },

                      isSelected: currentOrder == Order.Desc,
                    },
                    {
                      label: _order_option_to_label(Order.Asc),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          is_getting_months_data
                        )
                          return
                        setOrderQueryParam(Order.Asc)
                        toggleOrderDropdown()
                      },
                      isSelected: currentOrder == Order.Asc,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
          slotSortBy={{
            button: (
              <ButtonSelect
                label="Sort by"
                current_value={_sortby_option_to_label(currentSortBy)}
                is_active={isSortByDropdownVisible}
                on_click={toggleSortByDropdown}
              />
            ),
            isDropdownVisible: isSortByDropdownVisible,
            dropdown: (
              <OutsideClickHandler
                onOutsideClick={toggleSortByDropdown}
                disabled={!isSortByDropdownVisible}
              >
                <SimpleSelectDropdown
                  items={[
                    {
                      label: _sortby_option_to_label(SortBy.CreatedAt),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          is_getting_months_data
                        )
                          return
                        setSortByQueryParam(SortBy.CreatedAt)
                        toggleSortByDropdown()
                      },
                      isSelected: currentSortBy == SortBy.CreatedAt,
                    },
                    {
                      label: _sortby_option_to_label(SortBy.UpdatedAt),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          is_getting_months_data
                        )
                          return
                        setSortByQueryParam(SortBy.UpdatedAt)
                        toggleSortByDropdown()
                      },
                      isSelected: currentSortBy == SortBy.UpdatedAt,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
          slotMonths={
            show_months ? (
              <div
                style={{
                  pointerEvents:
                    isGettingFirstBookmarks ||
                    isGettingMoreBookmarks ||
                    is_getting_months_data
                      ? 'none'
                      : 'all',
                }}
              >
                <Months
                  months={months_of_bookmark_creation}
                  on_yyyymm_change={setGteLteQueryParams}
                  clear_date_range={clearGteLteQueryParams}
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
          slotTags={
            <>
              {show_tags && (
                <div
                  style={{
                    pointerEvents:
                      isGettingFirstBookmarks ||
                      isGettingMoreBookmarks ||
                      is_getting_months_data
                        ? 'none'
                        : undefined,
                  }}
                >
                  {selectedTags.length > 0 && (
                    <SelectedTags
                      selectedTags={[...selectedTags]
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
                      onSelectedTagClick={removeTagFromQueryParams}
                    />
                  )}
                  <Tags
                    tags={
                      tags_of_bookmark_creation
                        ? Object.fromEntries(
                            Object.entries(tags_of_bookmark_creation).filter(
                              (tag) =>
                                isGettingFirstBookmarks
                                  ? !selectedTags.includes(tag[1].id)
                                  : !actualSelectedTags.includes(tag[1].id),
                            ),
                          )
                        : {}
                    }
                    onClick={addTagToQueryParams}
                  />
                </div>
              )}
              {show_tags_skeleton && <TagsSkeleton />}
            </>
          }
        />
      }
      isGettingFirstBookmarks={isGettingFirstBookmarks}
      isGettingMoreBookmarks={isGettingMoreBookmarks}
      hasMoreBookmarks={hasMoreBookmarks || false}
      noResults={!bookmarks || bookmarks.length == 0}
      getMoreBookmarks={() => {
        get_bookmarks({ shouldGetNextPage: true })
      }}
      slotBookmarks={
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
                        const isSelected = isGettingFirstBookmarks
                          ? selectedTags.find((t) => t == tag.id) != undefined
                          : actualSelectedTags.find((t) => t == tag.id) !=
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
                on_tag_click={addTagToQueryParams}
                on_selected_tag_click={removeTagFromQueryParams}
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

function _sortby_option_to_label(sortby_option: SortBy): string {
  switch (sortby_option) {
    case SortBy.CreatedAt:
      return 'Created at'
    case SortBy.UpdatedAt:
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
