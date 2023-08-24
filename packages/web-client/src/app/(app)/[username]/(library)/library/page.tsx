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
import { Sort } from '@shared/types/modules/bookmarks/sort'
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
import { useSortByViewOptions } from '@/hooks/library/use-sort-by-view-options copy'
import { useSortViewOptions } from '@/hooks/library/use-sort-view-options'

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
  const { currentSort, setSortQueryParam } = useSortViewOptions()
  const { addTagToQueryParams, removeTagFromQueryParams, actualSelectedTags } =
    useTagViewOptions()
  const { setGteLteQueryParams, clearGteLteQueryParams } = useDateViewOptions()
  const [isFilterDropdownVisible, toggleFilterDropdown] = useToggle(false)
  const [isSortByDropdownVisible, toggleSortByDropdown] = useToggle(false)
  const [isSortDropdownVisible, toggleSortDropdown] = useToggle(false)

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
          slotSort={{
            button: (
              <ButtonSelect
                label="Sort"
                currentValue={_orderOptionToLabel(currentSort)}
                isActive={isSortDropdownVisible}
                onClick={toggleSortDropdown}
              />
            ),
            isDropdownVisible: isSortDropdownVisible,
            dropdown: (
              <OutsideClickHandler
                onOutsideClick={toggleSortDropdown}
                disabled={!isSortDropdownVisible}
              >
                <SimpleSelectDropdown
                  items={[
                    {
                      label: _orderOptionToLabel(Sort.Latest),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setSortQueryParam(Sort.Latest)
                        toggleSortDropdown()
                      },

                      isSelected: currentSort == Sort.Latest,
                    },
                    {
                      label: _orderOptionToLabel(Sort.Popular),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setSortQueryParam(Sort.Popular)
                        toggleSortDropdown()
                      },
                      isSelected: currentSort == Sort.Popular,
                    },
                    {
                      label: _orderOptionToLabel(Sort.Oldest),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setSortQueryParam(Sort.Oldest)
                        toggleSortDropdown()
                      },
                      isSelected: currentSort == Sort.Oldest,
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
                currentValue={_orderByOptionToLabel(currentSortBy)}
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
                      label: _orderByOptionToLabel(SortBy.BookmarkCreationDate),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setSortByQueryParam(SortBy.BookmarkCreationDate)
                        toggleSortByDropdown()
                      },
                      isSelected: currentSortBy == SortBy.BookmarkCreationDate,
                    },
                    {
                      label: _orderByOptionToLabel(SortBy.UrlCreationDate),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setSortByQueryParam(SortBy.UrlCreationDate)
                        toggleSortByDropdown()
                      },
                      isSelected: currentSortBy == SortBy.UrlCreationDate,
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
                    currentSortBy == SortBy.BookmarkCreationDate
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
                        ? currentSortBy == SortBy.BookmarkCreationDate
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
                    currentSortBy == SortBy.BookmarkCreationDate
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

function _orderByOptionToLabel(orderByOption: SortBy): string {
  switch (orderByOption) {
    case SortBy.BookmarkCreationDate:
      return 'Bookmark date'
    case SortBy.UrlCreationDate:
      return 'Link date'
  }
}

function _orderOptionToLabel(orderOption: Sort): string {
  switch (orderOption) {
    case Sort.Latest:
      return 'Latest'
    case Sort.Oldest:
      return 'Oldest'
    case Sort.Popular:
      return 'Popular'
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
