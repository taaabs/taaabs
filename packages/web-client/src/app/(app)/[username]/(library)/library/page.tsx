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
import { useOrderOptions } from './_hooks/use-order-options'
import { useBookmarks } from './_hooks/use-bookmarks'
import { useFilterOptions } from './_hooks/use-filter-options'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useMonths } from './_hooks/use-months'
import { Tags } from '@web-ui/components/app/atoms/tags'
import { SelectedTags } from '@web-ui/components/app/atoms/selected-tags'
import { useShallowSearchParams } from '@/hooks/use-push-state-listener'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MonthsSkeleton } from '@web-ui/components/app/atoms/months-skeleton'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { TagsSkeleton } from '@web-ui/components/app/atoms/tags-skeleton'

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
    setGteLteQueryParams,
    clearGteLteQueryParams,
    tagsOfBookmarkCreation,
    tagsOfUrlCreation,
    selectedTags,
    incomingSelectedTags,
    addTagToQueryParams,
    removeTagFromQueryParams,
  } = useMonths()
  const { currentOrderBy, setOrderByQueryParam, setOrderQueryParam } =
    useOrderOptions()
  const {
    currentFilter,
    setFilterQueryParam,
    excludeNsfw,
    includeNsfw,
    isNsfwExcluded,
  } = useFilterOptions()

  const [isFilterDropdownVisible, toggleFilterDropdown] = useToggle(false)
  const [isOrderByDropdownVisible, toggleOrderByDropdown] = useToggle(false)
  const [isOrderDropdownVisible, toggleOrderDropdown] = useToggle(false)

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
            {
              label: 'Categories',
              onClick: () => {},
              isActive: queryParams.get('categoryId') ? true : false,
            },
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
                      label: _orderByOptionToLabel(
                        OrderBy.BookmarkCreationDate,
                      ),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setOrderByQueryParam(OrderBy.BookmarkCreationDate)
                        toggleOrderByDropdown()
                      },
                      isSelected:
                        parseInt(
                          queryParams.get('b') ||
                            Object.values(OrderBy)
                              .indexOf(BookmarksFetchingDefaults.Common.orderBy)
                              .toString(),
                        ) ==
                        Object.values(OrderBy).indexOf(
                          OrderBy.BookmarkCreationDate,
                        ),
                    },
                    {
                      label: _orderByOptionToLabel(OrderBy.UrlCreationDate),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setOrderByQueryParam(OrderBy.UrlCreationDate)
                        toggleOrderByDropdown()
                      },
                      isSelected:
                        parseInt(
                          queryParams.get('b') ||
                            Object.values(OrderBy)
                              .indexOf(BookmarksFetchingDefaults.Common.orderBy)
                              .toString(),
                        ) ==
                        Object.values(OrderBy).indexOf(OrderBy.UrlCreationDate),
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
          slotOrder={{
            button: (
              <ButtonSelect
                label="Order"
                currentValue={_orderOptionToLabel(
                  Object.values(Order)[
                    parseInt(
                      queryParams.get('o') ||
                        Object.values(Order)
                          .indexOf(BookmarksFetchingDefaults.Common.order)
                          .toString(),
                    )
                  ],
                )}
                isActive={isOrderDropdownVisible}
                onClick={toggleOrderDropdown}
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
                      label: _orderOptionToLabel(Order.Desc),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setOrderQueryParam(Order.Desc)
                        toggleOrderDropdown()
                      },

                      isSelected:
                        parseInt(
                          queryParams.get('o') ||
                            Object.values(Order)
                              .indexOf(BookmarksFetchingDefaults.Common.order)
                              .toString(),
                        ) == Object.values(Order).indexOf(Order.Desc),
                    },
                    {
                      label: _orderOptionToLabel(Order.Asc),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setOrderQueryParam(Order.Asc)
                        toggleOrderDropdown()
                      },
                      isSelected:
                        parseInt(
                          queryParams.get('o') ||
                            Object.values(Order)
                              .indexOf(BookmarksFetchingDefaults.Common.order)
                              .toString(),
                        ) == Object.values(Order).indexOf(Order.Asc),
                    },
                    {
                      label: _orderOptionToLabel(Order.MostPopular),
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        setOrderQueryParam(Order.MostPopular)
                        toggleOrderDropdown()
                      },
                      isSelected:
                        parseInt(
                          queryParams.get('o') ||
                            Object.values(Order)
                              .indexOf(BookmarksFetchingDefaults.Common.order)
                              .toString(),
                        ) == Object.values(Order).indexOf(Order.MostPopular),
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
                    currentOrderBy == OrderBy.BookmarkCreationDate
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
              {selectedTags.length > 0 && (
                <div
                  style={{
                    pointerEvents:
                      isGettingFirstBookmarks ||
                      isGettingMoreBookmarks ||
                      isGettingMonthsData
                        ? 'none'
                        : undefined,
                  }}
                >
                  <SelectedTags
                    selectedTags={incomingSelectedTags}
                    onSelectedTagClick={(tag) => {
                      setShowTags(false)
                      removeTagFromQueryParams(tag)
                    }}
                  />
                </div>
              )}
              {showTags && (
                <Tags
                  tags={
                    tagsOfBookmarkCreation && tagsOfUrlCreation
                      ? currentOrderBy == OrderBy.BookmarkCreationDate
                        ? tagsOfBookmarkCreation
                        : tagsOfUrlCreation
                      : {}
                  }
                  onClick={(tag) => {
                    setShowTags(false)
                    addTagToQueryParams(tag)
                  }}
                  key={queryParams.toString()}
                />
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
        getBookmarks({ getNextPage: true })
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
                    currentOrderBy == OrderBy.BookmarkCreationDate
                      ? tagsOfBookmarkCreation
                      : tagsOfUrlCreation

                  const isSelected = isGettingFirstBookmarks
                    ? selectedTags.find((t) => t == tag) != undefined
                    : incomingSelectedTags.find((t) => t == tag) != undefined

                  return {
                    name: tag,
                    isSelected,
                    yields:
                      !isSelected && tags && Object.values(tags).length
                        ? tags[tag]
                          ? tags[tag]
                          : 1
                        : undefined,
                  }
                })}
                isNsfw={bookmark.isNsfw}
                isStarred={bookmark.isStarred}
                key={bookmark.id + selectedTags.join('')}
                sitePath={bookmark.sitePath}
                onTagClick={(tag) => {
                  setShowTags(false)
                  addTagToQueryParams(tag)
                }}
                onSelectedTagClick={(tag) => {
                  setShowTags(false)
                  removeTagFromQueryParams(tag)
                }}
              />
            ))
          : []
      }
    />
  )
}

export default Page

function _orderByOptionToLabel(orderByOption: OrderBy): string {
  switch (orderByOption) {
    case OrderBy.BookmarkCreationDate:
      return 'Bookmarked at'
    case OrderBy.UrlCreationDate:
      return 'Link first seen at'
  }
}

function _orderOptionToLabel(orderOption: Order): string {
  switch (orderOption) {
    case Order.Desc:
      return 'Newest to oldest'
    case Order.Asc:
      return 'Oldest to newest'
    case Order.MostPopular:
      return 'Most popular'
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
