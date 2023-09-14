import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { useParams } from 'next/navigation'
import { useLibraryDispatch, useLibrarySelector } from './store'
import { useEffect, useState } from 'react'
import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { bookmarksActions } from '@repositories/stores/user-authorized/library/bookmarks/bookmarks.slice'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

enum SessionStorageKey {
  Bookmarks = 'bookmarks',
  HasMoreBookmarks = 'hasMoreBookmarks',
  QueryParams = 'queryParams',
}

export const useBookmarks = () => {
  const queryParams = use_shallow_search_params()
  const params = useParams()
  const dispatch = useLibraryDispatch()
  const { bookmarks, hasMoreBookmarks } = useLibrarySelector(
    (state) => state.bookmarks,
  )
  const [lastQueryTags, setLastQueryTags] = useState<string | null>(null)
  const [lastQueryCatId, setLastQueryCatId] = useState<string | null>(null)
  const [lastQueryFilter, setLastQueryFilter] = useState<string | null>(null)
  const [lastQuerySortBy, setLastQuerySortBy] = useState<string | null>(null)
  const [lastQueryOrder, setLastQueryOrder] = useState<string | null>(null)
  const [lastQueryYyyymmGte, setLastQueryYyyymmGte] = useState<string | null>(
    null,
  )
  const [lastQueryYyyymmLte, setLastQueryYyyymmLte] = useState<string | null>(
    null,
  )

  const getBookmarks = ({
    shouldGetNextPage,
  }: {
    shouldGetNextPage?: boolean
  }) => {
    const getBookmarksParams: BookmarksParams.Public = {
      username: params.username as string,
    }

    const queryTags = queryParams.get('t')
    setLastQueryTags(queryTags)
    if (queryTags) {
      getBookmarksParams.tags = queryTags.split(',')
    }

    const queryCategoryId = queryParams.get('c')
    setLastQueryCatId(queryCategoryId)
    if (queryCategoryId) {
      getBookmarksParams.category_id = queryCategoryId
    }

    const queryFilter = queryParams.get('f')
    setLastQueryFilter(queryFilter)
    if (queryFilter) {
      getBookmarksParams.filter =
        Object.values(LibraryFilter)[parseInt(queryFilter)]
    }

    const querySortBy = queryParams.get('s')
    setLastQuerySortBy(querySortBy)
    if (querySortBy) {
      getBookmarksParams.sort_by = Object.values(SortBy)[parseInt(querySortBy)]
    }

    const queryOrder = queryParams.get('o')
    setLastQueryOrder(queryOrder)
    if (queryOrder) {
      getBookmarksParams.order = Object.values(Order)[parseInt(queryOrder)]
    }

    const queryYyyymmGte = queryParams.get('gte')
    setLastQueryYyyymmGte(queryYyyymmGte)
    if (queryYyyymmGte) {
      getBookmarksParams.yyyymm_gte = parseInt(queryYyyymmGte)
    }

    const queryYyyymmLte = queryParams.get('lte')
    setLastQueryYyyymmLte(queryYyyymmLte)
    if (queryYyyymmLte) {
      getBookmarksParams.yyyymm_lte = parseInt(queryYyyymmLte)
    }

    if (shouldGetNextPage) {
      if (!bookmarks) throw 'Bookmarks should be there.'
      getBookmarksParams.after = bookmarks[bookmarks.length - 1].id
    }

    dispatch(
      bookmarksActions.get_bookmarks({
        query_params: getBookmarksParams,
        api_url: process.env.NEXT_PUBLIC_API_URL,
      }),
    )
  }

  useUpdateEffect(() => {
    const queryTags = queryParams.get('t')
    const queryCategoryId = queryParams.get('c')
    const queryFilter = queryParams.get('f')
    const querySortBy = queryParams.get('s')
    const queryOrder = queryParams.get('o')
    const queryYyyyGte = queryParams.get('gte')
    const queryYyyyLte = queryParams.get('lte')

    if (
      queryParams.size == 0 ||
      queryTags != lastQueryTags ||
      queryCategoryId != lastQueryCatId ||
      queryFilter != lastQueryFilter ||
      querySortBy != lastQuerySortBy ||
      queryOrder != lastQueryOrder ||
      queryYyyyGte != lastQueryYyyymmGte ||
      queryYyyyLte != lastQueryYyyymmLte
    ) {
      getBookmarks({})
    }
  }, [queryParams])

  useUpdateEffect(() => {
    sessionStorage.setItem(
      SessionStorageKey.Bookmarks,
      JSON.stringify(bookmarks),
    )
    sessionStorage.setItem(
      SessionStorageKey.HasMoreBookmarks,
      JSON.stringify(hasMoreBookmarks),
    )
  }, [bookmarks])

  useEffect(() => {
    const previousQueryParams = sessionStorage.getItem(
      SessionStorageKey.QueryParams,
    )
    if (queryParams.toString() == previousQueryParams) {
      const bookmarks = sessionStorage.getItem(SessionStorageKey.Bookmarks)

      if (bookmarks) {
        dispatch(bookmarksActions.setBookmarks(JSON.parse(bookmarks)))
        const hasMoreBookmarks = sessionStorage.getItem(
          SessionStorageKey.HasMoreBookmarks,
        )
        if (hasMoreBookmarks) {
          dispatch(
            bookmarksActions.setHasMoreBookmarks(hasMoreBookmarks == 'true'),
          )
        }
      } else {
        getBookmarks({})
      }
    } else {
      getBookmarks({})
    }

    return () => {
      sessionStorage.removeItem(SessionStorageKey.Bookmarks)
      sessionStorage.removeItem(SessionStorageKey.HasMoreBookmarks)
    }
  }, [])

  return { getBookmarks }
}
