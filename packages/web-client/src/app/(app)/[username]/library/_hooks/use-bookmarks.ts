import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { useParams } from 'next/navigation'
import { use_library_dispatch, use_library_selector } from './store'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useEffect, useState } from 'react'
import { LibraryFilter } from '@shared/types/common/library-filter'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { Order } from '@shared/types/modules/bookmarks/order'
import { use_shallow_search_params } from '@web-ui/hooks/use-shallow-search-params'
import { bookmarks_actions } from '@repositories/stores/user-public/library/bookmarks/bookmarks.slice'

export const use_bookmarks = () => {
  const queryParams = use_shallow_search_params()
  const params = useParams()
  const dispatch = use_library_dispatch()
  const { bookmarks, has_more_bookmarks } = use_library_selector(
    (state) => state.bookmarks,
  )
  const [lastQueryTags, setLastQueryTags] = useState<string | null>(null)
  const [lastQueryCatId, setLastQueryCatId] = useState<string | null>(null)
  const [lastQueryFilter, setLastQueryFilter] = useState<string | null>(null)
  const [lastQueryOrderBy, setLastQuerySortBy] = useState<string | null>(null)
  const [lastQueryOrder, setLastQueryOrder] = useState<string | null>(null)
  const [lastQueryYyyymmGte, setLastQueryYyyymmGte] = useState<string | null>(
    null,
  )
  const [lastQueryYyyymmLte, setLastQueryYyyymmLte] = useState<string | null>(
    null,
  )

  const get_bookmarks = ({
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
      bookmarks_actions.get_bookmarks({
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
      querySortBy != lastQueryOrderBy ||
      queryOrder != lastQueryOrder ||
      queryYyyyGte != lastQueryYyyymmGte ||
      queryYyyyLte != lastQueryYyyymmLte
    ) {
      get_bookmarks({})
    }
  }, [queryParams])

  useUpdateEffect(() => {
    sessionStorage.setItem(
      `bookmarks_${queryParams.toString()}`,
      JSON.stringify(bookmarks),
    )
    sessionStorage.setItem(
      `hasMoreBookmarks_${queryParams.toString()}`,
      JSON.stringify(has_more_bookmarks),
    )
  }, [bookmarks])

  useEffect(() => {
    const bookmarks = sessionStorage.getItem(
      `bookmarks_${queryParams.toString()}`,
    )

    if (bookmarks) {
      dispatch(bookmarks_actions.set_bookmarks(JSON.parse(bookmarks)))
      const hasMoreBookmarks = sessionStorage.getItem(
        `hasMoreBookmarks_${queryParams.toString()}`,
      )
      if (hasMoreBookmarks) {
        dispatch(
          bookmarks_actions.set_has_more_bookmarks(hasMoreBookmarks == 'true'),
        )
      }
    } else {
      get_bookmarks({})
    }

    return () => {
      for (const key in sessionStorage) {
        if (key.substring(0, 9) == 'bookmarks') {
          sessionStorage.removeItem(key)
        } else if (key.substring(0, 16) == 'hasMoreBookmarks') {
          sessionStorage.removeItem(key)
        }
      }
    }
  }, [])

  return { get_bookmarks }
}
