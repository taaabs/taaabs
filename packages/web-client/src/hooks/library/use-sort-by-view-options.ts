import { update_query_params } from '@/utils/update-query-params'
import { SortBy } from '@shared/types/modules/bookmarks/sort-by'
import { BookmarksFetchingDefaults } from '@shared/types/modules/bookmarks/bookmarks-fetching-defaults'
import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams, useSearchParams } from 'next/navigation'
import { clear_library_session_storage } from '@/utils/clear_library_session_storage'

export const use_sort_by_view_options = () => {
  const query_params = useSearchParams()
  const params = useParams()
  const [current_sort_by, set_current_sort_by] = useState<SortBy>(
    Object.values(SortBy)[
      parseInt(
        query_params.get('s') ||
          Object.values(SortBy)
            .indexOf(BookmarksFetchingDefaults.Common.sort_by)
            .toString(),
      )
    ],
  )
  // This is set whenever new "first" bookmarks arrive and is neeeded
  // to prevent incorrect date flashing when changing sortby option.
  const [commited_sort_by, set_commited_sort_by] = useState<SortBy>()

  useUpdateEffect(() => {
    const query_sort_by = query_params.get('s')

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
  }, [query_params])

  const set_sort_by_query_param = (sortby: SortBy) => {
    let updated_query_params: any
    updated_query_params = update_query_params(
      query_params,
      's',
      sortby == BookmarksFetchingDefaults.Common.sort_by
        ? undefined
        : Object.values(SortBy).indexOf(sortby).toString(),
    )

    updated_query_params = update_query_params(updated_query_params, 'lte')
    updated_query_params = update_query_params(updated_query_params, 'gte')

    clear_library_session_storage({
      username: params.username as string,
      query_parms: updated_query_params.toString(),
    })

    window.history.pushState(
      {},
      '',
      window.location.pathname + '?' + updated_query_params,
    )
  }

  return {
    current_sort_by,
    set_sort_by_query_param,
    commited_sort_by,
    set_commited_sort_by,
  }
}
