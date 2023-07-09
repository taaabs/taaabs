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
import { SortOption, useSortOptions } from './_hooks/use-sort-options'
import { useBookmarks } from './_hooks/use-bookmarks'
import { FilterOption, useFilterOptions } from './_hooks/use-filter-options'

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
  const { getBookmarks } = useBookmarks()
  const { selectedSortOption, setSelectedSortOption } = useSortOptions(
    parseInt(queryParams.get('s') || SortOption.NewestToOldest.toString()),
  )
  const {
    selectedFilterOption,
    setSelectedFilterOption,
    withArchived,
    setWithArchived,
    withoutNsfw,
    setWithoutNsfw,
  } = useFilterOptions(
    parseInt(queryParams.get('f') || FilterOption.All.toString()),
  )

  const [isFilterDropdownVisible, toggleFilterDropdown] = useToggle(false)
  const [isSortDropdownVisible, toggleSortDropdown] = useToggle(false)

  return (
    <Library
      showBookmarksSkeleton={bookmarks == null}
      titleBar={
        bookmarks != null
          ? {
              primaryText: queryParams.get('categoryId')
                ? '[category_name]'
                : 'All bookmarks',
              secondaryText: '1234',
            }
          : undefined
      }
      slotAside={
        <LibraryAside
          slotFilter={{
            button: (
              <ButtonSelect
                label="Filter"
                currentValue={_filterOptionToLabel(selectedFilterOption)}
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
                        if (withArchived && !withoutNsfw) {
                          setSelectedFilterOption(FilterOption.AllWithArchived)
                        } else if (withoutNsfw && !withArchived) {
                          setSelectedFilterOption(FilterOption.AllWithoutNsfw)
                        } else if (withoutNsfw && withArchived) {
                          setSelectedFilterOption(
                            FilterOption.AllWithArchivedWithoutNsfw,
                          )
                        } else {
                          setSelectedFilterOption(FilterOption.All)
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilterOption == FilterOption.All ||
                        selectedFilterOption == FilterOption.AllWithArchived ||
                        selectedFilterOption ==
                          FilterOption.AllWithArchivedWithoutNsfw ||
                        selectedFilterOption == FilterOption.AllWithoutNsfw,
                    },
                    {
                      label: 'Starred only',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        if (withArchived && !withoutNsfw) {
                          setSelectedFilterOption(
                            FilterOption.StarredOnlyWithArchived,
                          )
                        } else if (withoutNsfw && !withArchived) {
                          setSelectedFilterOption(
                            FilterOption.StarredOnlyWithoutNsfw,
                          )
                        } else if (withoutNsfw && withArchived) {
                          setSelectedFilterOption(
                            FilterOption['StarredOnlyWithArchivedWithoutNsfw'],
                          )
                        } else {
                          setSelectedFilterOption(FilterOption.StarredOnly)
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilterOption == FilterOption.StarredOnly ||
                        selectedFilterOption ==
                          FilterOption.StarredOnlyWithArchived ||
                        selectedFilterOption ==
                          FilterOption['StarredOnlyWithArchivedWithoutNsfw'] ||
                        selectedFilterOption ==
                          FilterOption.StarredOnlyWithoutNsfw,
                    },
                    {
                      label: 'NSFW only',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return

                        if (withArchived) {
                          setSelectedFilterOption(
                            FilterOption.NsfwOnlyWithArchived,
                          )
                        } else {
                          setSelectedFilterOption(FilterOption.NsfwOnly)
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilterOption == FilterOption.NsfwOnly ||
                        selectedFilterOption ==
                          FilterOption.NsfwOnlyWithArchived,
                    },
                    {
                      label: 'Archived only',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        if (withoutNsfw) {
                          setSelectedFilterOption(
                            FilterOption.ArchivedOnlyWithoutNsfw,
                          )
                        } else {
                          setSelectedFilterOption(FilterOption.ArchivedOnly)
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilterOption == FilterOption.ArchivedOnly ||
                        selectedFilterOption ==
                          FilterOption.ArchivedOnlyWithoutNsfw,
                    },
                  ]}
                  checkboxes={[
                    {
                      label: 'Include archived',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        setWithArchived(!withArchived)
                        toggleFilterDropdown()
                      },
                      isSelected: withArchived,
                      isDisabled:
                        selectedFilterOption == FilterOption.ArchivedOnly ||
                        selectedFilterOption ==
                          FilterOption.ArchivedOnlyWithoutNsfw,
                    },
                    {
                      label: 'Exclude NSFW',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        setWithoutNsfw(!withoutNsfw)
                        toggleFilterDropdown()
                      },
                      isSelected: withoutNsfw,
                      isDisabled:
                        selectedFilterOption == FilterOption.NsfwOnly ||
                        selectedFilterOption ==
                          FilterOption.NsfwOnlyWithArchived,
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
                currentValue={_sortOptionToLabel(selectedSortOption)}
                isActive={isSortDropdownVisible}
                onClick={toggleSortDropdown}
              />
            ),
            dropdown: (
              <OutsideClickHandler
                onOutsideClick={toggleSortDropdown}
                disabled={!isSortDropdownVisible}
              >
                <SimpleSelectDropdown
                  items={[
                    {
                      label: _sortOptionToLabel(SortOption.NewestToOldest),
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        setSelectedSortOption(SortOption.NewestToOldest)
                        toggleSortDropdown()
                      },
                      isSelected:
                        selectedSortOption == SortOption.NewestToOldest,
                    },
                    {
                      label: _sortOptionToLabel(SortOption.OldestToNewest),
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        setSelectedSortOption(SortOption.OldestToNewest)
                        toggleSortDropdown()
                      },
                      isSelected:
                        selectedSortOption == SortOption.OldestToNewest,
                    },
                  ]}
                />
              </OutsideClickHandler>
            ),
            isDropdownVisible: isSortDropdownVisible,
          }}
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

function _sortOptionToLabel(sortOption: SortOption): string {
  if (sortOption == SortOption.NewestToOldest) {
    return 'Newest to Oldest'
  }
  return 'Oldest to Newest'
}

function _filterOptionToLabel(filterOption: FilterOption): string {
  switch (filterOption) {
    case FilterOption.All:
      return 'All'
    case FilterOption.AllWithArchived:
      return 'All + archived'
    case FilterOption.AllWithArchivedWithoutNsfw:
      return 'All + archived - nsfw'
    case FilterOption.AllWithoutNsfw:
      return 'All - nsfw'
    case FilterOption.StarredOnly:
      return 'Starred only'
    case FilterOption.StarredOnlyWithArchived:
      return 'Starred only + archived'
    case FilterOption.StarredOnlyWithArchivedWithoutNsfw:
      return 'Starred only + archived - nsfw'
    case FilterOption.StarredOnlyWithoutNsfw:
      return 'Starred only - nsfw'
    case FilterOption.NsfwOnly:
      return 'NSFW only'
    case FilterOption.NsfwOnlyWithArchived:
      return 'NSFW only + archived'
    case FilterOption.NsfwOnlyWithArchived:
      return 'NSFW only + archived'
    case FilterOption.ArchivedOnly:
      return 'Archived only'
    case FilterOption.ArchivedOnlyWithoutNsfw:
      return 'Archived only - nsfw'
  }
}
