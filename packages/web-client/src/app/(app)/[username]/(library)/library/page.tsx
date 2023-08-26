'use client'

import { NavigationForLibrarySidebar } from '@web-ui/components/app/atoms/navigation-for-library-sidebar'
import { Bookmark } from '@web-ui/components/app/atoms/bookmark'
import { Library } from '@web-ui/components/app/templates/library'
import { useRouter, useParams } from 'next/navigation'
import useToggle from 'beautiful-react-hooks/useToggle'
import { useLibrarySelector } from './_hooks/store'
import { LibraryAside } from '@web-ui/components/app/templates/library-aside'
import { ButtonSelect } from '@web-ui/components/app/atoms/button-select'
import { SimpleSelectDropdown } from '@web-ui/components/app/atoms/simple-select-dropdown'
import OutsideClickHandler from 'react-outside-click-handler'
import { useBookmarks } from './_hooks/use-bookmarks'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { Tags } from '@web-ui/components/app/atoms/tags'
import { SelectedTags } from '@web-ui/components/app/atoms/selected-tags'
import { useShallowSearchParams } from '@/hooks/use-push-state-listener'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MonthsSkeleton } from '@web-ui/components/app/atoms/months-skeleton'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { TagsSkeleton } from '@web-ui/components/app/atoms/tags-skeleton'
import { useMonths } from './_hooks/use-months'
import { useFilterViewOptions } from '@/hooks/library/use-filter-view-options'
import { useTagViewOptions } from '@/hooks/library/use-tag-view-options'
import { useDateViewOptions } from '@/hooks/library/use-date-view-options'
import { useSortByViewOptions } from '@/hooks/library/use-sort-by-view-options'
import { useOrderByViewOptions } from '@/hooks/library/use-order-by-view-options'

const Months = dynamic(() => import('./dynamic-months'), {
  ssr: false,
  loading: () => <MonthsSkeleton />,
})

const Page: React.FC = () => {
  const queryParams = useShallowSearchParams()
  const router = useRouter()
  const params = useParams()
  const [showMonths, setShowMonths] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [showTagsSkeleton, setShowTagsSkeleton] = useState(true)
  const {
    bookmarks,
    isGettingFirstBookmarks,
    isGettingMoreBookmarks,
    hasMoreBookmarks,
  } = useLibrarySelector((state) => state.bookmarks)
  const { getBookmarks } = useBookmarks()
  const {
    monthsOfBookmarkCreation,
    monthsOfUrlCreation,
    isGettingMonthsData,
    tagsOfBookmarkCreation,
    tagsOfUrlCreation,
    selectedTags,
  } = useMonths()
  const {
    currentFilter,
    setFilterQueryParam,
    excludeNsfw,
    includeNsfw,
    isNsfwExcluded,
  } = useFilterViewOptions()
  const { currentSortBy, setSortByQueryParam } = useSortByViewOptions()
  const { currentOrderBy, setOrderByQueryParam } = useOrderByViewOptions()
  const { addTagToQueryParams, removeTagFromQueryParams, actualSelectedTags } =
    useTagViewOptions()
  const { setGteLteQueryParams, clearGteLteQueryParams } = useDateViewOptions()
  const [isFilterDropdownVisible, toggleFilterDropdown] = useToggle(false)
  const [isSortByDropdownVisible, toggleSortByDropdown] = useToggle(false)
  const [isOrderByDropdownVisible, toggleOrderByDropdown] = useToggle(false)

  useUpdateEffect(() => {
    if (!showMonths) setShowMonths(true)
    if (!showTags) setShowTags(true)
    if (showTagsSkeleton) setShowTagsSkeleton(false)
  }, [bookmarks])

  useEffect(() => {
    sessionStorage.setItem('queryParams', queryParams.toString())

    return () => {
      sessionStorage.removeItem('queryParams')
    }
  }, [queryParams])

  return (
    <Library
      showBookmarksSkeleton={bookmarks == null}
      titleBar={
        bookmarks != null
          ? queryParams.get('categoryId')
            ? '[category_name]'
            : 'All bookmarks'
          : undefined
      }
      slotSidebar={
        <NavigationForLibrarySidebar
          navigationItems={[
            {
              label: 'All bookmarks',
              onClick: () => {
                router.push(`/${params.username}/library`)
              },
              isActive: queryParams.get('categoryId') ? false : true,
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
                currentValue={_filterOptionToLabel(currentFilter)}
                isActive={isFilterDropdownVisible}
                onClick={toggleFilterDropdown}
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
                          isGettingMonthsData
                        )
                          return
                        if (isNsfwExcluded) {
                          setFilterQueryParam(LibraryFilter.AllNsfwExcluded)
                        } else {
                          setFilterQueryParam(LibraryFilter.All)
                        }
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
                          isGettingMonthsData
                        )
                          return
                        if (isNsfwExcluded) {
                          setFilterQueryParam(
                            LibraryFilter.StarredOnlyNsfwExcluded,
                          )
                        } else {
                          setFilterQueryParam(LibraryFilter.StarredOnly)
                        }
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
                          isGettingMonthsData
                        )
                          return
                        if (isNsfwExcluded) {
                          setFilterQueryParam(
                            LibraryFilter.ArchivedNsfwExcluded,
                          )
                        } else {
                          setFilterQueryParam(LibraryFilter.Archived)
                        }
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
                          isGettingMonthsData
                        )
                          return

                        isNsfwExcluded ? includeNsfw() : excludeNsfw()
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
          slotOrderBy={{
            button: (
              <ButtonSelect
                label="Order by"
                currentValue={_orderByOptionToLabel(currentOrderBy)}
                isActive={isOrderByDropdownVisible}
                onClick={toggleOrderByDropdown}
              />
            ),
            isDropdownVisible: isOrderByDropdownVisible,
            dropdown: (
              <OutsideClickHandler
                onOutsideClick={toggleOrderByDropdown}
                disabled={!isOrderByDropdownVisible}
              >
                <SimpleSelectDropdown
                  items={[
                    {
                      label: _orderByOptionToLabel(OrderBy.Desc),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setOrderByQueryParam(OrderBy.Desc)
                        toggleOrderByDropdown()
                      },

                      isSelected: currentOrderBy == OrderBy.Desc,
                    },
                    {
                      label: _orderByOptionToLabel(OrderBy.Popular),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setOrderByQueryParam(OrderBy.Popular)
                        toggleOrderByDropdown()
                      },
                      isSelected: currentOrderBy == OrderBy.Popular,
                    },
                    {
                      label: _orderByOptionToLabel(OrderBy.Asc),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setOrderByQueryParam(OrderBy.Asc)
                        toggleOrderByDropdown()
                      },
                      isSelected: currentOrderBy == OrderBy.Asc,
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
                currentValue={_sortByOptionToLabel(currentSortBy)}
                isActive={isSortByDropdownVisible}
                onClick={toggleSortByDropdown}
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
                      label: _sortByOptionToLabel(SortBy.BookmarkedAt),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setSortByQueryParam(SortBy.BookmarkedAt)
                        toggleSortByDropdown()
                      },
                      isSelected: currentSortBy == SortBy.BookmarkedAt,
                    },
                    {
                      label: _sortByOptionToLabel(SortBy.PublishedAt),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setSortByQueryParam(SortBy.PublishedAt)
                        toggleSortByDropdown()
                      },
                      isSelected: currentSortBy == SortBy.PublishedAt,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
          slotMonths={
            showMonths ? (
              <div
                style={{
                  pointerEvents:
                    isGettingFirstBookmarks ||
                    isGettingMoreBookmarks ||
                    isGettingMonthsData
                      ? 'none'
                      : 'all',
                }}
              >
                <Months
                  months={
                    currentSortBy == SortBy.BookmarkedAt
                      ? monthsOfBookmarkCreation
                      : monthsOfUrlCreation
                  }
                  onYyyymmChange={setGteLteQueryParams}
                  clearDateRange={clearGteLteQueryParams}
                  currentGte={
                    parseInt(queryParams.get('gte') || '0') || undefined
                  }
                  currentLte={
                    parseInt(queryParams.get('lte') || '0') || undefined
                  }
                  selectedTags={queryParams.get('t') || undefined}
                  hasResults={
                    bookmarks != undefined && !isGettingMonthsData
                      ? bookmarks.length
                        ? true
                        : false
                      : undefined
                  }
                  isGettingData={isGettingMonthsData}
                />
              </div>
            ) : (
              <MonthsSkeleton />
            )
          }
          slotTags={
            <>
              {showTags && (
                <div
                  style={{
                    pointerEvents:
                      isGettingFirstBookmarks ||
                      isGettingMoreBookmarks ||
                      isGettingMonthsData
                        ? 'none'
                        : undefined,
                    opacity:
                      isGettingFirstBookmarks ||
                      isGettingMoreBookmarks ||
                      isGettingMonthsData
                        ? 0.6
                        : undefined,
                  }}
                >
                  {selectedTags.length > 0 && (
                    <SelectedTags
                      selectedTags={selectedTags}
                      onSelectedTagClick={removeTagFromQueryParams}
                    />
                  )}
                  <Tags
                    tags={
                      tagsOfBookmarkCreation && tagsOfUrlCreation
                        ? currentSortBy == SortBy.BookmarkedAt
                          ? Object.fromEntries(
                              Object.entries(tagsOfBookmarkCreation).filter(
                                ([k]) => !selectedTags.includes(k),
                              ),
                            )
                          : Object.fromEntries(
                              Object.entries(tagsOfUrlCreation).filter(
                                ([k]) => !selectedTags.includes(k),
                              ),
                            )
                        : {}
                    }
                    onClick={addTagToQueryParams}
                    key={queryParams.toString()}
                  />
                </div>
              )}
              {showTagsSkeleton && <TagsSkeleton />}
            </>
          }
        />
      }
      isGettingFirstBookmarks={isGettingFirstBookmarks}
      isGettingMoreBookmarks={isGettingMoreBookmarks}
      hasMoreBookmarks={hasMoreBookmarks || false}
      noResults={!bookmarks || bookmarks.length == 0}
      getMoreBookmarks={() => {
        getBookmarks({ shouldGetNextPage: true })
      }}
      slotBookmarks={
        bookmarks && bookmarks.length
          ? bookmarks.map((bookmark) => (
              <Bookmark
                title={bookmark.title}
                onClick={() => {}}
                onMenuClick={() => {}}
                url={bookmark.url}
                saves={bookmark.saves}
                tags={bookmark.tags.map((tag) => {
                  const tags =
                    currentSortBy == SortBy.BookmarkedAt
                      ? tagsOfBookmarkCreation
                      : tagsOfUrlCreation

                  const isSelected = isGettingFirstBookmarks
                    ? selectedTags.find((t) => t == tag) != undefined
                    : actualSelectedTags.find((t) => t == tag) != undefined

                  return {
                    name: tag,
                    isSelected,
                    yields:
                      !isSelected && tags && Object.values(tags).length
                        ? tags[tag]
                        : undefined,
                  }
                })}
                isNsfw={bookmark.isNsfw}
                isStarred={bookmark.isStarred}
                key={bookmark.id}
                sitePath={bookmark.sitePath}
                onTagClick={addTagToQueryParams}
                onSelectedTagClick={removeTagFromQueryParams}
              />
            ))
          : []
      }
    />
  )
}

export default Page

function _sortByOptionToLabel(sortByOption: SortBy): string {
  switch (sortByOption) {
    case SortBy.BookmarkedAt:
      return 'Bookmarked at'
    case SortBy.PublishedAt:
      return 'Published at'
  }
}

function _orderByOptionToLabel(orderByOption: OrderBy): string {
  switch (orderByOption) {
    case OrderBy.Desc:
      return 'Most recent'
    case OrderBy.Asc:
      return 'Oldest'
    case OrderBy.Popular:
      return 'Saves count'
  }
}

function _filterOptionToLabel(filter: LibraryFilter): string {
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
