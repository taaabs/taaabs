import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { useParams, useSearchParams } from 'next/navigation'
import { useLibraryDispatch, useLibrarySelector } from './store'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { bookmarksActions } from '@repositories/stores/other-user/library/bookmarks/bookmarks.slice'
import { useEffect, useState } from 'react'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { Order } from '@shared/types/modules/bookmarks/order'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const useBookmarks = () => {
  const queryParams = useSearchParams()
  const params = useParams()
  const dispatch = useLibraryDispatch()
  const { bookmarks, hasMoreBookmarks } = useLibrarySelector(
    (state) => state.bookmarks,
  )
  const [lastQueryTags, setLastQueryTags] = useState<string | null>(null)
  const [lastQueryCatId, setLastQueryCatId] = useState<string | null>(null)
  const [lastQueryFilter, setLastQueryFilter] = useState<string | null>(null)
  const [lastQueryOrderBy, setLastQueryOrderBy] = useState<string | null>(null)
  const [lastQueryOrder, setLastQueryOrder] = useState<string | null>(null)
  const [lastQueryYyyymmGte, setLastQueryYyyymmGte] = useState<string | null>(
    null,
  )
  const [lastQueryYyyymmLte, setLastQueryYyyymmLte] = useState<string | null>(
    null,
  )

  const getBookmarks = ({ getNextPage }: { getNextPage?: boolean }) => {
    const getBookmarksParams: BookmarksParams.Public = {
      username: params.username,
    }

    const queryTags = queryParams.get('t')
    if (queryTags) {
      setLastQueryTags(queryTags)
      getBookmarksParams.tags = queryTags.split(',')
    }

    const queryCategoryId = queryParams.get('c')
    if (queryCategoryId) {
      setLastQueryCatId(queryCategoryId)
      getBookmarksParams.categoryId = queryCategoryId
    }

    const queryFilter = queryParams.get('f')
    if (queryFilter) {
      setLastQueryFilter(queryFilter)
      getBookmarksParams.filter =
        Object.values(LibraryFilter)[parseInt(queryFilter)]
    }

    const queryOrderBy = queryParams.get('b')
    if (queryOrderBy) {
      setLastQueryOrderBy(queryOrderBy)
      getBookmarksParams.orderBy =
        Object.values(OrderBy)[parseInt(queryOrderBy)]
    }

    const queryOrder = queryParams.get('o')
    if (queryOrder) {
      setLastQueryOrder(queryOrder)
      getBookmarksParams.order = Object.values(Order)[parseInt(queryOrder)]
    }

    const queryYyyymmGte = queryParams.get('gte')
    if (queryYyyymmGte) {
      setLastQueryYyyymmGte(queryYyyymmGte)
      getBookmarksParams.yyyymmGte = parseInt(queryYyyymmGte)
    }

    const queryYyyymmLte = queryParams.get('lte')
    if (queryYyyymmLte) {
      setLastQueryYyyymmLte(queryYyyymmLte)
      getBookmarksParams.yyyymmLte = parseInt(queryYyyymmLte)
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
    const queryTags = queryParams.get('t')
    const queryCategoryId = queryParams.get('c')
    const queryFilter = queryParams.get('f')
    const queryOrderBy = queryParams.get('b')
    const queryOrder = queryParams.get('o')
    const queryYyyyGte = queryParams.get('gte')
    const queryYyyyLte = queryParams.get('lte')

    if (
      queryTags != lastQueryTags ||
      queryCategoryId != lastQueryCatId ||
      queryFilter != lastQueryFilter ||
      queryOrderBy != lastQueryOrderBy ||
      queryOrder != lastQueryOrder ||
      queryYyyyGte != lastQueryYyyymmGte ||
      queryYyyyLte != lastQueryYyyymmLte
    ) {
      getBookmarks({})
    }
  }, [queryParams])

  useUpdateEffect(() => {
    sessionStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    sessionStorage.setItem('hasMoreBookmarks', JSON.stringify(hasMoreBookmarks))
  }, [bookmarks])

  useEffect(() => {
    const bookmarks = sessionStorage.getItem('bookmarks')
    if (bookmarks) {
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
    }
  }, [])

  return { getBookmarks }
}
