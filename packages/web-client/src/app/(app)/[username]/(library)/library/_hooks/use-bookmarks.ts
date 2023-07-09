import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { SortBy } from '@shared/dtos/modules/bookmarks/sort-by'
import { useParams, useSearchParams } from 'next/navigation'
import { useLibraryDispatch, useLibrarySelector } from './store'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { bookmarksActions } from '@repositories/stores/other-user/library/bookmarks/bookmarks.slice'
import { useEffect } from 'react'
import { FilterOption } from './use-filter-options'
import { ArchivedBookmarks } from '@shared/dtos/modules/bookmarks/archived-bookmarks'
import { NsfwBookmarks } from '@shared/dtos/modules/bookmarks/nsfw-bookmarks'
import { SortOption } from './use-sort-options'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const useBookmarks = () => {
  const queryParams = useSearchParams()
  const params = useParams()
  const dispatch = useLibraryDispatch()
  const { bookmarks, hasMoreBookmarks } = useLibrarySelector(
    (state) => state.bookmarks,
  )

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
      if (querySortBy == SortOption.OldestToNewest.toString()) {
        sortBy = SortBy.DATE_ASC
      } else {
        sortBy = SortBy.DATE_DESC
      }
      getBookmarksParams.sortBy = sortBy
    }

    const queryFilter = parseInt(
      queryParams.get('f') || FilterOption.All.toString(),
    )
    if (queryFilter != FilterOption.All) {
      if (queryFilter == FilterOption.AllWithArchived) {
        getBookmarksParams.archived = ArchivedBookmarks.INCLUDE
      } else if (queryFilter == FilterOption.AllWithArchivedWithoutNsfw) {
        getBookmarksParams.archived = ArchivedBookmarks.INCLUDE
        getBookmarksParams.nsfw = NsfwBookmarks.EXCLUDE
      } else if (queryFilter == FilterOption.AllWithoutNsfw) {
        getBookmarksParams.nsfw = NsfwBookmarks.EXCLUDE
      } else if (queryFilter == FilterOption.StarredOnly) {
        getBookmarksParams.starredOnly = true
      } else if (queryFilter == FilterOption.StarredOnlyWithArchived) {
        getBookmarksParams.archived = ArchivedBookmarks.INCLUDE
        getBookmarksParams.starredOnly = true
      } else if (
        queryFilter == FilterOption.StarredOnlyWithArchivedWithoutNsfw
      ) {
        getBookmarksParams.archived = ArchivedBookmarks.INCLUDE
        getBookmarksParams.starredOnly = true
        getBookmarksParams.nsfw = NsfwBookmarks.EXCLUDE
      } else if (queryFilter == FilterOption.StarredOnlyWithoutNsfw) {
        getBookmarksParams.starredOnly = true
        getBookmarksParams.nsfw = NsfwBookmarks.EXCLUDE
      } else if (queryFilter == FilterOption.NsfwOnly) {
        getBookmarksParams.nsfw = NsfwBookmarks.EXCLUSIVE
      } else if (queryFilter == FilterOption.NsfwOnlyWithArchived) {
        getBookmarksParams.nsfw = NsfwBookmarks.EXCLUSIVE
        getBookmarksParams.archived = ArchivedBookmarks.INCLUDE
      } else if (queryFilter == FilterOption.ArchivedOnly) {
        getBookmarksParams.archived = ArchivedBookmarks.EXCLUSIVE
      } else if (queryFilter == FilterOption.ArchivedOnlyWithoutNsfw) {
        getBookmarksParams.archived = ArchivedBookmarks.EXCLUSIVE
        getBookmarksParams.nsfw = NsfwBookmarks.EXCLUDE
      }
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

  return { getBookmarks }
}
