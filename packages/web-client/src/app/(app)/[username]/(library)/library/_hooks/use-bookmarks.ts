import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { SortBy } from '@shared/dtos/modules/bookmarks/sort-by'
import { useParams, useSearchParams } from 'next/navigation'
import { useLibraryDispatch, useLibrarySelector } from './store'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { bookmarksActions } from '@repositories/stores/other-user/library/bookmarks/bookmarks.slice'
import { useEffect } from 'react'

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

  return { getBookmarks }
}
