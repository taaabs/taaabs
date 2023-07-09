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
    queryParams.get('s') == 'asc' ? 'oldest-to-newest' : 'newest-to-oldest',
  )
  const {
    selectedFilterOption,
    setSelectedFilterOption,
    withArchived,
    setWithArchived,
    withoutNsfw,
    setWithoutNsfw,
  } = useFilterOptions(
    parseInt(queryParams.get('f') || FilterOption.all.toString()),
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
                          setSelectedFilterOption(
                            FilterOption['all-with-archived'],
                          )
                        } else if (withoutNsfw && !withArchived) {
                          setSelectedFilterOption(
                            FilterOption['all-without-nsfw'],
                          )
                        } else if (withoutNsfw && withArchived) {
                          setSelectedFilterOption(
                            FilterOption['all-with-archived-without-nsfw'],
                          )
                        } else {
                          setSelectedFilterOption(FilterOption.all)
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilterOption == FilterOption['all'] ||
                        selectedFilterOption ==
                          FilterOption['all-with-archived'] ||
                        selectedFilterOption ==
                          FilterOption['all-with-archived-without-nsfw'] ||
                        selectedFilterOption ==
                          FilterOption['all-without-nsfw'],
                    },
                    {
                      label: 'Starred only',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        if (withArchived && !withoutNsfw) {
                          setSelectedFilterOption(
                            FilterOption['starred-only-with-archived'],
                          )
                        } else if (withoutNsfw && !withArchived) {
                          setSelectedFilterOption(
                            FilterOption['starred-only-without-nsfw'],
                          )
                        } else if (withoutNsfw && withArchived) {
                          setSelectedFilterOption(
                            FilterOption[
                              'starred-only-with-archived-without-nsfw'
                            ],
                          )
                        } else {
                          setSelectedFilterOption(FilterOption['starred-only'])
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilterOption == FilterOption['starred-only'] ||
                        selectedFilterOption ==
                          FilterOption['starred-only-with-archived'] ||
                        selectedFilterOption ==
                          FilterOption[
                            'starred-only-with-archived-without-nsfw'
                          ] ||
                        selectedFilterOption ==
                          FilterOption['starred-only-without-nsfw'],
                    },
                    {
                      label: 'NSFW only',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return

                        if (withArchived) {
                          setSelectedFilterOption(
                            FilterOption['nsfw-only-with-archived'],
                          )
                        } else {
                          setSelectedFilterOption(FilterOption['nsfw-only'])
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilterOption == FilterOption['nsfw-only'] ||
                        selectedFilterOption ==
                          FilterOption['nsfw-only-with-archived'],
                    },
                    {
                      label: 'Archived only',
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        if (withoutNsfw) {
                          setSelectedFilterOption(
                            FilterOption['archived-only-without-nsfw'],
                          )
                        } else {
                          setSelectedFilterOption(FilterOption['archived-only'])
                        }
                        toggleFilterDropdown()
                      },
                      isSelected:
                        selectedFilterOption == FilterOption['archived-only'] ||
                        selectedFilterOption ==
                          FilterOption['archived-only-without-nsfw'],
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
                        selectedFilterOption == FilterOption['archived-only'] ||
                        selectedFilterOption ==
                          FilterOption['archived-only-without-nsfw'],
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
                        selectedFilterOption == FilterOption['nsfw-only'] ||
                        selectedFilterOption ==
                          FilterOption['nsfw-only-with-archived'],
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
                      label: _sortOptionToLabel('newest-to-oldest'),
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        setSelectedSortOption('newest-to-oldest')
                        toggleSortDropdown()
                      },
                      isSelected: selectedSortOption == 'newest-to-oldest',
                    },
                    {
                      label: _sortOptionToLabel('oldest-to-newest'),
                      onClick: () => {
                        if (isGettingFirstBookmarks || isGettingMoreBookmarks)
                          return
                        setSelectedSortOption('oldest-to-newest')
                        toggleSortDropdown()
                      },
                      isSelected: selectedSortOption == 'oldest-to-newest',
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
  if (sortOption == 'newest-to-oldest') {
    return 'Newest to Oldest'
  }
  return 'Oldest to Newest'
}

function _filterOptionToLabel(filterOption: FilterOption): string {
  switch (filterOption) {
    case FilterOption.all:
      return 'All'
    case FilterOption['all-with-archived']:
      return 'All + archived'
    case FilterOption['all-with-archived-without-nsfw']:
      return 'All + archived - nsfw'
    case FilterOption['all-without-nsfw']:
      return 'All - nsfw'
    case FilterOption['starred-only']:
      return 'Starred only'
    case FilterOption['starred-only-with-archived']:
      return 'Starred only + archived'
    case FilterOption['starred-only-with-archived-without-nsfw']:
      return 'Starred only + archived - nsfw'
    case FilterOption['starred-only-without-nsfw']:
      return 'Starred only - nsfw'
    case FilterOption['nsfw-only']:
      return 'NSFW only'
    case FilterOption['nsfw-only-with-archived']:
      return 'NSFW only + archived'
    case FilterOption['nsfw-only-with-archived']:
      return 'NSFW only + archived'
    case FilterOption['archived-only']:
      return 'Archived only'
    case FilterOption['archived-only-without-nsfw']:
      return 'Archived only - nsfw'
  }
}
