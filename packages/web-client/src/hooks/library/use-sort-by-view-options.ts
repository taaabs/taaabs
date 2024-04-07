import { update_search_params } from '@/utils/update-query-params'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useSearchParams } from 'next/navigation'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'

export const use_sort_by_view_options = () => {
  const search_params = useSearchParams()
  const params = useParams()
  const [current_sort_by, set_current_sort_by] = useState<SortBy>(
    Object.values(SortBy)[
      parseInt(
        search_params.get('s') ||
          Object.values(SortBy)
            .indexOf(BookmarksFetchingDefaults.Common.sort_by)
            .toString(),
      )
    ],
  )

  useUpdateEffect(() => {
    const query_sort_by = search_params.get('s')

    if (
      query_sort_by != Object.values(SortBy).indexOf(current_sort_by).toString()
    ) {
      set_current_sort_by(
        Object.values(SortBy)[
          parseInt(
            query_sort_by ||
              Object.values(SortBy)
                .indexOf(BookmarksFetchingDefaults.Common.sort_by)
                .toString(),
          )
        ],
      )
    }
  }, [search_params])

  const set_sort_by_query_param = (sort_by: SortBy) => {
    let updated_search_params: any
    updated_search_params = update_search_params(
      search_params,
      's',
      sort_by == BookmarksFetchingDefaults.Common.sort_by
        ? undefined
        : Object.values(SortBy).indexOf(sort_by).toString(),
    )

    updated_search_params = update_search_params(updated_search_params, 'lte')
    updated_search_params = update_search_params(updated_search_params, 'gte')

    clear_library_session_storage({
      username: params.username as string,
      search_params: updated_search_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_search_params,
    )
  }

  return {
    current_sort_by,
    set_sort_by_query_param,
  }
}
