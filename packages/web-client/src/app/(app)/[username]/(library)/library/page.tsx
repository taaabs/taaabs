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
import { Months } from '@web-ui/components/app/atoms/months'
import { Tags } from '@web-ui/components/app/atoms/tags'
import { SelectedTags } from '@web-ui/components/app/atoms/selected-tags'
import { useShallowSearchParams } from '@/hooks/use-push-state-listener'

const Page: React.FC = () => {
  const queryParams = useShallowSearchParams()
  const router = useRouter()
  const params = useParams()
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
                      label: 'Archived only',
                      onClick: () => {
                        if (
                          isGettingFirstBookmarks ||
                          isGettingMoreBookmarks ||
                          isGettingMonthsData
                        )
                          return
                        if (isNsfwExcluded) {
                          setFilterQueryParam(
                            LibraryFilter.ArchivedOnlyNsfwExcluded,
                          )
                        } else {
                          setFilterQueryParam(LibraryFilter.ArchivedOnly)
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        currentFilter == LibraryFilter.ArchivedOnly ||
                        currentFilter == LibraryFilter.ArchivedOnlyNsfwExcluded,
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
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
        >
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
              onYyyymmChange={({ gte, lte }) => {
                setGteLteQueryParams({ gte, lte })
              }}
              clearDateRange={() => {
                clearGteLteQueryParams()
              }}
              currentGte={parseInt(queryParams.get('gte') || '0') || undefined}
              currentLte={parseInt(queryParams.get('lte') || '0') || undefined}
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
          <div
            style={{
              pointerEvents:
                isGettingFirstBookmarks ||
                isGettingMoreBookmarks ||
                isGettingMonthsData
                  ? 'none'
                  : undefined,
              opacity: isGettingFirstBookmarks ? 0.5 : undefined,
            }}
          >
            <SelectedTags
              selectedTags={selectedTags}
              onSelectedTagClick={removeTagFromQueryParams}
            />
          </div>
          <div
            style={{
              pointerEvents:
                isGettingMoreBookmarks || isGettingFirstBookmarks
                  ? 'none'
                  : undefined,
              opacity: isGettingFirstBookmarks ? 0.5 : undefined,
            }}
          >
            <Tags
              tags={
                tagsOfBookmarkCreation && tagsOfUrlCreation
                  ? currentOrderBy == OrderBy.BookmarkCreationDate
                    ? tagsOfBookmarkCreation
                    : tagsOfUrlCreation
                  : {}
              }
              onClick={addTagToQueryParams}
            />
          </div>
        </LibraryAside>
      }
      isGettingFirstBookmarks={isGettingFirstBookmarks}
      isGettingMoreBookmarks={isGettingMoreBookmarks}
      hasMoreBookmarks={hasMoreBookmarks || false}
      noResults={!bookmarks || !bookmarks.length}
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

                  const isSelected =
                    selectedTags.find((t) => t == tag) != undefined

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
      return 'Newest to Oldest'
    case Order.Asc:
      return 'Oldest to Newest'
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
    case LibraryFilter.ArchivedOnly:
      return 'Archived only'
    case LibraryFilter.ArchivedOnlyNsfwExcluded:
      return 'Archived only without nsfw'
  }
}
