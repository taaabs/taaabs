import { updateSearchParam } from '@/utils/update-query-param'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useShallowSearchParams } from '@/hooks/use-push-state-listener'

export const useSortByViewOptions = () => {
  const queryParams = useShallowSearchParams()
  const [currentSortBy, setCurrentSortBy] = useState<SortBy>(
    Object.values(SortBy)[
      parseInt(
        queryParams.get('s') ||
          Object.values(SortBy)
            .indexOf(BookmarksFetchingDefaults.Common.sortBy)
            .toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const querySortBy = queryParams.get('s')

    if (
      querySortBy != Object.values(SortBy).indexOf(currentSortBy).toString()
    ) {
      setCurrentSortBy(
        Object.values(SortBy)[
          parseInt(
            querySortBy ||
              Object.values(SortBy)
                .indexOf(BookmarksFetchingDefaults.Common.sortBy)
                .toString(),
          )
        ],
      )
    }
  }, [queryParams])

  const setSortByQueryParam = (sortBy: SortBy) => {
    let updatedQueryParams: any
    updatedQueryParams = updateSearchParam(
      queryParams,
      's',
      sortBy == BookmarksFetchingDefaults.Common.sortBy
        ? undefined
        : Object.values(SortBy).indexOf(sortBy).toString(),
    )

    if (queryParams.get('gte')) {
      updatedQueryParams = updateSearchParam(updatedQueryParams, 'gte')
    }

    if (queryParams.get('lte')) {
      updatedQueryParams = updateSearchParam(updatedQueryParams, 'lte')
    }

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

  return { currentSortBy, setSortByQueryParam }
}
