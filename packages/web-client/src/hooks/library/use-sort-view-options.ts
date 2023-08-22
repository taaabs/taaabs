import { updateSearchParam } from '@/utils/update-query-param'
import { Sort } from '@shared/types/modules/bookmarks/sort'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useShallowSearchParams } from '@/hooks/use-push-state-listener'

export const useSortViewOptions = () => {
  const queryParams = useShallowSearchParams()
  const [currentSort, setCurrentSort] = useState<Sort>(
    Object.values(Sort)[
      parseInt(
        queryParams.get('s') ||
          Object.values(Sort)
            .indexOf(BookmarksFetchingDefaults.Common.sort)
            .toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const querySort = queryParams.get('s')

    if (querySort != Object.values(Sort).indexOf(currentSort).toString()) {
      setCurrentSort(
        Object.values(Sort)[
          parseInt(
            querySort ||
              Object.values(Sort)
                .indexOf(BookmarksFetchingDefaults.Common.sort)
                .toString(),
          )
        ],
      )
    }
  }, [queryParams])

  const setSortQueryParam = (sort: Sort) => {
    const updatedQueryParams = updateSearchParam(
      queryParams,
      's',
      Object.values(Sort).indexOf(sort).toString(),
    )

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updatedQueryParams,
    )
  }

  return { currentSort, setSortQueryParam }
}
