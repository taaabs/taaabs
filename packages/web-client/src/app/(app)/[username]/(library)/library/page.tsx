'use client'

import { NavigationForLibrarySidebar } from '@web-ui/components/app/atoms/navigation-for-library-sidebar'
import { Bookmark } from '@web-ui/components/app/molecules/bookmark'
import { Library } from '@web-ui/components/app/templates/library'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
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
import { useTags } from './_hooks/use-tags'
import { Months } from '@web-ui/components/app/atoms/months'

const Page: React.FC = () => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const {
    bookmarks,
    isGettingFirstBookmarks,
    isGettingMoreBookmarks,
    hasMoreBookmarks,
  } = useLibrarySelector((state) => state.bookmarks)
  // const { isGettingData: isGettingMonthsData } = useLibrarySelector(
  //   (state) => state.months,
  // )
  const { getBookmarks } = useBookmarks()
  const { monthsOfBookmarkCreation, monthsOfUrlCreation } = useMonths()
  const { yyyymmGte, setYyyymmGte, yyyymmLte, setYyyymmLte } = useTags({
    initYyyymmGte: parseInt(queryParams.get('gte') || '0') || null,
    initYyyymmLte: parseInt(queryParams.get('lte') || '0') || null,
  })
  const { orderBy, setOrderBy, order, setOrder } = useOrderOptions({
    initOrderBy:
      Object.values(OrderBy)[
        parseInt(
          queryParams.get('b') ||
            Object.values(OrderBy)
              .indexOf(BookmarksFetchingDefaults.Common.orderBy)
              .toString(),
        )
      ],
    initOrder:
      Object.values(Order)[
        parseInt(
          queryParams.get('o') ||
            Object.values(Order)
              .indexOf(BookmarksFetchingDefaults.Common.order)
              .toString(),
        )
      ],
  })
  const { selectedFilter, setFilter, isNsfwExcluded, toggleExcludeNsfw } =
    useFilterOptions(
      Object.values(LibraryFilter)[
        parseInt(
          queryParams.get('f') ||
            Object.values(LibraryFilter)
              .indexOf(BookmarksFetchingDefaults.Common.filter)
              .toString(),
        )
      ],
    )

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
      slotAside={
        <LibraryAside
          slotFilter={{
            button: (
              <ButtonSelect
                label="Filter"
                currentValue={_filterOptionToLabel(selectedFilter)}
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
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        if (isNsfwExcluded) {
                          setFilter(LibraryFilter.AllNsfwExcluded)
                        } else {
                          setFilter(LibraryFilter.All)
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilter == LibraryFilter.All ||
                        selectedFilter == LibraryFilter.AllNsfwExcluded,
                    },
                    {
                      label: 'Starred only',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        if (isNsfwExcluded) {
                          setFilter(LibraryFilter.StarredOnlyNsfwExcluded)
                        } else {
                          setFilter(LibraryFilter.StarredOnly)
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilter == LibraryFilter.StarredOnly ||
                        selectedFilter == LibraryFilter.StarredOnlyNsfwExcluded,
                    },
                    {
                      label: 'Archived only',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        if (isNsfwExcluded) {
                          setFilter(LibraryFilter.ArchivedOnlyNsfwExcluded)
                        } else {
                          setFilter(LibraryFilter.ArchivedOnly)
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilter == LibraryFilter.ArchivedOnly ||
                        selectedFilter ==
                          LibraryFilter.ArchivedOnlyNsfwExcluded,
                    },
                  ]}
                  checkboxes={[
                    {
                      label: 'Exclude NSFW',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        toggleExcludeNsfw()
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
                currentValue={_orderByOptionToLabel(orderBy)}
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
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        setOrderBy(OrderBy.BookmarkCreationDate)
                        toggleOrderByDropdown()
                      },
                      isSelected: orderBy == OrderBy.BookmarkCreationDate,
                    },
                    {
                      label: _orderByOptionToLabel(OrderBy.UrlCreationDate),
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        setOrderBy(OrderBy.UrlCreationDate)
                        toggleOrderByDropdown()
                      },
                      isSelected: orderBy == OrderBy.UrlCreationDate,
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
                currentValue={_orderOptionToLabel(order)}
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
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        setOrder(Order.Desc)
                        toggleOrderDropdown()
                      },
                      isSelected: order == Order.Desc,
                    },
                    {
                      label: _orderOptionToLabel(Order.Asc),
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        setOrder(Order.Asc)
                        toggleOrderDropdown()
                      },
                      isSelected: order == Order.Asc,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
          }}
          slotMonths={
            <Months
              months={
                orderBy == OrderBy.BookmarkCreationDate
                  ? monthsOfBookmarkCreation
                  : monthsOfUrlCreation
              }
              onYymmChange={({ yyyymmGte, yyyymmLte }) => {
                setYyyymmGte(yyyymmGte)
                setYyyymmLte(yyyymmLte)
              }}
              currentYyyymmGte={yyyymmGte || undefined}
              currentYyyymmLte={yyyymmLte || undefined}
            />
          }
        />
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
                site="site"
                onSiteClick={() => {}}
                onSavesClick={() => {}}
                onDateClick={() => {}}
                url={bookmark.url}
                createdAt={new Date(bookmark.createdAt)}
                saves={bookmark.saves}
                tags={bookmark.tags}
                isNsfw={bookmark.isNsfw}
                isStarred={bookmark.isStarred}
                key={bookmark.id}
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
