'use client'

import { NavigationForLibrarySidebar } from '@web-ui/components/app/atoms/navigation-for-library-sidebar'
import { Bookmark } from '@web-ui/components/app/molecules/bookmark'
import { Library } from '@web-ui/components/app/templates/library'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useIsHydrated } from '@shared/hooks'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import useToggle from 'beautiful-react-hooks/useToggle'
import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { bookmarksActions } from '@repositories/stores/other-user/library/bookmarks/bookmarks.slice'
import { useLibraryDispatch, useLibrarySelector } from './_hooks/store'
import { LibraryAside } from '@web-ui/components/app/templates/library-aside'
import { ButtonSelect } from '@web-ui/components/app/atoms/button-select'
import { SimpleSelectDropdown } from '@web-ui/components/app/atoms/simple-select-dropdown'
import OutsideClickHandler from 'react-outside-click-handler'
import { SortOption, useSortOptions } from './_hooks/use-sort-options'
import { SortBy } from '@shared/dtos/modules/bookmarks/sort-by'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const Page: React.FC = () => {
  const queryParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const isHydrated = useIsHydrated()
  const dispatch = useLibraryDispatch()
  const {
    bookmarks,
    isGettingFirstBookmarks,
    isGettingMoreBookmarks,
    hasMoreBookmarks,
  } = useLibrarySelector((state) => state.bookmarks)
  const { selectedSortOption, setSelectedSortOption } = useSortOptions(
    queryParams.get('s') == 'asc' ? 'oldest-to-newest' : 'newest-to-oldest',
  )

  const [isFilterDropdownVisible, toggleFilterDropdown] = useToggle(false)
  const [isSortDropdownVisible, toggleSortDropdown] = useToggle(false)

  const getBookmarks = ({ getNextPage }: { getNextPage?: boolean }) => {
    const getBookmarksParams: BookmarksParams.Public = {
      username: params.username,
    }

    const queryTags = queryParams.get('t')
    if (queryTags) {
      getBookmarksParams.tags = queryTags.split(',')
    }

    const queryCategoryId = queryParams.get('c')
    if (queryCategoryId) {
      getBookmarksParams.categoryId = queryCategoryId
    }

    const querySortBy = queryParams.get('s')
    if (querySortBy) {
      let sortBy: SortBy
      if (querySortBy == 'asc') {
        sortBy = SortBy.DATE_ASC
      } else {
        sortBy = SortBy.DATE_DESC
      }
      getBookmarksParams.sortBy = sortBy
    }

    if (getNextPage) {
      if (!bookmarks) throw 'Bookmarks should be there.'
      getBookmarksParams.after = bookmarks.slice(-1)[0].id
    }

    dispatch(
      bookmarksActions.getBookmarks({
        params: getBookmarksParams,
        apiUrl,
      }),
    )
  }

  useUpdateEffect(() => {
    getBookmarks({})
  }, [queryParams])

  useUpdateEffect(() => {
    sessionStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    sessionStorage.setItem('hasMoreBookmarks', JSON.stringify(hasMoreBookmarks))
    sessionStorage.setItem('queryParams', queryParams.toString())
  }, [bookmarks])

  useEffect(() => {
    const bookmarks = sessionStorage.getItem('bookmarks')
    if (
      bookmarks &&
      queryParams.toString() == sessionStorage.getItem('queryParams')
    ) {
      dispatch(bookmarksActions.setBookmarks(JSON.parse(bookmarks)))
      const hasMoreBookmarks = sessionStorage.getItem('hasMoreBookmarks')
      if (hasMoreBookmarks) {
        dispatch(
          bookmarksActions.setHasMoreBookmarks(hasMoreBookmarks == 'true'),
        )
      }
    } else {
      getBookmarks({})
    }
    return () => {
      sessionStorage.removeItem('bookmarks')
      sessionStorage.removeItem('hasMoreBookmarks')
      sessionStorage.removeItem('queryParams')
    }
  }, [])

  return (
    <Library
      titleBar={
        isHydrated
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
                currentValue="All"
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
                      onClick: () => {},
                      isSelected: true,
                    },
                    {
                      label: 'Starred only',
                      onClick: () => {},
                      isSelected: false,
                    },
                    {
                      label: 'NSFW only',
                      onClick: () => {},
                      isSelected: false,
                    },
                    {
                      label: 'Archived only',
                      onClick: () => {},
                      isSelected: false,
                    },
                  ]}
                  checkboxes={[
                    {
                      label: 'Include archived',
                      onClick: () => {},
                      isSelected: true,
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
